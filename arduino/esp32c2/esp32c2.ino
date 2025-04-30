#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <HardwareSerial.h>
#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include <esp_system.h>

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <WiFiManager.h> // 必须安装WiFiManager库
#include <WiFi.h>
#include <ESPmDNS.h>

// 串口配置
HardwareSerial SerialPort(1); // 使用 UART1
#define RX_PIN 3              // TX_PIN PB5
#define TX_PIN 1              // RX_PIN PB6

// WiFi 配置
WiFiClient espClient;
const char *ssid = "odddouglas";
const char *password = "odddouglas";

// MQTT 配置（请使用 mqtt 端口 1883，而非 mqtts）
PubSubClient client(espClient);
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
    int pcStatus;          // 主机状态 （按上位机需求，设置成0和1）
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
#define MAX_FRAME_ERRORS 2 // 最大允许错误次数, 否则触发软件复位

// 蓝牙配置
BLECharacteristic *pCharacteristic;
bool isConnected = false; // 是否蓝牙连接
#define SERVICE_UUID "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHARACTERISTIC_UUID_RX "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHARACTERISTIC_UUID_TX "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"
#define BLE_NAME "BLE_ESP32C2_Server"

// BLE服务器连接回调
class BLE_MyServer_Callbacks : public BLEServerCallbacks
{
    void onConnect(BLEServer *pServer) { isConnected = true; }
    void onDisconnect(BLEServer *pServer) { isConnected = false; }
};

// BLE特征写入回调
class BLE_Characteristic_RX_Callbacks : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *pCharacteristic)
    {
        String rxValueString = pCharacteristic->getValue(); // Get as Arduino String
        std::string rxValue(rxValueString.c_str());         // Convert to std::string
        if (rxValue.length() > 0)
        {
            Serial.print("[BLE] Received BLE_Value: ");
            for (int i = 0; i < rxValue.length(); i++)
                Serial.print(rxValue[i]);
        }
    }
};
// BLE 初始化函数
void BLE_Init()
{
    BLEDevice::init(BLE_NAME);
    BLEServer *pServer = BLEDevice::createServer();
    pServer->setCallbacks(new BLE_MyServer_Callbacks());

    BLEService *pService = pServer->createService(SERVICE_UUID);

    pCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID_TX,
        BLECharacteristic::PROPERTY_NOTIFY);
    pCharacteristic->addDescriptor(new BLE2902());

    BLECharacteristic *pCharacteristic_RX = pService->createCharacteristic(
        CHARACTERISTIC_UUID_RX,
        BLECharacteristic::PROPERTY_WRITE);
    pCharacteristic_RX->setCallbacks(new BLE_Characteristic_RX_Callbacks());

    pService->start();
    pServer->getAdvertising()->start();

    Serial.println("[BLE] waiting...");
}

