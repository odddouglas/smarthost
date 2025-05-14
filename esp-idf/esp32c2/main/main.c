#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"

#include "cJSON.h"
#include "bsp_mqtt.h"
#include "bsp_wifi.h"
#include "bsp_uart.h"

SemaphoreHandle_t s_wifi_connect_sem = NULL;

typedef struct
{
    int pcStatus;          // 主机状态 （按上位机需求，设置成0和1）
    bool pcFanIn;          // 进风风扇状态
    bool pcFanOut;         // 出风风扇状态
    char *pcFanVolume;     // 风速档位 "low" / "medium" / "high"
    bool pcLightBreathing; // 呼吸灯状态
    bool pcLightFleeting;  // 闪烁灯状态
    char *pcLightColor;    // 灯光颜色 "red" / "green" / "blue" / "white" / "purple"
    double temperature;    // 温度
    double humidity;       // 湿度
} ReportData2IoT;
// 用于存储来自云端的设备指令，下发命令
typedef struct
{
    bool pcStatus;         // 主机状态
    bool pcFanIn;          // 进风风扇状态
    bool pcFanOut;         // 出风风扇状态
    char *pcFanVolume;     // 风速档位 "low" / "medium" / "high"
    bool pcLightBreathing; // 呼吸灯状态
    bool pcLightFleeting;  // 闪烁灯状态
    char *pcLightColor;    // 灯光颜色 "red" / "green" / "blue" / "white" / "purple"
    double temperature;    // 温度
    double humidity;       // 湿度
} IssueData2MCU;

// 创建接收和发送数据实例
ReportData2IoT ReportData;
IssueData2MCU IssueData;


// 主程序入口
void app_main(void)
{
    s_wifi_connect_sem = xSemaphoreCreateBinary(); // 创建信号量
    wifi_start();
    xSemaphoreTake(s_wifi_connect_sem, portMAX_DELAY); // 阻塞等待信号量释放
    mqtt_start();

    uart_init(); // 初始化串口，创建串口任务
    xTaskCreate(uart_send_task, "uart_send_task", 2048, NULL, 10, NULL);
    xTaskCreate(uart_receive_task, "uart_receive_task", 2048, NULL, 10, NULL);
    return;
}
