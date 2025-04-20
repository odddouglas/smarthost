#include <ArduinoJson.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <HardwareSerial.h>
#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include <esp_system.h> // 添加ESP32系统头文件

#define RX_PIN 3
#define TX_PIN 1
#define MAX_FRAME_ERRORS 2 // 最大允许错误次数, 否则触发软件复位

HardwareSerial SerialPort(1); // 使用 UART1
// 上报设备属性
WiFiClient espClient;
PubSubClient client(espClient);

// WiFi 配置
const char *ssid = "odddouglas";
const char *password = "odddouglas";

// MQTT 配置（请使用 mqtt 端口 1883，而非 mqtts）
const char *mqttServer = "e5e7404266.st1.iotda-device.cn-north-4.myhuaweicloud.com";
const int mqttPort = 1883;

// 三元组信息
const char *ClientId = "67fe4c765367f573f7830638_esp32_0_0_2025041512";
const char *mqttUser = "67fe4c765367f573f7830638_esp32";
const char *mqttPassword = "b19992e854c367b6d48d64c9958882e54bca9b2b8eb52aaf82183ccad88c8ced";

#define DEVICE_ID "67fe4c765367f573f7830638_esp32"
#define SERVER_ID "gateway_data"
// 设备属性上报的 topic
#define MQTT_TOPIC_REPORT "$oc/devices/" DEVICE_ID "/sys/properties/report"
// 设备订阅命令的 topic
#define MQTT_TOPIC_COMMAND "$oc/devices/" DEVICE_ID "/sys/commands/#"
#define MQTT_TOPIC_COMMAND_RESPOND "$oc/devices/" DEVICE_ID "/sys/commands/response/request_id="

// 用于存储设备状态，并上报这些属性
typedef struct
{
    bool pcStatus;         // 主机状态
    bool pcFanIn;          // 进风风扇状态
    bool pcFanOut;         // 出风风扇状态
    String pcFanVolume;    // 风速档位 "low" / "medium" / "high"
    bool pcLightBreathing; // 呼吸灯状态
    bool pcLightFleeting;  // 闪烁灯状态
    String pcLightColor;   // 灯光颜色 "red" / "green" / "blue" / "white" / "purple"
    double temperature;    // 温度
    double humidity;       // 湿度
} ReportData2IoT;

// 用于存储来自云端的设备指令，下发命令
typedef struct
{
    bool pcStatus;         // 主机状态
    bool pcFanIn;          // 进风风扇状态
    bool pcFanOut;         // 出风风扇状态
    String pcFanVolume;    // 风速档位 "low" / "medium" / "high"
    bool pcLightBreathing; // 呼吸灯状态
    bool pcLightFleeting;  // 闪烁灯状态
    String pcLightColor;   // 灯光颜色 "red" / "green" / "blue" / "white" / "purple"
    double temperature;    // 温度
    double humidity;       // 湿度
} IssueData2MCU;

// 创建接收和发送数据实例
ReportData2IoT ReportData;
IssueData2MCU IssueData;

// MQTT的命令相关
String cmd = "";
bool doSend = false;
long last_stamp = 0;

//  看门狗错误计数器
uint8_t frameErrorCount = 0;

void WIFI_Init()
{
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println();
    Serial.println("WiFi connected");
    Serial.println(WiFi.localIP());
}

void MQTT_Init()
{
    client.setServer(mqttServer, mqttPort);
    client.setKeepAlive(60);
    client.setCallback(MQTT_CmdCallback); // 设置命令回调函数

    Serial.println("[MQTT] Connecting to Huawei Cloud...");

    while (!client.connected())
    {
        boolean result = client.connect(ClientId, mqttUser, mqttPassword);

        Serial.println(result ? "[MQTT] Connected to Broker!" : "[MQTT] Connection Failed!");
        if (result)
        {
            // 订阅命令下发 Topic
            boolean subResult = client.subscribe(MQTT_TOPIC_COMMAND);
            Serial.println("[MQTT] Subscribe to Command Topic:");
            Serial.println(subResult ? "Subscribe Success!" : "Subscribe Failed!");
        }
        else
        {
            Serial.print("[MQTT] Failed State Code: ");
            Serial.println(client.state());
            delay(3000); // 等待后重连
        }
    }
}
// 定义上传 FullStatus 数据的函数
void MQTT_Report_Fan()
{
    // 创建一个 JSON 文档对象
    StaticJsonDocument<2560> doc; // 更大的文档空间
    doc["services"][0]["service_id"] = SERVER_ID;

    // 上传 fullstatus 数据
    JsonObject fullstatus = doc["services"][0]["properties"].createNestedObject("pcFan");
    fullstatus["pcFanVolume"] = ReportData.pcFanVolume;
    fullstatus["pcFanIn"] = ReportData.pcFanIn;
    fullstatus["pcFanOut"] = ReportData.pcFanOut;

    // 将 JSON 数据序列化为字符串
    String jsonString;
    serializeJson(doc, jsonString); // 序列化 JSON 为字符串

    // 发布到华为云平台
    boolean reportResult = client.publish(MQTT_TOPIC_REPORT, jsonString.c_str());
    Serial.println("[MQTT] Publish FullStatus:");
    Serial.println(jsonString);
    Serial.println(reportResult ? "Publish Success!" : "Publish Failed!");
}

