#ifndef _BSP_BLE_H_
#define _BSP_BLE_H_

#include "main.h"

#include "esp_bt.h"
#include "esp_gap_ble_api.h"
#include "esp_gatts_api.h"
#include "esp_bt_defs.h"
#include "esp_bt_main.h"
#include "esp_gatt_common_api.h"

/**
 * 初始化并启动蓝牙BLE
 * @param 无
 * @return 是否成功
 */
esp_err_t ble_cfg_net_init(void);

/**
 * 设置特征1的值
 * @param value 值
 * @return 无
 */
void ble_set_ch1_value(uint16_t value);

/**
 * 设置特征2的值
 * @param value 值
 * @return 无
 */
void ble_set_ch2_value(uint16_t value);

#endif
