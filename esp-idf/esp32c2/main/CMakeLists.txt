
idf_component_register(SRCS "main.c"
                       INCLUDE_DIRS "."
                       REQUIRES "bsp_mqtt" "bsp_wifi" "bsp_uart" "nvs_flash" "esp_event" "driver" "json")
