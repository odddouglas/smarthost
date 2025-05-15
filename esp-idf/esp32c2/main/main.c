#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"

#include "bsp_mqtt.h"
#include "bsp_wifi.h"
#include "bsp_uart.h"

SemaphoreHandle_t s_wifi_connect_sem = NULL;

void test_task(void *pvParameters)
{
    const TickType_t xDelay = pdMS_TO_TICKS(5000); // 每 5000ms 上报一次

    while (1)
    {
        printf("0x%02X \r\n",buffer[7]);
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

    xTaskCreate(test_task, "test_task", 4096, NULL, 8, NULL);

    return;
}
