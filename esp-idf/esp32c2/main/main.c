#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "nvs_flash.h"
#include "esp_wifi.h"
#include "mqtt_client.h"
#include "esp_event.h"
#include "esp_err.h"
#include "esp_log.h"
#include "freertos/semphr.h"

#define WIFI_SSID "odddouglas"     // Wi-Fi SSID
#define WIFI_PASSWORD "odddouglas" // Wi-Fi 密码

#define MQTT_ADDRESS "mqtt://e5e7404266.st1.iotda-device.cn-north-4.myhuaweicloud.com:1883"
#define MQTT_CLIENFID "67fe4c765367f573f7830638_esp32_0_0_2025051303"
#define MQTT_USERNAME "67fe4c765367f573f7830638_esp32"
#define MQTT_PASSWORD "beb57fa257b6fc3dc92d71a515d059d0788640a6f17b82c78860c18c5fde50ff"

#define DEVICE_ID "67fe4c765367f573f7830638_esp32"
#define SERVER_ID "gateway_data"
#define MQTT_TOPIC_REPORT "$oc/devices/" DEVICE_ID "/sys/properties/report"
#define MQTT_TOPIC_COMMAND "$oc/devices/" DEVICE_ID "/sys/commands/#"
#define MQTT_TOPIC_COMMAND_RESPOND "$oc/devices/" DEVICE_ID "/sys/commands/response/request_id="

static const char *TAG_WIFI = "WIFI";
static const char *TAG_MQTT = "MQTT";

static esp_mqtt_client_handle_t mqtt_handle = NULL;
static SemaphoreHandle_t s_wifi_connect_sem = NULL;
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
            xSemaphoreGive(s_wifi_connect_sem); //释放信号量，使得mqtt开始连接
            break;

        default:
            ESP_LOGI(TAG_WIFI, "IP_DEFAULT:");
            break;
        }
    }
}

void mqtt_event_callback(void *event_handler_arg,
                         esp_event_base_t event_base,
                         int32_t event_id,
                         void *event_data)
{
    esp_mqtt_event_handle_t data = (esp_mqtt_event_handle_t)event_data;

    switch (event_id)
    {
    case MQTT_EVENT_CONNECTED:
        ESP_LOGI(TAG_MQTT, "MQTT_EVENT_CONNECTED");
        esp_mqtt_client_subscribe(mqtt_handle, MQTT_TOPIC_COMMAND, 1);
        break;

    case MQTT_EVENT_DISCONNECTED:
        ESP_LOGI(TAG_MQTT, "MQTT_EVENT_DISCONNECTED");
        break;

    case MQTT_EVENT_SUBSCRIBED:
        ESP_LOGI(TAG_MQTT, "MQTT_EVENT_SUBSCRIBED ACK");
        // const char *report_data = "test";
        // esp_mqtt_client_publish(mqtt_handle, MQTT_TOPIC_REPORT, report_data, strlen(report_data), 1, 0);
        break;

    case MQTT_EVENT_UNSUBSCRIBED:
        ESP_LOGI(TAG_MQTT, "MQTT_EVENT_UNSUBSCRIBED ACK");
        break;

    case MQTT_EVENT_PUBLISHED:
        ESP_LOGI(TAG_MQTT, "MQTT_EVENT_PUBLISHED ACK, msg_id=%d", data->msg_id);

        break;
 
    case MQTT_EVENT_DATA:
        ESP_LOGI(TAG_MQTT, "MQTT_EVENT_DATA");
        printf("TOPIC=%.*s\r\n", data->topic_len, data->topic);
        printf("DATA=%.*s\r\n", data->data_len, data->data);
        break;

    case MQTT_EVENT_ERROR:
        ESP_LOGE(TAG_MQTT, "MQTT_EVENT_ERROR");
        break;

    default:
        ESP_LOGW(TAG_MQTT, "MQTT_DEFAULT");
        break;
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
void mqtt_start(void)
{
    esp_mqtt_client_config_t mqtt_cfg = {
        .broker.address.uri = MQTT_ADDRESS,
        .credentials.client_id = MQTT_CLIENFID,
        .credentials.username = MQTT_USERNAME,
        .credentials.authentication.password = MQTT_PASSWORD,
    };
    mqtt_handle = esp_mqtt_client_init(&mqtt_cfg);
    esp_mqtt_client_register_event(mqtt_handle, ESP_EVENT_ANY_ID, mqtt_event_callback, NULL);
    ESP_ERROR_CHECK(esp_mqtt_client_start(mqtt_handle));
}
// 主程序入口
void app_main(void)
{
    s_wifi_connect_sem = xSemaphoreCreateBinary(); // 创建信号量
    wifi_start();
    xSemaphoreTake(s_wifi_connect_sem, portMAX_DELAY); // 阻塞等待信号量释放
    mqtt_start();
    return;
}
