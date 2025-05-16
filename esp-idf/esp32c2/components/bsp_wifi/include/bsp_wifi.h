#ifndef _BSP_WIFI_H_
#define _BSP_WIFI_H_

#include "main.h"
#include "esp_wifi.h"

#define WIFI_SSID "odddouglas"     // Wi-Fi SSID
#define WIFI_PASSWORD "odddouglas" // Wi-Fi 密码

extern SemaphoreHandle_t s_wifi_connect_sem; // form main.c

void wifi_start(void);
void wifi_event_callback(void *event_handler_arg, esp_event_base_t event_base, int32_t event_id, void *event_data);

#endif // _BSP_WIFI_H_