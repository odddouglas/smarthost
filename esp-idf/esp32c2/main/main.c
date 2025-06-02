#include "main.h"
#include "nvs_flash.h"
#include "bsp_ble.h"
#include "bsp_mqtt.h"
#include "bsp_wifi.h"
#include "bsp_uart.h"
#include "bsp_hw_timer.h"

static const char *TAG = "MAIN";
SemaphoreHandle_t s_wifi_connect_sem = NULL;
SemaphoreHandle_t s_mqtt_connect_sem = NULL;

void log_memory_usage(const char *task_name)
{
    ESP_LOGW(TAG, "[%s] Free heap size: %u bytes, Minimum free heap size: %u bytes",
             task_name, (unsigned int)esp_get_free_heap_size(), (unsigned int)esp_get_minimum_free_heap_size());
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
                // 打印内存使用情况
                log_memory_usage("app_main");

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

                    ble_set_ch2_value(buffer, FRAME_LEN); // 特征值2用于发送给小程序端，格式为 a5 fa 00 81 c5 07 ec fb

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

// 每隔120s上报一次(可设置)
void hw_timer_report_task(void *param)
{
    while (1)
    {
        if (report_flag)
        {

            log_memory_usage("MAIN_FLASH"); // 打印内存使用情况
            report_flag = false;

            mqtt_report_BaseData(); // 上报温湿度等基础数据
            // vTaskDelay(pdMS_TO_TICKS(1000));

            // mqtt_report_Fan();
            // vTaskDelay(pdMS_TO_TICKS(1000));

            // mqtt_report_Status();
            // vTaskDelay(pdMS_TO_TICKS(1000));

            // mqtt_report_Light();
            // vTaskDelay(pdMS_TO_TICKS(1000));
        }
        vTaskDelay(pdMS_TO_TICKS(100)); // 避免 CPU 占满
    }
}
// 主程序入口
void app_main(void)
{
    // ESP_LOGI(TAG, "Free heap size: %d", esp_get_free_heap_size());
    ESP_ERROR_CHECK(nvs_flash_init());                // wifi/ble所需要的nvs初始化
    ESP_ERROR_CHECK(esp_netif_init());                // 初始化网络接口
    ESP_ERROR_CHECK(esp_event_loop_create_default()); // 创建默认事件循环

    s_wifi_connect_sem = xSemaphoreCreateBinary();
    s_mqtt_connect_sem = xSemaphoreCreateBinary();

    wifi_start_provision();
    xSemaphoreTake(s_wifi_connect_sem, portMAX_DELAY); // 等待 WiFi 连接成功

    mqtt_start();
    xSemaphoreTake(s_mqtt_connect_sem, portMAX_DELAY); // 等待 MQTT 成功连接

    ble_start();
    uart_init();
    // hw_timer_init();

    BaseType_t ret1 = xTaskCreate(uart_receive_task, "uart_receive_task", 2048, NULL, 10, NULL);
    ESP_LOGI(TAG, "Create uart_receive_task: %s", ret1 == pdPASS ? "SUCCESS" : "FAILED");

    BaseType_t ret2 = xTaskCreate(hw_timer_report_task, "hw_timer_report_task", 1024, NULL, 10, NULL);
    ESP_LOGI(TAG, "Create hw_timer_report_task: %s", ret2 == pdPASS ? "SUCCESS" : "FAILED");

    return;
}
