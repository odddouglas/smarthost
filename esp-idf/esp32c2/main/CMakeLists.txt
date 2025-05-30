
idf_component_register(SRCS "simpletest.c"
                       INCLUDE_DIRS "."
                       REQUIRES "nvs_flash" "bsp_mqtt" "bsp_wifi" "bsp_uart" "bsp_ble" "bsp_hw_timer" "wifi_provisioning")
