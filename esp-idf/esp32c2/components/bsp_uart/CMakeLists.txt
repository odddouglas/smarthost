
idf_component_register(SRCS "bsp_uart.c"
                       INCLUDE_DIRS "include"
                       REQUIRES "driver" "esp_event" "bsp_mqtt")
