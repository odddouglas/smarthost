#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"

#include "bsp_mqtt.h"
#include "bsp_wifi.h"
#include "bsp_uart.h"

SemaphoreHandle_t s_wifi_connect_sem = NULL;

// 创建接收和发送数据实例
ReportData2IoT ReportData;
IssueData2MCU IssueData;

void mqtt_report_task(void *pvParameters)
{
    const TickType_t xDelay = pdMS_TO_TICKS(5000); // 每 5000ms 上报一次

    while (1)
    {
        // 修改 ReportData 的值，模拟设备状态变化
        ReportData.pcFanVolume = (rand() % 2) ? "High" : "Low"; // 随机设置风扇音量（高或低）
        ReportData.pcFanIn = (rand() % 2);                      // 随机设置进风风扇开关
        ReportData.pcFanOut = (rand() % 2);                     // 随机设置出风风扇开关

        // 调用你的上报函数
        mqtt_report_FAN();

        // 打印修改后的状态（调试）
        printf("Updated ReportData: Volume=%s, FanIn=%d, FanOut=%d\r\n",
               ReportData.pcFanVolume, ReportData.pcFanIn, ReportData.pcFanOut);

        vTaskDelay(xDelay); // 延时
    }
}

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

    xTaskCreate(mqtt_report_task, "mqtt_report_task", 4096, NULL, 8, NULL);

    return;
}
