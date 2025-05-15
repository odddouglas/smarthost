#include "bsp_mqtt.h"

#define MQTT_ADDRESS "mqtt://e5e7404266.st1.iotda-device.cn-north-4.myhuaweicloud.com:1883"
#define MQTT_CLIENFID "67fe4c765367f573f7830638_esp32_0_0_2025051303"
#define MQTT_USERNAME "67fe4c765367f573f7830638_esp32"
#define MQTT_PASSWORD "beb57fa257b6fc3dc92d71a515d059d0788640a6f17b82c78860c18c5fde50ff"

#define DEVICE_ID "67fe4c765367f573f7830638_esp32"
#define SERVER_ID "gateway_data"
#define MQTT_TOPIC_REPORT "$oc/devices/" DEVICE_ID "/sys/properties/report"
#define MQTT_TOPIC_COMMAND "$oc/devices/" DEVICE_ID "/sys/commands/#"
#define MQTT_TOPIC_COMMAND_RESPOND "$oc/devices/" DEVICE_ID "/sys/commands/response/request_id="

static const char *TAG = "MQTT";
static esp_mqtt_client_handle_t mqtt_handle = NULL;

IssueData2MCU IssueData = {0};

void mqtt_event_callback(void *event_handler_arg,
                         esp_event_base_t event_base,
                         int32_t event_id,
                         void *event_data)
{
    esp_mqtt_event_handle_t data = (esp_mqtt_event_handle_t)event_data;

    switch (event_id)
    {
    case MQTT_EVENT_CONNECTED:
        ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");
        esp_mqtt_client_subscribe(mqtt_handle, MQTT_TOPIC_COMMAND, 1); // 订阅命令topic
        break;

    case MQTT_EVENT_DISCONNECTED:
        ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
        break;

    case MQTT_EVENT_SUBSCRIBED:
        ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED ACK");
        break;

    case MQTT_EVENT_UNSUBSCRIBED:
        ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED ACK");
        break;

    case MQTT_EVENT_PUBLISHED:
        ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED ACK, msg_id=%d", data->msg_id);

        break;

    case MQTT_EVENT_DATA:
        ESP_LOGI(TAG, "MQTT_EVENT_DATA");
        // printf("TOPIC=%.*s\r\n", data->topic_len, data->topic);
        printf("DATA=%.*s\r\n", data->data_len, data->data);
        mqtt_cmd_handler((char *)data->topic, data->data, data->data_len);
        break;

    case MQTT_EVENT_ERROR:
        ESP_LOGE(TAG, "MQTT_EVENT_ERROR");
        break;

    default:   
        ESP_LOGW(TAG, "MQTT_DEFAULT");
        break;
    }
}
void mqtt_start(void)
{
    esp_mqtt_client_config_t mqtt_cfg = {
        .broker.address.uri = MQTT_ADDRESS,
        .credentials.client_id = MQTT_CLIENFID,
        .credentials.username = MQTT_USERNAME,
        .credentials.authentication.password = MQTT_PASSWORD,
    };
    mqtt_handle = esp_mqtt_client_init(&mqtt_cfg);
    esp_mqtt_client_register_event(mqtt_handle, ESP_EVENT_ANY_ID, mqtt_event_callback, NULL);
    ESP_ERROR_CHECK(esp_mqtt_client_start(mqtt_handle));
}
void mqtt_respond(const char *topic, const char *result)
{
    // 提取 request_id
    const char *id = strstr(topic, "request_id=");
    if (!id)
        return;
    char topic_buf[256]; // 构造 topic
    snprintf(topic_buf, sizeof(topic_buf), "%s%s", MQTT_TOPIC_COMMAND_RESPOND, id + 11);

    cJSON *root = cJSON_CreateObject(); // 构造 JSON
    cJSON_AddNumberToObject(root, "result_code", 0);
    cJSON_AddStringToObject(root, "response_name", "COMMAND_RESPONSE");
    cJSON *paras = cJSON_CreateObject();
    cJSON_AddStringToObject(paras, "result", result);
    cJSON_AddItemToObject(root, "paras", paras);

    char *payload = cJSON_PrintUnformatted(root);
    esp_mqtt_client_publish(mqtt_handle, topic_buf, payload, 0, 1, 0); // 发送

    cJSON_Delete(root); // 清理
    free(payload);
}
void mqtt_cmd_handler(const char *topic, const char *payload, int length)
{
    cJSON *root = cJSON_ParseWithLength(payload, length);
    if (!root)
    {
        ESP_LOGE(TAG, "Failed to parse JSON");
        mqtt_respond(topic, "failure");
        return;
    }

    cJSON *cmd = cJSON_GetObjectItem(root, "command_name");
    cJSON *paras = cJSON_GetObjectItem(root, "paras");

    if (!cJSON_IsString(cmd) || !paras)
    {
        ESP_LOGE(TAG, "Invalid command or paras");
        cJSON_Delete(root);
        mqtt_respond(topic, "failure");
        return;
    }

    const char *commandName = cmd->valuestring;
    bool valid = true;

    if (strcmp(commandName, "pcStatus") == 0)
    {
        cJSON *status_item = cJSON_GetObjectItem(paras, "status");
        if (cJSON_IsBool(status_item))
        {
            IssueData.pcStatus = cJSON_IsTrue(status_item);
            send_status_packet(IssueData.pcStatus ? 0x0007 : 0x0008);
        }
        else
            valid = false;
    }
    else if (strcmp(commandName, "pcFanVolume") == 0)
    {
        cJSON *vol_item = cJSON_GetObjectItem(paras, "volume");
        if (cJSON_IsString(vol_item))
        {
            const char *vol = vol_item->valuestring;
            strncpy(IssueData.pcFanVolume, vol, sizeof(IssueData.pcFanVolume) - 1);
            IssueData.pcFanVolume[sizeof(IssueData.pcFanVolume) - 1] = '\0';

            if (strcmp(vol, "high") == 0)
                send_status_packet(0x0004);
            else if (strcmp(vol, "medium") == 0)
                send_status_packet(0x0005);
            else if (strcmp(vol, "low") == 0)
                send_status_packet(0x0006);
            else
            {
                ESP_LOGW(TAG, "Unknown fan volume: %s", vol);
                valid = false;
            }
        }
        else
            valid = false;
    }
    else if (strcmp(commandName, "pcFanIn") == 0)
    {
        cJSON *status_item = cJSON_GetObjectItem(paras, "status");
        if (cJSON_IsBool(status_item))
        {
            IssueData.pcFanIn = cJSON_IsTrue(status_item);
            send_status_packet(IssueData.pcFanIn ? 0x0013 : 0x0015);
        }
        else
            valid = false;
    }
    else if (strcmp(commandName, "pcFanOut") == 0)
    {
        cJSON *status_item = cJSON_GetObjectItem(paras, "status");
        if (cJSON_IsBool(status_item))
        {
            IssueData.pcFanOut = cJSON_IsTrue(status_item);
            send_status_packet(IssueData.pcFanOut ? 0x0014 : 0x0016);
        }
        else
            valid = false;
    }
    else if (strcmp(commandName, "pcLightColor") == 0)
    {
        cJSON *color_item = cJSON_GetObjectItem(paras, "color");
        if (cJSON_IsString(color_item))
        {
            const char *color = color_item->valuestring;
            strncpy(IssueData.pcLightColor, color, sizeof(IssueData.pcLightColor) - 1);
            IssueData.pcLightColor[sizeof(IssueData.pcLightColor) - 1] = '\0';

            if (strcmp(color, "red") == 0)
                send_status_packet(0x000D);
            else if (strcmp(color, "green") == 0)
                send_status_packet(0x000E);
            else if (strcmp(color, "blue") == 0)
                send_status_packet(0x000F);
            else if (strcmp(color, "white") == 0)
                send_status_packet(0x0010);
            else if (strcmp(color, "purple") == 0)
                send_status_packet(0x0011);
            else
            {
                ESP_LOGW(TAG, "Unknown light color: %s", color);
                valid = false;
            }
        }
        else
            valid = false;
    }
    else if (strcmp(commandName, "pcLightBreathing") == 0)
    {
        cJSON *status_item = cJSON_GetObjectItem(paras, "status");
        if (cJSON_IsBool(status_item))
        {
            IssueData.pcLightBreathing = cJSON_IsTrue(status_item);
            if (IssueData.pcLightBreathing)
                send_status_packet(0x000C);
        }
        else
            valid = false;
    }
    else if (strcmp(commandName, "pcLightFleeting") == 0)
    {
        cJSON *status_item = cJSON_GetObjectItem(paras, "status");
        if (cJSON_IsBool(status_item))
        {
            IssueData.pcLightFleeting = cJSON_IsTrue(status_item);
            if (IssueData.pcLightFleeting)
                send_status_packet(0x0012);
        }
        else
            valid = false;
    }
    else
    {
        ESP_LOGW(TAG, "Unknown command: %s", commandName);
        valid = false;
    }

    if (valid)
        mqtt_respond(topic, "success");
    else
        mqtt_respond(topic, "failure");

    // ======== 串口调试输出 ========
    ESP_LOGI(TAG, "【PACKET】【主机状态数据解析】");
    ESP_LOGI(TAG, "主机状态：%s", IssueData.pcStatus ? "开启" : "关闭");
    ESP_LOGI(TAG, "呼吸灯：%s", IssueData.pcLightBreathing ? "开启" : "关闭");
    ESP_LOGI(TAG, "流光灯：%s", IssueData.pcLightFleeting ? "开启" : "关闭");
    ESP_LOGI(TAG, "常亮灯：%s", IssueData.pcLightColor);
    ESP_LOGI(TAG, "进风风扇：%s", IssueData.pcFanIn ? "开启" : "关闭");
    ESP_LOGI(TAG, "出风风扇：%s", IssueData.pcFanOut ? "开启" : "关闭");
    ESP_LOGI(TAG, "风速档位：%s", IssueData.pcFanVolume);

    cJSON_Delete(root);
}

