#ifndef _BSP_HW_TIMER_
#define _BSP_HW_TIMER_

#include "main.h"
#include "driver/gptimer.h"

#define TIMER_GROUP TIMER_GROUP_0
#define TIMER_IDX TIMER_0
#define TIMER_INTERVAL_SEC 10 // 120 秒周期

extern volatile bool report_flag;

void hw_timer_init(void);

#endif