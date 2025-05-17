#include "bsp_hw_timer.h"
static const char *TAG = "HW_TIMER";

volatile bool report_flag = false;

void IRAM_ATTR timer_isr_callback(void *arg)
{
    report_flag = true;
    ESP_LOGI(TAG, "Sent full status packet %d(s)", TIMER_INTERVAL_SEC);
    timer_group_clr_intr_status_in_isr(TIMER_GROUP, TIMER_IDX);
    timer_group_enable_alarm_in_isr(TIMER_GROUP, TIMER_IDX);
}

void hw_timer_init()
{
    timer_config_t config = {
        .divider = 80, // 80 MHz / 80 = 1MHz => 1 tick = 1us
        .counter_dir = TIMER_COUNT_UP,
        .counter_en = TIMER_PAUSE,
        .alarm_en = TIMER_ALARM_EN,
        .auto_reload = true,
    };
    timer_init(TIMER_GROUP, TIMER_IDX, &config);
    timer_set_counter_value(TIMER_GROUP, TIMER_IDX, 0x00000000ULL);
    timer_set_alarm_value(TIMER_GROUP, TIMER_IDX, TIMER_INTERVAL_SEC * 1000000);
    timer_enable_intr(TIMER_GROUP, TIMER_IDX);
    timer_isr_register(TIMER_GROUP, TIMER_IDX, timer_isr_callback,
                       NULL, ESP_INTR_FLAG_IRAM, NULL);
    timer_start(TIMER_GROUP, TIMER_IDX);
}