// 定义上传 BaseData 数据的函数
void MQTT_Report_BaseData()
{
    // 创建一个 JSON 文档对象
    StaticJsonDocument<256> doc;

    // 填充 JSON 数据
    doc["services"][0]["service_id"] = SERVER_ID;

    // 上传 basedata 数据
    JsonObject basedata = doc["services"][0]["properties"].createNestedObject("pcBaseData");
    basedata["temperature"] = ReportData.temperature;
    basedata["humidity"] = ReportData.humidity;

    // 将 JSON 数据序列化为字符串
    String jsonString;
    serializeJson(doc, jsonString); // 序列化 JSON 为字符串

    // 发布到华为云平台
    boolean reportResult = client.publish(MQTT_TOPIC_REPORT, jsonString.c_str());
    Serial.println("[MQTT] Publish BaseData:");
    Serial.println(jsonString);
    Serial.println(reportResult ? "Publish Success!" : "Publish Failed!");
}

// 定义上传 BaseData 数据的函数
void MQTT_Report_Light()
{
    // 创建一个 JSON 文档对象
    StaticJsonDocument<256> doc;

    // 填充 JSON 数据
    doc["services"][0]["service_id"] = SERVER_ID;

    // 上传 basedata 数据
    JsonObject basedata = doc["services"][0]["properties"].createNestedObject("pcLight");
    basedata["pcLightBreathing"] = ReportData.pcLightBreathing;
    basedata["pcLightFleeting"] = ReportData.pcLightFleeting;
    basedata["pcLightColor"] = ReportData.pcLightColor;

    // 将 JSON 数据序列化为字符串
    String jsonString;
    serializeJson(doc, jsonString); // 序列化 JSON 为字符串

    // 发布到华为云平台
    boolean reportResult = client.publish(MQTT_TOPIC_REPORT, jsonString.c_str());
    Serial.println("[MQTT] Publish BaseData:");
    Serial.println(jsonString);
    Serial.println(reportResult ? "Publish Success!" : "Publish Failed!");
}

void MQTT_Report_Status()
{
    // 创建一个 JSON 文档对象
    StaticJsonDocument<256> doc;

    // 填充 JSON 数据
    doc["services"][0]["service_id"] = SERVER_ID;
    doc["services"][0]["properties"]["pcStatus"] = ReportData.pcStatus;

    // 将 JSON 数据序列化为字符串
    String jsonString;
    serializeJson(doc, jsonString); // 序列化 JSON 为字符串

    // 发布到华为云平台
    boolean reportResult = client.publish(MQTT_TOPIC_REPORT, jsonString.c_str());
    Serial.println("[MQTT] Publish:");
    Serial.println(jsonString);
    Serial.println(reportResult ? "Publish Success!" : "Publish Failed!");
}
// 发送命令响应到平台
void MQTT_Respond(String topic, String result)
{
    // 构造响应 JSON 数据
    char jsonBuf[128];
    snprintf(jsonBuf, sizeof(jsonBuf),
             "{\"result_code\":0,\"response_name\":\"COMMAND_RESPONSE\",\"paras\":{\"result\":\"%s\"}}",
             result.c_str());

    // 从 topic 中提取 request_id
    int idIndex = topic.lastIndexOf("request_id=");
    String requestId = (idIndex >= 0) ? topic.substring(idIndex + 11) : "";

    // 构造响应的 topic
    String responseTopic = MQTT_TOPIC_COMMAND_RESPOND + requestId;
    // 发布命令响应
    boolean respondResult = client.publish(responseTopic.c_str(), jsonBuf);
    Serial.println("[MQTT] Publish (Command Response):");
    Serial.println(jsonBuf);
    Serial.println(respondResult ? "Publish Success!" : "Publish Failed!");
}

