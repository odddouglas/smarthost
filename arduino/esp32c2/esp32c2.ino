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
#define MAX_FRAME_ERRORS 5 // 最大允许错误次数, 否则触发软件复位

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

// 布尔类型变量，用于存储设备状态，并上报这些属性
// bool pcFanStatus = false;

bool pcStatus = false;

// pcFan
bool pcFanIn = false;          // 进风风扇状态（true: 开，false: 关）
bool pcFanOut = false;         // 出风风扇状态（true: 开，false: 关）
String pcFanVolume = "medium"; // 风速档位，取值："low" / "medium" / "high"

// pcBaseData
double temperature = 0.0; // 当前温度
double humidity = 0.0;    // 当前湿度

// pcLight
bool pcLightBreathing = false; // 呼吸灯效果是否开启
bool pcLightFleeting = false;  // 闪烁灯效果是否开启
String pcLightColor = "white"; // 灯光颜色，取值："red" / "green" / "blue" / "white" / "purple"

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
    fullstatus["pcFanVolume"] = pcFanVolume;
    fullstatus["pcFanIn"] = pcFanIn;
    fullstatus["pcFanOut"] = pcFanOut;

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
    basedata["temperature"] = temperature;
    basedata["humidity"] = humidity;

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
    basedata["pcLightBreathing"] = pcLightBreathing;
    basedata["pcLightFleeting"] = pcLightFleeting;
    basedata["pcLightColor"] = pcLightColor;

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
    doc["services"][0]["properties"]["pcStatus"] = pcStatus;

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
        pcLightBreathing = doc["paras"]["pcLightBreathing"].as<bool>();
        pcLightFleeting = doc["paras"]["pcLightFleeting"].as<bool>();
        pcLightColor = doc["paras"]["pcLightColor"].as<String>();

        Serial.println("【灯光控制命令】");
        Serial.println("呼吸灯：" + String(pcLightBreathing ? "开启" : "关闭"));
        Serial.println("流光灯：" + String(pcLightFleeting ? "开启" : "关闭"));
        Serial.println("灯光颜色：" + pcLightColor);
    }
    else if (commandName == "pcFanCtrl")
    {
        pcFanIn = doc["paras"]["pcFanIn"].as<bool>();
        pcFanOut = doc["paras"]["pcFanOut"].as<bool>();
        pcFanVolume = doc["paras"]["pcFanVolume"].as<String>();

        Serial.println("【风扇控制命令】");
        Serial.println("进风风扇：" + String(pcFanIn ? "开启" : "关闭"));
        Serial.println("出风风扇：" + String(pcFanOut ? "开启" : "关闭"));
        Serial.println("风速档位：" + pcFanVolume);
    }
    else if (commandName == "pcStatusCtrl")
    {
        pcStatus = doc["paras"]["pcStatus"].as<bool>();

        Serial.println("【主机电源控制命令】");
        Serial.println("主机状态：" + String(pcStatus ? "开启" : "关闭"));
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
    pcStatus = (data >> 6) & 0x01;             // 主机状态（第7位）
    pcFanIn = (data >> 7) & 0x01;              // 进风风扇（第8位）
    pcFanOut = (data >> 8) & 0x01;             // 出风风扇（第9位）
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
        pcLightBreathing = (lightColor == 1); // 呼吸灯
        pcLightFleeting = (lightColor == 7);  // 流光灯

        // 设置颜色（只对静态颜色生效）
        if (lightColor >= 2 && lightColor <= 6)
            pcLightColor = colorMap[lightColor];
        else
            pcLightColor = ""; // 对于 breathing/fleeting/关灯，不设置颜色
    }

    // 风速映射（与定义一致）
    if (fanSpeedBits == 1)
        pcFanVolume = "low";
    else if (fanSpeedBits == 2)
        pcFanVolume = "medium";
    else if (fanSpeedBits == 3)
        pcFanVolume = "high";
    else
        pcFanVolume = ""; // 0 表示关闭或无风速

    // 串口调试信息（可选）
    Serial.println("【主机状态数据解析】");
    Serial.print("灯光颜色编号：");
    Serial.print(lightColor);
    Serial.print(" → ");
    Serial.println(pcLightColor);
    Serial.print("呼吸灯：");
    Serial.println(pcLightBreathing ? "开启" : "关闭");
    Serial.print("流光灯：");
    Serial.println(pcLightFleeting ? "开启" : "关闭");
    Serial.print("主机状态：");
    Serial.println(pcStatus ? "开启" : "关闭");
    Serial.print("进风风扇：");
    Serial.println(pcFanIn ? "开启" : "关闭");
    Serial.print("出风风扇：");
    Serial.println(pcFanOut ? "开启" : "关闭");
    Serial.print("风速档位：");
    Serial.println(pcFanVolume);
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
    static uint8_t buffer[8];
    static uint8_t bufferIndex = 0;
    // 尝试扫描并连接云，如果没有连接将会一直client.loop
    if (!client.connected())
    {
        MQTT_Init();
    }
    else
    {
        client.loop();
    }
    long now_stamp = millis();
    if (now_stamp - last_stamp > 10000)
    { // 每 10 秒上报一次
        last_stamp = now_stamp;
        // MQTT_Report_Status();
        // MQTT_Report_Fan();
        // MQTT_Report_Light();
        // MQTT_Report_BaseData();
    }
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
                delay(100);
                MQTT_Report_Fan();
                delay(100);
                MQTT_Report_Light();
                delay(100);
                MQTT_Report_BaseData();
                delay(100);
            }

            bufferIndex = 0; // 重置缓冲区
        }
    }
}
