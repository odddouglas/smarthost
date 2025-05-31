
idf_component_register(SRCS "main.c" 
                       INCLUDE_DIRS "."
                       REQUIRES "nvs_flash" "esp_http_client" "bsp_mqtt" "bsp_wifi" "bsp_uart" "bsp_ble" "bsp_hw_timer" "wifi_provisioning")
