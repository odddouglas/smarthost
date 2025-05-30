#include <string.h>
#include "nvs_flash.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "esp_netif.h"

#include "wifi_provisioning/manager.h"
#include "wifi_provisioning/scheme_softap.h"
#include "protocomm_security.h"

static const char *TAG = "wifi_prov_softap";

// 配网事件处理器（签名修改为 int32_t）
static void provision_event_handler(void *arg, esp_event_base_t event_base,
                                    int32_t event_id, void *event_data)
{
    if (event_base == WIFI_PROV_EVENT)
    {
        switch (event_id)
        {
        case WIFI_PROV_START:
            ESP_LOGI(TAG, "Provisioning started");
            break;

        case WIFI_PROV_CRED_RECV:
        {
            wifi_sta_config_t *wifi_sta_cfg = (wifi_sta_config_t *)event_data;
            ESP_LOGI(TAG, "Received Wi-Fi credentials:\n\tSSID: %s\n\tPassword: %s",
                     (const char *)wifi_sta_cfg->ssid,
                     (const char *)wifi_sta_cfg->password);
            break;
        }

        case WIFI_PROV_CRED_FAIL:
            ESP_LOGE(TAG, "Provisioning failed!");
            break;

        case WIFI_PROV_CRED_SUCCESS:
            ESP_LOGI(TAG, "Provisioning successful!");

            // 获取并连接 Wi-Fi
            wifi_config_t wifi_config;
            ESP_ERROR_CHECK(esp_wifi_get_config(WIFI_IF_STA, &wifi_config));
            ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
            ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config));
            ESP_ERROR_CHECK(esp_wifi_connect());
            break;

        case WIFI_PROV_END:
            ESP_LOGI(TAG, "Provisioning complete, deinitializing...");
            wifi_prov_mgr_deinit();
            break;
        }
    }
}

void app_main(void)
{
    // 初始化 NVS
    ESP_ERROR_CHECK(nvs_flash_init());
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());

    // 创建默认网络接口
    esp_netif_create_default_wifi_sta();
    esp_netif_create_default_wifi_ap();

    // 初始化 Wi-Fi
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));
    ESP_ERROR_CHECK(esp_wifi_set_storage(WIFI_STORAGE_RAM));
    ESP_ERROR_CHECK(esp_wifi_start());

    // 注册事件处理器（使用修正签名）
    ESP_ERROR_CHECK(esp_event_handler_register(WIFI_PROV_EVENT, ESP_EVENT_ANY_ID, &provision_event_handler, NULL));

    // 初始化配网管理器
    bool provisioned = false;
    wifi_prov_mgr_config_t config = {
        .scheme = wifi_prov_scheme_softap,
        .scheme_event_handler = WIFI_PROV_EVENT_HANDLER_NONE};
    ESP_ERROR_CHECK(wifi_prov_mgr_init(config));

    // 强制清除上次配网信息（可选，开发测试阶段建议保留）
    wifi_prov_mgr_reset_provisioning();

    ESP_ERROR_CHECK(wifi_prov_mgr_is_provisioned(&provisioned));

    if (!provisioned)
    {
        ESP_LOGI(TAG, "Starting provisioning...");

        const char *service_name = "ESP32_PROV";
        const char *service_key = "abcd1234"; // SoftAP 密码
        const char *pop = "abcd1234";         // Proof of possession

        wifi_prov_security_t security = WIFI_PROV_SECURITY_1;

        ESP_ERROR_CHECK(wifi_prov_mgr_start_provisioning(security, pop, service_name, service_key));
    }
    else
    {
        ESP_LOGI(TAG, "Device already provisioned, connecting to Wi-Fi...");

        wifi_config_t wifi_config;
        ESP_ERROR_CHECK(esp_wifi_get_config(WIFI_IF_STA, &wifi_config));
        ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
        ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config));
        ESP_ERROR_CHECK(esp_wifi_connect());

        wifi_prov_mgr_deinit();
    }
}
