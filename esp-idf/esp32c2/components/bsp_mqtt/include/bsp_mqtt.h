#ifndef _BSP_MQTT_H_
#define _BSP_MQTT_H_
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include "mqtt_client.h"
#include "esp_mac.h"
#include "esp_event.h"
#include "esp_err.h"
#include "esp_log.h"
#include "cJSON.h"

typedef struct
{
    int pcStatus;          // 主机状态
    bool pcFanIn;          // 进风风扇状态
    bool pcFanOut;         // 出风风扇状态
    char *pcFanVolume;     // 风速档位 "low" / "medium" / "high"
    bool pcLightBreathing; // 呼吸灯状态
    bool pcLightFleeting;  // 闪烁灯状态
    char *pcLightColor;    // 灯光颜色 "red" / "green" / "blue" / "white" / "purple"
    double temperature;    // 温度
    double humidity;       // 湿度
} ReportData2IoT;

typedef struct
{
    bool pcStatus;
    bool pcFanIn;
    bool pcFanOut;
    char *pcFanVolume;
    bool pcLightBreathing;
    bool pcLightFleeting;
    char *pcLightColor;
    double temperature;
    double humidity;
} IssueData2MCU;

void mqtt_start(void);
void mqtt_event_callback(void *event_handler_arg, esp_event_base_t event_base, int32_t event_id, void *event_data);
void mqtt_report_FAN(void);
#endif //_BSP_MQTT_H_