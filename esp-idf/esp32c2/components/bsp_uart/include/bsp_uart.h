#ifndef _BSP_UART_H_
#define _BSP_UART_H_
#include <stdio.h>
#include <string.h>
#include "driver/uart.h"
#include "esp_mac.h"
#include "esp_event.h"
#include "esp_err.h"
#include "esp_log.h"

void uart_init(void);
void uart_send_task(void *arg);
void uart_receive_task(void *arg);

#endif // _BSP_WIFI_H_