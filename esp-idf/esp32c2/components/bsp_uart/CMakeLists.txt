
idf_component_register(SRCS "bsp_uart.c"
                       INCLUDE_DIRS "include"
                       PRIV_INCLUDE_DIRS "../../main"
                       REQUIRES "driver" "bsp_mqtt")