// 命令回调函数：处理平台下发的命令
void MQTT_CmdCallback(char *topic, byte *payload, unsigned int length)
{
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, payload, length);
    if (error)
    {
        Serial.println("Failed to parse JSON");
        return;
    }

    String payloadStr = "";
    for (unsigned int i = 0; i < length; i++)
    {
        payloadStr += (char)payload[i];
    }
    Serial.println("Received command: " + payloadStr);

    String commandName = doc["command_name"];

    if (commandName == "pcLightCtrl")
    {
        IssueData.pcLightBreathing = doc["paras"]["pcLightBreathing"].as<bool>();
        IssueData.pcLightFleeting = doc["paras"]["pcLightFleeting"].as<bool>();
        IssueData.pcLightColor = doc["paras"]["pcLightColor"].as<String>();

        Serial.println("【灯光控制命令】");
        Serial.println("呼吸灯：" + String(IssueData.pcLightBreathing ? "开启" : "关闭"));
        Serial.println("流光灯：" + String(IssueData.pcLightFleeting ? "开启" : "关闭"));
        Serial.println("灯光颜色：" + IssueData.pcLightColor);
    }
    else if (commandName == "pcFanCtrl")
    {
        IssueData.pcFanIn = doc["paras"]["pcFanIn"].as<bool>();
        IssueData.pcFanOut = doc["paras"]["pcFanOut"].as<bool>();
        IssueData.pcFanVolume = doc["paras"]["pcFanVolume"].as<String>();

        Serial.println("【风扇控制命令】");
        Serial.println("进风风扇：" + String(IssueData.pcFanIn ? "开启" : "关闭"));
        Serial.println("出风风扇：" + String(IssueData.pcFanOut ? "开启" : "关闭"));
        Serial.println("风速档位：" + IssueData.pcFanVolume);
    }
    else if (commandName == "pcStatusCtrl")
    {
        IssueData.pcStatus = doc["paras"]["pcStatus"].as<bool>();

        Serial.println("【主机电源控制命令】");
        Serial.println("主机状态：" + String(IssueData.pcStatus ? "开启" : "关闭"));
    }
    else
    {
        // 命令名称不匹配，发送失败响应
        MQTT_Respond(String(topic), "failure");
        return;
    }

    // 命令成功后发送响应
    MQTT_Respond(String(topic), "success");
}

