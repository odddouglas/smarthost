#include "bsp_uart.h"

// 0xA5 0xFA 0x00 0x81 0xC5 0x07 0xEC 0xFB

// 创建接收和发送数据实例
ReportData2IoT ReportData;
IssueData2MCU IssueData;

static const char *TAG = "UART";
uint8_t buffer[FRAME_LEN];
uint8_t bufferIndex = 0;
uint8_t frameErrorCount = 0;

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
    ESP_LOGI(TAG, "Sent status packet with cmd_id=0x%04X", cmd_id);
}

bool verify_serial_frame(uint8_t *buf)
{
    if (buf[0] != 0xA5 || buf[1] != 0xFA || buf[7] != 0xFB)
    {
        ESP_LOGW(TAG, "Frame head/tail error");
        frameErrorCount++;
        return false;
    }

    uint8_t checksum = buf[6];
    uint8_t calcSum = buf[0] + buf[1] + buf[2] + buf[3] + buf[4] + buf[5];

    if (checksum != calcSum)
    {
        ESP_LOGW(TAG, "Checksum failed: expected 0x%02X, got 0x%02X", calcSum, checksum);
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
        "", "breathing", "red", "green", "blue", "white", "purple", "fleeting"};

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
    ESP_LOGI(TAG, "【解析数据】主机:%d 呼吸:%d 流光:%d 颜色:%s 风扇IN:%d OUT:%d 风速:%s",
             ReportData.pcStatus, ReportData.pcLightBreathing, ReportData.pcLightFleeting,
             ReportData.pcLightColor, ReportData.pcFanIn, ReportData.pcFanOut, ReportData.pcFanVolume);
}
