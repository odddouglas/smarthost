
idf_component_register(SRCS "main.c"
                       INCLUDE_DIRS "."
                       REQUIRES "bsp_mqtt" "esp_wifi" "nvs_flash" "esp_event" "driver" "json")
