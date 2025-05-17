#include "bsp_hw_timer.h"
static const char *TAG = "HW_TIMER";

volatile bool report_flag = false;
static gptimer_handle_t gptimer = NULL;
static bool IRAM_ATTR timer_callback(gptimer_handle_t timer, const gptimer_alarm_event_data_t *edata, void *user_ctx)
{
    report_flag = true;
    ESP_EARLY_LOGI(TAG, "Sent full status packet %d(s)", TIMER_INTERVAL_SEC);
    return true; // return true to yield from ISR
}

void hw_timer_init()
{
    gptimer_config_t config = {
        .clk_src = GPTIMER_CLK_SRC_DEFAULT,
        .direction = GPTIMER_COUNT_UP,
        .resolution_hz = 1000000, // 1MHz -> 1 tick = 1us
    };
    ESP_ERROR_CHECK(gptimer_new_timer(&config, &gptimer));

    gptimer_event_callbacks_t callbacks = {
        .on_alarm = timer_callback,
    };
    ESP_ERROR_CHECK(gptimer_register_event_callbacks(gptimer, &callbacks, NULL));

    ESP_ERROR_CHECK(gptimer_set_alarm_action(gptimer, &(gptimer_alarm_config_t){
                                                          .alarm_count = TIMER_INTERVAL_SEC * 1000000,
                                                          .reload_count = 0,
                                                          .flags.auto_reload_on_alarm = true,
                                                      }));

    ESP_ERROR_CHECK(gptimer_enable(gptimer));
    ESP_ERROR_CHECK(gptimer_start(gptimer));
}