bool verifySerialFrame(uint8_t *buf)
{
    if (buf[0] != 0xA5 || buf[1] != 0xFA || buf[7] != 0xFB)
    {
        printf("帧头或帧尾错误\n");
        frameErrorCount++;
        return false;
    }

    uint8_t id = buf[2];
    uint8_t type = buf[3];
    uint16_t data = buf[4] | (buf[5] << 8); // 低字节在前
    uint8_t checksum = buf[6];

    // 计算校验和（不包含 checksum 和 end）
    uint8_t calcSum = buf[0] + buf[1] + id + type + buf[4] + buf[5];
    if (calcSum != checksum)
    {
        printf("校验失败，应为: 0x%02X,收到: 0x%02X\n", calcSum, checksum);
        frameErrorCount++;
        return false;
    }
    printf("解析成功: ID=0x%02X, TYPE=0x%02X, DATA=0x%04X\n", id, type, data);

    if (frameErrorCount >= MAX_FRAME_ERRORS)
    {
        Serial.println("连续帧错误超过阈值，即将重启系统...");
        delay(100);
        esp_restart(); // 触发软件复位
    }

    frameErrorCount = 0; // 成功时重置计数器
    return true;
}
void parseDataPacket(uint16_t data)
{
    // 解析各字段
    uint8_t lightColor = data & 0x3F;          // 灯光颜色（前6位）
    ReportData.pcStatus = (data >> 6) & 0x01;  // 主机状态（第7位）
    ReportData.pcFanIn = (data >> 7) & 0x01;   // 进风风扇（第8位）
    ReportData.pcFanOut = (data >> 8) & 0x01;  // 出风风扇（第9位）
    uint8_t fanSpeedBits = (data >> 9) & 0x03; // 风速（第10-11位）

    // 灯光颜色映射表（000~111）
    const char *colorMap[] = {
        "",          // 000 - 关灯（无颜色）
        "breathing", // 001 - 呼吸灯
        "red",       // 010
        "green",     // 011
        "blue",      // 100
        "white",     // 101
        "purple",    // 110
        "fleeting"   // 111 - 流光灯
    };
    if (lightColor <= 7)
    {
        // 设置灯光特效状态
        ReportData.pcLightBreathing = (lightColor == 1); // 呼吸灯
        ReportData.pcLightFleeting = (lightColor == 7);  // 流光灯

        // 设置颜色（只对静态颜色生效）
        if (lightColor >= 2 && lightColor <= 6)
            ReportData.pcLightColor = colorMap[lightColor];
        else
            ReportData.pcLightColor = ""; // 对于 breathing/fleeting/关灯，不设置颜色
    }

    // 风速映射（与定义一致）
    if (fanSpeedBits == 1)
        ReportData.pcFanVolume = "low";
    else if (fanSpeedBits == 2)
        ReportData.pcFanVolume = "medium";
    else if (fanSpeedBits == 3)
        ReportData.pcFanVolume = "high";
    else
        ReportData.pcFanVolume = ""; // 0 表示关闭或无风速

    // 串口调试信息（可选）
    Serial.println("【主机状态数据解析】");
    Serial.print("常亮灯：");
    Serial.println(ReportData.pcLightColor);
    Serial.print("呼吸灯：");
    Serial.println(ReportData.pcLightBreathing ? "开启" : "关闭");
    Serial.print("流光灯：");
    Serial.println(ReportData.pcLightFleeting ? "开启" : "关闭");
    Serial.print("主机状态：");
    Serial.println(ReportData.pcStatus ? "开启" : "关闭");
    Serial.print("进风风扇：");
    Serial.println(ReportData.pcFanIn ? "开启" : "关闭");
    Serial.print("出风风扇：");
    Serial.println(ReportData.pcFanOut ? "开启" : "关闭");
    Serial.print("风速档位：");
    Serial.println(ReportData.pcFanVolume);
    Serial.println();
}

void setup()
{
    Serial.begin(9600);                                 // 用于打印调试信息
    SerialPort.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN); // 初始化 UART1，RX=GPIO3，TX=GPIO1
    delay(100);                                         // 等待串口初始化
    WIFI_Init();                                        // 等待wifi连接
    MQTT_Init();                                        // 初始化MQTT尝试连接
}

void loop()
{
    // 尝试扫描并连接云，如果没有连接将会一直client.loop
    if (!client.connected())
    {
        MQTT_Init();
    }
    else
    {
        client.loop();
    }

    // 定时上报区
    long now_stamp = millis();
    if (now_stamp - last_stamp > 10000)
    { // 每 10 秒上报一次
        last_stamp = now_stamp;
        MQTT_Report_BaseData();
    }

    // 串口接受区
    static uint8_t buffer[8];
    static uint8_t bufferIndex = 0;
    while (SerialPort.available())
    {
        uint8_t incomingByte = SerialPort.read();
        // Serial.print(incomingByte, HEX);
        // Serial.print("\n"); // 用空格分隔字节
        buffer[bufferIndex++] = incomingByte;
        // Serial.print(bufferIndex);
        // Serial.print("\n"); // 用空格分隔字节

        // 检测完整数据包
        if (bufferIndex >= 8)
        {
            // parseDataPacket(buffer);
            Serial.println("=== Full Packet Received ===");

            // 打印整个buffer内容
            for (int i = 0; i < 8; i++)
            {
                Serial.print("0x");
                Serial.print(buffer[i], HEX);
                Serial.print(" ");
            }
            Serial.println();

            // 解析数据包
            if (verifySerialFrame(buffer)) // 检验
            {
                parseDataPacket(buffer[4] | (buffer[5] << 8)); // 处理命令词ID
                MQTT_Report_Status();
                delay(50);
                MQTT_Report_Fan();
                delay(50);
                MQTT_Report_Light();
                delay(50);
            }

            bufferIndex = 0; // 重置缓冲区
        }
    }
}
