#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"

void taskA(void *param)
{
    while (1)
    {
        ESP_LOGI("main", "Hello world!");
        vTaskDelay(pdMS_TO_TICKS(500));
    }
}
void app_main(void)
{
    xTaskCreatePinnedToCore(taskA, "helloworld", 4096, NULL, 3, NULL, 0); 
}
