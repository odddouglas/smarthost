#ifndef _BSP_MQTT_H_
#define _BSP_MQTT_H_

#include "main.h"
#include "mqtt_client.h"
#include "bsp_uart.h"
#include "cJSON.h"

#define FAN_VOLUME_LEN 10
#define LIGHT_COLOR_LEN 10

#define MQTT_REPORT_INTERVAL_MS 20
#define MQTT_ADDRESS "mqtt://e5e7404266.st1.iotda-device.cn-north-4.myhuaweicloud.com:1883"
#define MQTT_CLIENFID "67fe4c765367f573f7830638_esp32_0_0_2025051303"
#define MQTT_USERNAME "67fe4c765367f573f7830638_esp32"
#define MQTT_PASSWORD "beb57fa257b6fc3dc92d71a515d059d0788640a6f17b82c78860c18c5fde50ff"
#define DEVICE_ID "67fe4c765367f573f7830638_esp32"
#define SERVER_ID "gateway_data"
#define MQTT_TOPIC_REPORT "$oc/devices/" DEVICE_ID "/sys/properties/report"
#define MQTT_TOPIC_COMMAND "$oc/devices/" DEVICE_ID "/sys/commands/#"
#define MQTT_TOPIC_COMMAND_RESPOND "$oc/devices/" DEVICE_ID "/sys/commands/response/request_id="

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

extern ReportData2IoT ReportData;            // from bsp_uart.c
extern ReportData2IoT LastData;              // from bsp_uart.c
extern IssueData2MCU IssueData;              // from bsp_mqtt.c
extern SemaphoreHandle_t s_mqtt_connect_sem; // from main.c

void mqtt_start(void);
void mqtt_event_callback(void *event_handler_arg, esp_event_base_t event_base, int32_t event_id, void *event_data);
void mqtt_respond(const char *topic, const char *result);
void mqtt_cmd_handler(const char *topic, const char *payload, int length);
void mqtt_report_Fan(void);
void mqtt_report_BaseData(void);
void mqtt_report_Status(void);
void mqtt_report_Light(void);
#endif //_BSP_MQTT_H_