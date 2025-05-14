#include "bsp_wifi.h"



static const char *TAG_WIFI = "WIFI";
#define WIFI_SSID "odddouglas"     // Wi-Fi SSID
#define WIFI_PASSWORD "odddouglas" // Wi-Fi 密码

extern SemaphoreHandle_t s_wifi_connect_sem;

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
