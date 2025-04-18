#include <ArduinoJson.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <HardwareSerial.h>
#define RX_PIN 3
#define TX_PIN 1

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

// 布尔类型变量，用于存储设备状态
bool pcFanStatus = false;
bool pcStatus = false;
bool pcFanVolume = false;
bool pcLightBreathing = false;
bool pcLightFleeting = false;
bool pcFanIn = false;
bool pcFanOut = false;
double temperature = 0.0;
double humidity = 0.0;
// 字符串数组，用于存储颜色
String pcLightColor[4]; // 假设最多存储 4 个颜色

String cmd = "";
bool doSend = false;
long last = 0;
bool test_val = true;

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
void MQTT_Report_FullStatus()
{
    // 创建一个 JSON 文档对象
    StaticJsonDocument<256> doc; // 更大的文档空间

    // 填充 JSON 数据
    doc["services"][0]["service_id"] = SERVER_ID;

    // 上传 fullstatus 数据
    JsonObject fullstatus = doc["services"][0]["properties"].createNestedObject("fullstatus");
    fullstatus["pcFanStatus"] = pcFanStatus;
    fullstatus["pcStatus"] = pcStatus;
    fullstatus["pcFanVolume"] = pcFanVolume;

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
    JsonObject basedata = doc["services"][0]["properties"].createNestedObject("basedata");
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

void MQTT_Report_Test()
{
    // 创建一个 JSON 文档对象
    StaticJsonDocument<256> doc;

    // 填充 JSON 数据
    doc["services"][0]["service_id"] = SERVER_ID;
    doc["services"][0]["properties"]["test"] = test_val;

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
    StaticJsonDocument<512> doc; // 创建静态 JSON 文档用于解析

    DeserializationError error = deserializeJson(doc, payload, length); // 解析接收到的 JSON 数据
    if (error)
    {
        Serial.println("Failed to parse JSON"); // 打印解析失败信息
        return;                                 // 退出处理函数
    }

    String payloadStr = ""; // 用于打印接收到的原始 JSON 字符串
    for (unsigned int i = 0; i < length; i++)
    {
        payloadStr += (char)payload[i]; // 字节流转换为字符串
    }
    Serial.println("Received command: " + payloadStr); // 打印接收到的命令

    String commandName = doc["command_name"]; // 获取命令名称字段

    if (commandName == "pcCtrl") // 判断是否为控制命令
    {
        // 读取布尔类型的参数
        pcFanStatus = doc["paras"]["pcFanStatus"].as<bool>();
        pcStatus = doc["paras"]["pcStatus"].as<bool>();
        pcFanVolume = doc["paras"]["pcFanVolume"].as<bool>();
        pcLightBreathing = doc["paras"]["pcLightBreathing"].as<bool>();
        pcLightFleeting = doc["paras"]["pcLightFleeting"].as<bool>();
        pcFanIn = doc["paras"]["pcFanIn"].as<bool>();
        pcFanOut = doc["paras"]["pcFanOut"].as<bool>();

        // 读取字符串数组参数
        JsonArray lightColorArray = doc["paras"]["pcLightColor"].as<JsonArray>();
        for (int i = 0; i < lightColorArray.size(); i++)
        {
            if (i < 4) // 假设最多有4个颜色
            {
                pcLightColor[i] = lightColorArray[i].as<String>(); // 存储颜色数组
            }
        }

        // 打印解析的结果
        Serial.println("pcFanStatus: " + String(pcFanStatus ? "true" : "false"));
        Serial.println("pcStatus: " + String(pcStatus ? "true" : "false"));
        Serial.println("pcFanVolume: " + String(pcFanVolume ? "true" : "false"));
        Serial.println("pcLightBreathing: " + String(pcLightBreathing ? "true" : "false"));
        Serial.println("pcLightFleeting: " + String(pcLightFleeting ? "true" : "false"));
        Serial.println("pcFanIn: " + String(pcFanIn ? "true" : "false"));
        Serial.println("pcFanOut: " + String(pcFanOut ? "true" : "false"));

        String colorStr = "";
        for (int i = 0; i < 4 && i < lightColorArray.size(); i++)
        {
            colorStr += pcLightColor[i] + " ";
        }
        Serial.println("pcLightColor: " + colorStr);

        // 构造 4 位 01 字符串命令
        cmd = "";
        cmd += (pcFanStatus ? "1" : "0");
        cmd += (pcStatus ? "1" : "0");
        cmd += (pcFanVolume ? "1" : "0");
        cmd += (pcLightBreathing ? "1" : "0");
        cmd += (pcLightFleeting ? "1" : "0");
        cmd += (pcFanIn ? "1" : "0");
        cmd += (pcFanOut ? "1" : "0");

        // 回复命令成功
        MQTT_Respond(String(topic), "success");
        doSend = true; // 标记需要发送数据
    }
    else
    {
        // 如果命令无效，回复失败
        MQTT_Respond(String(topic), "failure");
    }
}

void setup()
{
    Serial.begin(9600);
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
    long now = millis();
    if (now - last > 1000)
    { // 每 10 秒上报一次
        last = now;
        
        // MQTT_Report_Test();
        // MQTT_Report_FullStatus();
        // MQTT_Report_BaseData();
    }

    // 直接打印所有收到的字节（不检查帧格式）
    // while (SerialPort.available())
    // {
    // uint8_t incomingByte = SerialPort.read();
    // Serial.print(incomingByte, HEX);
    // Serial.print("\n"); // 用空格分隔字节
    // }

    while (SerialPort.available())
    {
        uint8_t incomingByte = SerialPort.read();
        Serial.print(incomingByte, HEX);
        Serial.print("\n"); // 用空格分隔字节
        buffer[bufferIndex++] = incomingByte;
        //Serial.print(bufferIndex);
        //Serial.print("\n"); // 用空格分隔字节

        // 检测完整数据包
        if (bufferIndex >= 8)
        {
            // parseDataPacket(buffer);
            Serial.println("=== Full Packet Received ===");
            
            // 打印整个buffer内容
            for (int i = 0; i < 8; i++) {
                Serial.print("0x");
                Serial.print(buffer[i], HEX);
                Serial.print(" ");
            }
            Serial.println();

            // 解析数据包
          //  parseDataPacket(buffer);

            bufferIndex = 0; // 重置缓冲区
        }
    }

}