void WIFI_Init()
{
    WiFi.begin(ssid, password);
    Serial.print("[WiFi] Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println();
    sendStatusPacket(0x0033);
    Serial.println("[WiFi] connected");
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

    String commandName = doc["command_name"];
    if (commandName == "pcStatus")
    {
        IssueData.pcStatus = doc["paras"]["status"].as<bool>();
        sendStatusPacket(IssueData.pcStatus ? 0x0007 : 0x0008);
    }
    else if (commandName == "pcFanVolume")
    {
        String vol = doc["paras"]["volume"].as<String>();
        IssueData.pcFanVolume = vol;

        if (vol == "high")
            sendStatusPacket(0x0004);
        else if (vol == "medium")
            sendStatusPacket(0x0005);
        else if (vol == "low")
            sendStatusPacket(0x0006);
    }
    else if (commandName == "pcFanIn")
    {
        IssueData.pcFanIn = doc["paras"]["status"].as<bool>();
        sendStatusPacket(IssueData.pcFanIn ? 0x0013 : 0x0015);
    }
    else if (commandName == "pcFanOut")
    {
        IssueData.pcFanOut = doc["paras"]["status"].as<bool>();
        sendStatusPacket(IssueData.pcFanOut ? 0x0014 : 0x0016);
    }
    else if (commandName == "pcLightColor")
    {
        IssueData.pcLightColor = doc["paras"]["color"].as<String>();

        if (IssueData.pcLightColor == "red")
            sendStatusPacket(0x000D);
        else if (IssueData.pcLightColor == "green")
            sendStatusPacket(0x000E);
        else if (IssueData.pcLightColor == "blue")
            sendStatusPacket(0x000F);
        else if (IssueData.pcLightColor == "white")
            sendStatusPacket(0x0010);
        else if (IssueData.pcLightColor == "purple")
            sendStatusPacket(0x0011);
    }
    else if (commandName == "pcLgihtBreathing")
    {
        IssueData.pcLightBreathing = doc["paras"]["status"].as<bool>();
        if (IssueData.pcLightBreathing)
            sendStatusPacket(0x000C); // 呼吸灯开启
    }
    else if (commandName == "pcLightFleeting")
    {
        IssueData.pcLightFleeting = doc["paras"]["status"].as<bool>();
        if (IssueData.pcLightFleeting)
            sendStatusPacket(0x0012); // 流光开启
    }
    else
    {
        MQTT_Respond(String(topic), "failure");
        return;
    }
    MQTT_Respond(String(topic), "success");
    // ======== 串口调试信息（统一风格）========
    Serial.println("【PACKET】【主机状态数据解析】");
    Serial.print("主机状态：");
    Serial.println(IssueData.pcStatus ? "开启" : "关闭");
    Serial.print("呼吸灯：");
    Serial.println(IssueData.pcLightBreathing ? "开启" : "关闭");
    Serial.print("流光灯：");
    Serial.println(IssueData.pcLightFleeting ? "开启" : "关闭");
    Serial.print("常亮灯：");
    Serial.println(IssueData.pcLightColor);
    Serial.print("进风风扇：");
    Serial.println(IssueData.pcFanIn ? "开启" : "关闭");
    Serial.print("出风风扇：");
    Serial.println(IssueData.pcFanOut ? "开启" : "关闭");
    Serial.print("风速档位：");
    Serial.println(IssueData.pcFanVolume);
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

// 解析串口数据
void parseDataBuffer(uint16_t data)
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
    Serial.println("【BUFFER】【主机状态数据解析】");
    Serial.print("主机状态：");
    Serial.println(ReportData.pcStatus ? "开启" : "关闭");
    Serial.print("呼吸灯：");
    Serial.println(ReportData.pcLightBreathing ? "开启" : "关闭");
    Serial.print("流光灯：");
    Serial.println(ReportData.pcLightFleeting ? "开启" : "关闭");
    Serial.print("常亮灯：");
    Serial.println(ReportData.pcLightColor);
    Serial.print("进风风扇：");
    Serial.println(ReportData.pcFanIn ? "开启" : "关闭");
    Serial.print("出风风扇：");
    Serial.println(ReportData.pcFanOut ? "开启" : "关闭");
    Serial.print("风速档位：");
    Serial.println(ReportData.pcFanVolume);
}

void sendStatusPacket(uint16_t cmd_id)
{
    uint8_t packet[8];

    // ======== 帧结构 ========
    packet[0] = 0xA5;
    packet[1] = 0xFA;
    packet[2] = 0x00; // 产品ID
    packet[3] = 0x03; // 消息类型

    // 命令词 ID（低位在前，高位在后）
    packet[4] = cmd_id & 0xFF;
    packet[5] = (cmd_id >> 8) & 0xFF;

    // 校验和 = 产品ID + 消息类型 + 命令ID低 + 命令ID高
    uint8_t checksum = packet[0] + packet[1] + packet[2] + packet[3] + packet[4] + packet[5];

    packet[6] = checksum;

    packet[7] = 0xFB; // 帧尾

    // ======== 串口调试打印 ========
    Serial.println("=== Voice Command Packet Sent ===");
    for (int i = 0; i < 8; i++)
    {
        Serial.print("0x");
        if (packet[i] < 0x10)
            Serial.print("0");
        Serial.print(packet[i], HEX);
        Serial.print(" ");
    }
    Serial.println();
    // ======== 串口发送 ========
    SerialPort.write(packet, 8);
}

void WIFI_AP_Init()
{
    Serial.println("\n启动中...");

    // 初始化WiFiManager
    WiFiManager wifiManager;

    // 可选配置 ----------------------------------------
    // 设置配网超时时间（单位：秒，超时后自动重启）
    wifiManager.setTimeout(180);
    // 自定义AP名称和密码（默认无密码）
    // wifiManager.autoConnect("ESP32-AP", "12345678");
    // ------------------------------------------------

    // 尝试连接已保存的WiFi，若失败则启动配网AP
    if (!wifiManager.autoConnect("ESP32-Config"))
    {
        Serial.println("配网失败，重启设备");
        delay(3000);
        ESP.restart(); // 重启
    }

    // 配网成功后的逻辑 --------------------------------
    Serial.println("\nWiFi已连接！");
    Serial.print("IP地址: ");
    Serial.println(WiFi.localIP());

    // 可选：启用mDNS服务（通过域名访问ESP32）
    if (MDNS.begin("esp32"))
    {
        Serial.println("mDNS域名: esp32.local");
    }
}
void setup()
{
    Serial.begin(9600);                                 // 用于打印调试信息
    SerialPort.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN); // 初始化 UART1，RX=GPIO3，TX=GPIO1
    delay(100);                                         // 等待串口初始化
    // WIFI_Init();                                        // 等待wifi连接
    WIFI_AP_Init();
    MQTT_Init(); // 初始化MQTT尝试连接
    // BLE_Init();                                         // 蓝牙初始化
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
        // MQTT_Report_BaseData();
    }

    // 串口接受区
    static uint8_t buffer[8];
    static uint8_t bufferIndex = 0;
    while (SerialPort.available())
    {
        uint8_t incomingByte = SerialPort.read();
        buffer[bufferIndex++] = incomingByte;

        // 检测完整数据包
        if (bufferIndex >= 8)
        {
            Serial.println("=== Full Buffer Received ===");

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
                parseDataBuffer(buffer[4] | (buffer[5] << 8)); // 处理命令词ID

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