void mqtt_report_FAN(void)
{
    cJSON *root = cJSON_CreateObject();
    cJSON *services = cJSON_CreateArray();
    cJSON_AddItemToObject(root, "services", services);

    cJSON *service = cJSON_CreateObject();
    cJSON_AddItemToArray(services, service);
    cJSON_AddStringToObject(service, "service_id", SERVER_ID);

    cJSON *properties = cJSON_CreateObject();
    cJSON_AddItemToObject(service, "properties", properties);

    cJSON *pcFan = cJSON_CreateObject();
    cJSON_AddStringToObject(pcFan, "pcFanVolume", ReportData.pcFanVolume); // string
    cJSON_AddBoolToObject(pcFan, "pcFanIn", ReportData.pcFanIn);
    cJSON_AddBoolToObject(pcFan, "pcFanOut", ReportData.pcFanOut);

    cJSON_AddItemToObject(properties, "pcFan", pcFan);

    char *json_str = cJSON_PrintUnformatted(root);
    ESP_LOGI("MQTT", "[MQTT] Publish FullStatus:\n%s", json_str);

    int msg_id = esp_mqtt_client_publish(mqtt_handle, MQTT_TOPIC_REPORT, json_str, 0, 1, 0);
    ESP_LOGI(TAG, "MQTT Publish %s, msg_id=%d", (msg_id == -1 ? "failed" : "success"), msg_id);

    cJSON_Delete(root);
    free(json_str);
}
