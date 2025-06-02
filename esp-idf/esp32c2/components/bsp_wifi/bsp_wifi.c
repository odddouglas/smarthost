#include "bsp_wifi.h"
static const char *TAG = "WIFI";
bool is_provisioning = false; // 标志是否处于配网流程中

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
            ESP_LOGI(TAG, "WIFI_EVENT_STA_START");
            esp_wifi_connect();
            break;

        case WIFI_EVENT_STA_CONNECTED:
            ESP_LOGI(TAG, "WIFI_EVENT_STA_CONNECTED");
            break;

        case WIFI_EVENT_STA_DISCONNECTED:
            ESP_LOGW(TAG, "WIFI_EVENT_STA_DISCONNECTED");
            esp_wifi_connect();
            break;

        default:
            ESP_LOGI(TAG, "WIFI_DEFAULT:");
            break;
        }
    }
    if (event_base == WIFI_PROV_EVENT)
    {
        switch (event_id)
        {
        case WIFI_PROV_START:
            ESP_LOGI(TAG, "PROVISIONING STARTED");
            break;
        case WIFI_PROV_CRED_RECV:
        {
            wifi_sta_config_t *wifi_sta_cfg = (wifi_sta_config_t *)event_data;
            ESP_LOGI(TAG, "RECEIVED WI-FI CREDENTIALS:\n\tSSID: %s\n\tPASSWORD: %s",
                     (const char *)wifi_sta_cfg->ssid,
                     (const char *)wifi_sta_cfg->password);
            break;
        }
        case WIFI_PROV_CRED_FAIL:
            ESP_LOGE(TAG, "PROVISIONING FAILED!");
            break;
        case WIFI_PROV_CRED_SUCCESS:
            ESP_LOGI(TAG, "PROVISIONING SUCCESSFUL!");
            break;
        case WIFI_PROV_END:
            ESP_LOGI(TAG, "PROVISIONING COMPLETE, DEINITIALIZING...");
            xSemaphoreGive(s_wifi_connect_sem); // 释放信号量，使得mqtt开始连接
            wifi_prov_mgr_deinit();
            break;
        }
    }
    else if (event_base == IP_EVENT)
    {
        switch (event_id)
        {
        case IP_EVENT_STA_GOT_IP:
            ESP_LOGI(TAG, "IP_EVENT_STA_GOT_IP");
            if (!is_provisioning)
            {
                // 只有不是配网流程中，才释放信号量
                xSemaphoreGive(s_wifi_connect_sem);
            }
            break;

        default:
            ESP_LOGI(TAG, "IP_DEFAULT:");
            break;
        }
    }
}

void wifi_start(void)
{
    // ESP_ERROR_CHECK(nvs_flash_init());                // 初始化 NVS（非易失性存储）main中初始化了，这里就不用了
    // ESP_ERROR_CHECK(esp_netif_init());                // 初始化网络接口
    // ESP_ERROR_CHECK(esp_event_loop_create_default()); // 创建默认事件循环

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

void wifi_start_provision(void)
{
    // 创建默认网络接口
    esp_netif_create_default_wifi_sta();
    esp_netif_create_default_wifi_ap();

    // 初始化 Wi-Fi
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));
    ESP_ERROR_CHECK(esp_wifi_set_storage(WIFI_STORAGE_RAM));
    ESP_ERROR_CHECK(esp_wifi_start());

    // 注册事件处理器（使用修正签名）
    ESP_ERROR_CHECK(esp_event_handler_register(WIFI_PROV_EVENT, ESP_EVENT_ANY_ID, wifi_event_callback, NULL)); // 注册 PROV 配网事件处理函数
    // ESP_ERROR_CHECK(esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, wifi_event_callback, NULL));      // 注册 Wi-Fi 事件处理函数
    ESP_ERROR_CHECK(esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, wifi_event_callback, NULL)); // 注册 IP 获取事件处理函数

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
        is_provisioning = true;
        ESP_LOGI(TAG, "Starting provisioning...");

        const char *service_name = "SMARTHOST_PROV";
        const char *service_key = "abcd1234"; // SoftAP 密码
        const char *pop = "abcd1234";         // Proof of possession

        wifi_prov_security_t security = WIFI_PROV_SECURITY_1;

        ESP_ERROR_CHECK(wifi_prov_mgr_start_provisioning(security, pop, service_name, service_key));
    }
    else
    {
        is_provisioning = false;
        ESP_LOGI(TAG, "Device already provisioned, connecting to Wi-Fi...");

        wifi_config_t wifi_config;
        ESP_ERROR_CHECK(esp_wifi_get_config(WIFI_IF_STA, &wifi_config));
        ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
        ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config));
        ESP_ERROR_CHECK(esp_wifi_connect());

        wifi_prov_mgr_deinit();
    }
}