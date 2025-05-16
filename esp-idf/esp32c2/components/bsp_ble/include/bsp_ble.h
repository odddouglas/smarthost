#ifndef _BSP_BLE_H_
#define _BSP_BLE_H_

#include "main.h"
#include "esp_bt.h"
#include "esp_gap_ble_api.h"
#include "esp_gatts_api.h"
#include "esp_bt_defs.h"
#include "esp_bt_main.h"
#include "esp_gatt_common_api.h"

#define BLE_DEVICE_NAME "ESP32-C2"
#define ESP_APP_ID 0x55
#define SVC_IND_ID1 0
#define SVC_IND_ID2 1

void ble_cfg_net_init(void);
void ble_set_ch1_value(uint8_t *data, size_t length);
void ble_set_ch2_value(uint8_t *data, size_t length);

#endif
