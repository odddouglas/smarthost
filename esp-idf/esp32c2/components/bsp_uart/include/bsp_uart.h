#ifndef _BSP_UART_H_
#define _BSP_UART_H_

#include "main.h"
#include "driver/uart.h"
#include "bsp_mqtt.h"

#define UART_PORT_NUM UART_NUM_1
#define UART_BAUD_RATE 9600
#define UART_TX_PIN 1
#define UART_RX_PIN 3
#define BUF_SIZE 1024
#define FRAME_LEN 8
#define MAX_FRAME_ERRORS 5

extern uint8_t buffer[]; // from bsp_uart.c
extern uint8_t bufferIndex;
extern uint8_t frameErrorCount;

void uart_init(void);
void send_status_packet(uint16_t cmd_id);
bool verify_serial_frame(uint8_t *buf);
void parse_data_buffer(uint16_t data);
bool isFanDataChanged(void);
bool isBaseDataChanged(void);
bool isStatusChanged(void);
bool isLightChanged(void);

#endif // _BSP_WIFI_H_