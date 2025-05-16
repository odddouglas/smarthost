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
#include "freertos/semphr.h"
#include "bsp_uart.h"
#define FAN_VOLUME_LEN 10
#define LIGHT_COLOR_LEN 10
#define MQTT_REPORT_INTERVAL_MS 20
typedef struct
{
    int pcStatus;                       // 主机状态
    bool pcFanIn;                       // 进风风扇状态
    bool pcFanOut;                      // 出风风扇状态
    char pcFanVolume[FAN_VOLUME_LEN];   // 风速档位 "low" / "medium" / "high"
    bool pcLightBreathing;              // 呼吸灯状态
    bool pcLightFleeting;               // 闪烁灯状态
    char pcLightColor[LIGHT_COLOR_LEN]; // 灯光颜色 "red" / "green" / "blue" / "white" / "purple"
    double temperature;                 // 温度
    double humidity;                    // 湿度
} ReportData2IoT;

typedef struct
{
    int pcStatus;                       // 主机状态
    bool pcFanIn;                       // 进风风扇状态
    bool pcFanOut;                      // 出风风扇状态
    char pcFanVolume[FAN_VOLUME_LEN];   // 风速档位 "low" / "medium" / "high"
    bool pcLightBreathing;              // 呼吸灯状态
    bool pcLightFleeting;               // 闪烁灯状态
    char pcLightColor[LIGHT_COLOR_LEN]; // 灯光颜色 "red" / "green" / "blue" / "white" / "purple"
    double temperature;                 // 温度
    double humidity;                    // 湿度
} IssueData2MCU;

extern ReportData2IoT ReportData; // from bsp_uart.c
extern ReportData2IoT LastData;   // from bsp_uart.c
extern IssueData2MCU IssueData;   // from bsp_mqtt.c
extern SemaphoreHandle_t s_mqtt_connect_sem; //from main.c

void mqtt_start(void);
void mqtt_event_callback(void *event_handler_arg, esp_event_base_t event_base, int32_t event_id, void *event_data);
void mqtt_respond(const char *topic, const char *result);
void mqtt_cmd_handler(const char *topic, const char *payload, int length);
void mqtt_report_Fan(void);
void mqtt_report_BaseData(void);
void mqtt_report_Status(void);
void mqtt_report_Light(void);
#endif //_BSP_MQTT_H_