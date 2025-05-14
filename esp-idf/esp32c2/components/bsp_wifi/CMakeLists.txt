
idf_component_register(SRCS "bsp_wifi.c"
                       INCLUDE_DIRS "include"
                       REQUIRES "esp_wifi" "nvs_flash" "esp_event")
