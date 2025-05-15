
idf_component_register(SRCS "bsp_mqtt.c"
                       INCLUDE_DIRS "include"
                       REQUIRES "mqtt" "bsp_uart" "esp_event" "json")
