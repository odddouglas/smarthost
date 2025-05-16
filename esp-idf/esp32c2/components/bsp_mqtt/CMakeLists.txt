
idf_component_register(SRCS "bsp_mqtt.c"
                       INCLUDE_DIRS "include"
                       PRIV_INCLUDE_DIRS "../../main"
                       REQUIRES "mqtt" "bsp_uart" "json")
