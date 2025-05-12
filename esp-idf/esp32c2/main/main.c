#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "nvs_flash.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_err.h"
#include "esp_log.h"

#define WIFI_SSID "odddouglas"     // Wi-Fi SSID
#define WIFI_PASSWORD "odddouglas" // Wi-Fi 密码

static const char *TAG = "WIFI_EVENT"; // 日志标签

// Wi-Fi 事件处理函数
void wifi_event_handle(void *event_handler_arg,
                       esp_event_base_t event_base,
                       int32_t event_id,
                       void *event_data)
{
    if (event_base == WIFI_EVENT) // 判断是否为 Wi-Fi 事件
    {
        switch (event_id)
        {
        case WIFI_EVENT_STA_START:                                    // Wi-Fi 启动事件
            esp_wifi_connect();                                       // 尝试连接 Wi-Fi
            ESP_LOGI(TAG, "Wi-Fi started, attempting to connect..."); // 输出启动日志
            break;
        case WIFI_EVENT_STA_CONNECTED:              // Wi-Fi 连接成功事件
            ESP_LOGI(TAG, "Wi-Fi connected to AP"); // 输出连接成功日志
            break;
        case WIFI_EVENT_STA_DISCONNECTED:
            ESP_LOGW(TAG, "Disconnected from Wi-Fi, retrying ...");
            // vTaskDelay(pdMS_TO_TICKS(5000)); // 延时 5000ms = 5秒
            esp_wifi_connect(); // 自动重连
            break;

        default:
            ESP_LOGI(TAG, "Unhandled IP event: %ld", event_id); // 输出未处理的事件
            break;
        }
    }
    else if (event_base == IP_EVENT) // 判断是否为 IP 事件
    {
        switch (event_id)
        {
        case IP_EVENT_STA_GOT_IP:      // 获取 IP 地址事件
            ESP_LOGI(TAG, "Got IP: "); // 输出获取到的 IP 地址
            break;

        default:
            ESP_LOGI(TAG, "Unhandled IP event: %ld", event_id); // 输出未处理的 IP 事件
            break;
        }
    }
}

// 主程序入口
void app_main(void)
{
    ESP_ERROR_CHECK(nvs_flash_init());                // 初始化 NVS（非易失性存储）
    ESP_ERROR_CHECK(esp_netif_init());                // 初始化网络接口
    ESP_ERROR_CHECK(esp_event_loop_create_default()); // 创建默认事件循环

    esp_netif_create_default_wifi_sta(); // 创建默认的 Wi-Fi 客户端接口（STA模式）

    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT(); // 配置 Wi-Fi 初始化参数
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));                // 初始化 Wi-Fi 驱动

    esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, wifi_event_handle, NULL);  // 注册 Wi-Fi 事件处理函数
    esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, wifi_event_handle, NULL); // 注册 IP 获取事件处理函数

    wifi_config_t wifi_config = {
        .sta.threshold.authmode = WIFI_AUTH_WPA2_PSK, // 设置 Wi-Fi 加密方式为 WPA2-PSK
        .sta.pmf_cfg.capable = true,                  // 启用保护管理帧（PMF）
        .sta.pmf_cfg.required = false,                // 不强制要求保护管理帧
    };

    memset(&wifi_config.sta.ssid, 0, sizeof(wifi_config.sta.ssid)); // 清空 SSID
    memcpy(wifi_config.sta.ssid, WIFI_SSID, strlen(WIFI_SSID));     // 设置 SSID

    memset(&wifi_config.sta.password, 0, sizeof(wifi_config.sta.password)); // 清空密码
    memcpy(wifi_config.sta.password, WIFI_PASSWORD, strlen(WIFI_PASSWORD)); // 设置密码

    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));               // 设置 Wi-Fi 模式为 STA（客户端模式）
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config)); // 设置 Wi-Fi 配置

    ESP_ERROR_CHECK(esp_wifi_start()); // 启动 Wi-Fi

    return;
}
