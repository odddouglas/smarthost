
idf_component_register(SRCS "bsp_wifi.c"
                       INCLUDE_DIRS "include"
                       PRIV_INCLUDE_DIRS "../../main"
                       REQUIRES "esp_wifi" "wifi_provisioning")
