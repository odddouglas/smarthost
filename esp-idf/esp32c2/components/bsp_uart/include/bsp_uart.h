#ifndef _BSP_UART_H_
#define _BSP_UART_H_
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include "driver/uart.h"
#include "esp_mac.h"
#include "esp_event.h"
#include "esp_err.h"
#include "esp_log.h"
#include "bsp_mqtt.h"

extern uint8_t buffer[];
extern uint8_t bufferIndex;

void uart_init(void);
void uart_send_task(void *arg);
void uart_receive_task(void *arg);
void send_status_packet(uint16_t cmd_id);
bool verify_serial_frame(uint8_t *buf);
void parse_data_buffer(uint16_t data);
#endif // _BSP_WIFI_H_