#include "bsp_uart.h"

#define UART_PORT_NUM UART_NUM_1
#define UART_BAUD_RATE 9600
#define UART_TX_PIN 1
#define UART_RX_PIN 3
#define BUF_SIZE 1024
#define FRAME_LEN 8
#define MAX_FRAME_ERRORS 5
// 创建接收和发送数据实例
ReportData2IoT ReportData;
IssueData2MCU IssueData;

static const char *TAG_UART = "UART";
static uint8_t buffer[FRAME_LEN];
static uint8_t bufferIndex = 0;
static int frameErrorCount = 0;

void uart_init(void)
{
    uart_config_t uart_config = {
        .baud_rate = UART_BAUD_RATE,
        .data_bits = UART_DATA_8_BITS,
        .parity = UART_PARITY_DISABLE,
        .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE};

    uart_param_config(UART_PORT_NUM, &uart_config);                                                // 配置 UART 参数
    uart_set_pin(UART_PORT_NUM, UART_TX_PIN, UART_RX_PIN, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE); // 设置 TX RX 引脚
    uart_driver_install(UART_PORT_NUM, BUF_SIZE * 2, 0, 0, NULL, 0);                               // 安装驱动（含 RX 缓冲区）
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
                    ESP_LOGE(TAG_UART, "连续帧错误过多，系统将重启");
                    esp_restart();
                }

                if (verify_serial_frame(buffer))
                {
                    uint16_t data = buffer[4] | (buffer[5] << 8);
                    parse_data_buffer(data);

                    // 上报数据（模拟）
                    // MQTT_Report_Status();
                    // MQTT_Report_Fan();
                    // MQTT_Report_Light();
                }

                bufferIndex = 0;
            }
        }
    }
}
void send_status_packet(uint16_t cmd_id)
{
    uint8_t packet[FRAME_LEN];
    packet[0] = 0xA5;
    packet[1] = 0xFA;
    packet[2] = 0x00; // 产品ID
    packet[3] = 0x03; // 消息类型
    packet[4] = cmd_id & 0xFF;
    packet[5] = (cmd_id >> 8) & 0xFF;
    packet[6] = packet[0] + packet[1] + packet[2] + packet[3] + packet[4] + packet[5];
    packet[7] = 0xFB;

    uart_write_bytes(UART_PORT_NUM, (const char *)packet, FRAME_LEN);
    ESP_LOGI(TAG_UART, "Sent status packet with cmd_id=0x%04X", cmd_id);
}

bool verify_serial_frame(uint8_t *buf)
{
    if (buf[0] != 0xA5 || buf[1] != 0xFA || buf[7] != 0xFB)
    {
        ESP_LOGW(TAG_UART, "Frame head/tail error");
        frameErrorCount++;
        return false;
    }

    uint8_t checksum = buf[6];
    uint8_t calcSum = buf[0] + buf[1] + buf[2] + buf[3] + buf[4] + buf[5];

    if (checksum != calcSum)
    {
        ESP_LOGW(TAG_UART, "Checksum failed: expected 0x%02X, got 0x%02X", calcSum, checksum);
        frameErrorCount++;
        return false;
    }

    frameErrorCount = 0;
    return true;
}

void parse_data_buffer(uint16_t data)
{
    uint8_t lightColor = data & 0x3F;
    ReportData.pcStatus = (data >> 6) & 0x01;
    ReportData.pcFanIn = (data >> 7) & 0x01;
    ReportData.pcFanOut = (data >> 8) & 0x01;
    uint8_t fanSpeedBits = (data >> 9) & 0x03;

    const char *colorMap[] = {
        "", "breathing", "red", "green", "blue", "white", "purple", "fleeting"
    };

    ReportData.pcLightBreathing = (lightColor == 1);
    ReportData.pcLightFleeting = (lightColor == 7);
    ReportData.pcLightColor = (lightColor >= 2 && lightColor <= 6) ? colorMap[lightColor] : "";

    if (fanSpeedBits == 1)
        ReportData.pcFanVolume = "low";
    else if (fanSpeedBits == 2)
        ReportData.pcFanVolume = "medium";
    else if (fanSpeedBits == 3)
        ReportData.pcFanVolume = "high";
    else
        ReportData.pcFanVolume = "";

    // Debug 输出
    ESP_LOGI(TAG_UART, "【解析数据】主机:%d 呼吸:%d 流光:%d 颜色:%s 风扇IN:%d OUT:%d 风速:%s",
             ReportData.pcStatus, ReportData.pcLightBreathing, ReportData.pcLightFleeting,
             ReportData.pcLightColor, ReportData.pcFanIn, ReportData.pcFanOut, ReportData.pcFanVolume);
}
