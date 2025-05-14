#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"


#include "nvs_flash.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_err.h"
#include "esp_log.h"

#include "driver/uart.h"
#include "cJSON.h"
#include "huawei_iot.h"

#define WIFI_SSID "odddouglas"     // Wi-Fi SSID
#define WIFI_PASSWORD "odddouglas" // Wi-Fi 密码

#define UART_PORT_NUM UART_NUM_1
#define UART_BAUD_RATE 115200
#define UART_TX_PIN 1
#define UART_RX_PIN 3
#define BUF_SIZE 1024

static const char *TAG_WIFI = "WIFI";
static const char *TAG_UART = "UART";


static SemaphoreHandle_t s_wifi_connect_sem = NULL;

typedef struct
{
    int pcStatus;          // 主机状态 （按上位机需求，设置成0和1）
    bool pcFanIn;          // 进风风扇状态
    bool pcFanOut;         // 出风风扇状态
    char *pcFanVolume;     // 风速档位 "low" / "medium" / "high"
    bool pcLightBreathing; // 呼吸灯状态
    bool pcLightFleeting;  // 闪烁灯状态
    char *pcLightColor;    // 灯光颜色 "red" / "green" / "blue" / "white" / "purple"
    double temperature;    // 温度
    double humidity;       // 湿度
} ReportData2IoT;
// 用于存储来自云端的设备指令，下发命令
typedef struct
{
    bool pcStatus;         // 主机状态
    bool pcFanIn;          // 进风风扇状态
    bool pcFanOut;         // 出风风扇状态
    char *pcFanVolume;     // 风速档位 "low" / "medium" / "high"
    bool pcLightBreathing; // 呼吸灯状态
    bool pcLightFleeting;  // 闪烁灯状态
    char *pcLightColor;    // 灯光颜色 "red" / "green" / "blue" / "white" / "purple"
    double temperature;    // 温度
    double humidity;       // 湿度
} IssueData2MCU;

// 创建接收和发送数据实例
ReportData2IoT ReportData;
IssueData2MCU IssueData;

// Wi-Fi 事件处理函数
void wifi_event_callback(void *event_handler_arg,
                         esp_event_base_t event_base,
                         int32_t event_id,
                         void *event_data)
{
    if (event_base == WIFI_EVENT)
    {
        switch (event_id)
        {
        case WIFI_EVENT_STA_START:
            ESP_LOGI(TAG_WIFI, "WIFI_EVENT_STA_START");
            esp_wifi_connect();
            break;

        case WIFI_EVENT_STA_CONNECTED:
            ESP_LOGI(TAG_WIFI, "WIFI_EVENT_STA_CONNECTED");
            break;

        case WIFI_EVENT_STA_DISCONNECTED:
            ESP_LOGW(TAG_WIFI, "WIFI_EVENT_STA_DISCONNECTED");
            esp_wifi_connect();
            break;

        default:
            ESP_LOGI(TAG_WIFI, "WIFI_DEFAULT:");
            break;
        }
    }
    else if (event_base == IP_EVENT)
    {
        switch (event_id)
        {
        case IP_EVENT_STA_GOT_IP:
            ESP_LOGI(TAG_WIFI, "IP_EVENT_STA_GOT_IP");
            xSemaphoreGive(s_wifi_connect_sem); // 释放信号量，使得mqtt开始连接
            break;

        default:
            ESP_LOGI(TAG_WIFI, "IP_DEFAULT:");
            break;
        }
    }
}



void wifi_start(void)
{
    ESP_ERROR_CHECK(nvs_flash_init());                // 初始化 NVS（非易失性存储）
    ESP_ERROR_CHECK(esp_netif_init());                // 初始化网络接口
    ESP_ERROR_CHECK(esp_event_loop_create_default()); // 创建默认事件循环

    esp_netif_create_default_wifi_sta(); // 创建默认的 Wi-Fi 客户端接口（STA模式）

    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT(); // 配置 Wi-Fi 初始化参数
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));                // 初始化 Wi-Fi 驱动

    esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, wifi_event_callback, NULL);  // 注册 Wi-Fi 事件处理函数
    esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, wifi_event_callback, NULL); // 注册 IP 获取事件处理函数

    wifi_config_t wifi_cfg = {
        .sta.threshold.authmode = WIFI_AUTH_WPA2_PSK, // 设置 Wi-Fi 加密方式为 WPA2-PSK
        .sta.pmf_cfg.capable = true,                  // 启用保护管理帧（PMF）
        .sta.pmf_cfg.required = false,                // 不强制要求保护管理帧
    };

    memset(&wifi_cfg.sta.ssid, 0, sizeof(wifi_cfg.sta.ssid)); // 清空 SSID
    memcpy(wifi_cfg.sta.ssid, WIFI_SSID, strlen(WIFI_SSID));  // 设置 SSID

    memset(&wifi_cfg.sta.password, 0, sizeof(wifi_cfg.sta.password));    // 清空密码
    memcpy(wifi_cfg.sta.password, WIFI_PASSWORD, strlen(WIFI_PASSWORD)); // 设置密码

    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));            // 设置 Wi-Fi 模式为 STA（客户端模式）
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_cfg)); // 设置 Wi-Fi 配置

    ESP_ERROR_CHECK(esp_wifi_start()); // 启动 Wi-Fi
}

void uart_init(void)
{
    uart_config_t uart_config = {
        .baud_rate = UART_BAUD_RATE,
        .data_bits = UART_DATA_8_BITS,
        .parity = UART_PARITY_DISABLE,
        .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE};

    uart_param_config(UART_PORT_NUM, &uart_config);                                                // 配置 UART 参数
    uart_set_pin(UART_PORT_NUM, UART_TX_PIN, UART_RX_PIN, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE); // 设置 TX RX 引脚
    uart_driver_install(UART_PORT_NUM, BUF_SIZE * 2, 0, 0, NULL, 0);                               // 安装驱动（含 RX 缓冲区）
}

void uart_send_task(void *arg)
{
    const char *msg = "Hello UART\r\n";
    while (1)
    {
        uart_write_bytes(UART_PORT_NUM, msg, strlen(msg));
        vTaskDelay(pdMS_TO_TICKS(2000));
    }
}

void uart_receive_task(void *arg)
{
    uint8_t data[BUF_SIZE];
    while (1)
    {
        int len = uart_read_bytes(UART_PORT_NUM, data, BUF_SIZE - 1, pdMS_TO_TICKS(1000));
        if (len > 0)
        {
            data[len] = '\0'; // null-terminate
            ESP_LOGI(TAG_UART, "Received: %s", (char *)data);
        }
    }
}
// 主程序入口
void app_main(void)
{
    s_wifi_connect_sem = xSemaphoreCreateBinary(); // 创建信号量
    wifi_start();
    xSemaphoreTake(s_wifi_connect_sem, portMAX_DELAY); // 阻塞等待信号量释放
    mqtt_start();
    uart_init(); // 初始化串口，创建串口任务
    xTaskCreate(uart_send_task, "uart_send_task", 2048, NULL, 10, NULL);
    xTaskCreate(uart_receive_task, "uart_receive_task", 2048, NULL, 10, NULL);
    return;
}
