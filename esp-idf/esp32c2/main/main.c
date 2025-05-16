#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"

#include "bsp_ble.h"
#include "bsp_mqtt.h"
#include "bsp_wifi.h"
#include "bsp_uart.h"
static const char *TAG = "MAIN";
SemaphoreHandle_t s_wifi_connect_sem = NULL;
SemaphoreHandle_t s_mqtt_connect_sem = NULL;

void test_task(void *pvParameters)
{
    const TickType_t xDelay = pdMS_TO_TICKS(5000); // 每 5000ms 上报一次

    while (1)
    {
        // printf("0x%02X \r\n",buffer[7]);
        vTaskDelay(xDelay); // 延时
    }
}
void uart_send_task(void *arg)
{
    const char *msg = "Hello UART\r\n";
    while (1)
    {
        uart_write_bytes(UART_PORT_NUM, msg, strlen(msg));
        vTaskDelay(pdMS_TO_TICKS(2000));
    }
}
void uart_receive_task(void *arg)
{
    uint8_t byte;
    while (1)
    {
        int len = uart_read_bytes(UART_PORT_NUM, &byte, 1, pdMS_TO_TICKS(100));
        if (len > 0)
        {
            buffer[bufferIndex++] = byte;

            if (bufferIndex >= FRAME_LEN)
            {

                for (int i = 0; i < FRAME_LEN; i++)
                    printf("0x%02X ", buffer[i]);
                printf("\n");

                if (frameErrorCount >= MAX_FRAME_ERRORS)
                {
                    ESP_LOGE(TAG, "连续帧错误过多，系统将重启");
                    esp_restart();
                }

                if (verify_serial_frame(buffer))
                {
                    uint16_t data = buffer[4] | (buffer[5] << 8);
                    parse_data_buffer(data);

                    // 上报数据
                    // mqtt_report_Fan();
                    // vTaskDelay(pdMS_TO_TICKS(MQTT_REPORT_INTERVAL_MS));
                    // mqtt_report_BaseData();
                    // vTaskDelay(pdMS_TO_TICKS(MQTT_REPORT_INTERVAL_MS));
                    // mqtt_report_Status();
                    // vTaskDelay(pdMS_TO_TICKS(MQTT_REPORT_INTERVAL_MS));
                    // mqtt_report_Light();
                    // vTaskDelay(pdMS_TO_TICKS(MQTT_REPORT_INTERVAL_MS));
                    if (isFanDataChanged())
                    {
                        mqtt_report_Fan();
                        memcpy(LastData.pcFanVolume, ReportData.pcFanVolume, sizeof(LastData.pcFanVolume));
                        LastData.pcFanIn = ReportData.pcFanIn;
                        LastData.pcFanOut = ReportData.pcFanOut;
                        vTaskDelay(pdMS_TO_TICKS(MQTT_REPORT_INTERVAL_MS));
                    }

                    if (isBaseDataChanged())
                    {
                        mqtt_report_BaseData();
                        LastData.temperature = ReportData.temperature;
                        LastData.humidity = ReportData.humidity;
                        vTaskDelay(pdMS_TO_TICKS(MQTT_REPORT_INTERVAL_MS));
                    }

                    if (isStatusChanged())
                    {
                        mqtt_report_Status();
                        LastData.pcStatus = ReportData.pcStatus;
                        vTaskDelay(pdMS_TO_TICKS(MQTT_REPORT_INTERVAL_MS));
                    }

                    if (isLightChanged())
                    {
                        mqtt_report_Light();
                        LastData.pcLightBreathing = ReportData.pcLightBreathing;
                        LastData.pcLightFleeting = ReportData.pcLightFleeting;
                        strcpy(LastData.pcLightColor, ReportData.pcLightColor);
                        vTaskDelay(pdMS_TO_TICKS(MQTT_REPORT_INTERVAL_MS));
                    }
                }

                bufferIndex = 0;
            }
        }
    }
}
// 主程序入口
void app_main(void)
{
    ESP_ERROR_CHECK(nvs_flash_init());
    //s_wifi_connect_sem = xSemaphoreCreateBinary();
    //s_mqtt_connect_sem = xSemaphoreCreateBinary(); 

    //wifi_start();
    //xSemaphoreTake(s_wifi_connect_sem, portMAX_DELAY); // 等待 WiFi 连接成功

    //mqtt_start();
    //xSemaphoreTake(s_mqtt_connect_sem, portMAX_DELAY); // 等待 MQTT 成功连接

    ble_cfg_net_init();

    //uart_init();

    //xTaskCreate(uart_send_task, "uart_send_task", 2048, NULL, 10, NULL);
    //xTaskCreate(uart_receive_task, "uart_receive_task", 2048, NULL, 10, NULL);
    //xTaskCreate(test_task, "test_task", 4096, NULL, 8, NULL);

    return;
}
