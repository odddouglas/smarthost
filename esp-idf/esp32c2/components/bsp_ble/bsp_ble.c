#include "bsp_ble.h"
static const char *TAG = "BLE";
// 0xA5 0xFA 0x00 0x81 0xC5 0x07 0xEC 0xFB
enum
{
    // 服务1
    SV1_IDX_SVC,

    // 特征1
    SV1_CH1_IDX_CHAR,
    SV1_CH1_IDX_CHAR_VAL,
    SV1_CH1_IDX_CHAR_CFG,

    // 特征2
    SV1_CH2_IDX_CHAR,
    SV1_CH2_IDX_CHAR_VAL,
    SV1_CH2_IDX_CHAR_CFG,

    SV1_IDX_NB,
};

static const uint16_t GATTS_SERVICE_UUID_TEST = 0x180A; // 类型为设备信息
static const uint16_t GATTS_CHAR_UUID_CH1 = 0x2A57;     // 类型为数字输出
static const uint16_t GATTS_CHAR_UUID_CH2 = 0x2AFF;     //

// 主要服务声明UUID 0x2800
static const uint16_t primary_service_uuid = ESP_GATT_UUID_PRI_SERVICE;

// 次要服务声明UUID 0x2801
// static const uint16_t second_service_uuid          = ESP_GATT_UUID_SEC_SERVICE;

// 特征声明UUID 0x2803
static const uint16_t character_declaration_uuid = ESP_GATT_UUID_CHAR_DECLARE;

// 特征描述UUID 0x2902
static const uint16_t character_client_config_uuid = ESP_GATT_UUID_CHAR_CLIENT_CONFIG;
// 读权限
// static const uint8_t char_prop_read                =  ESP_GATT_CHAR_PROP_BIT_READ;
// 写权限
// static const uint8_t char_prop_write               = ESP_GATT_CHAR_PROP_BIT_WRITE;
// 读写、通知权限
static const uint8_t char_prop_read_write_notify = ESP_GATT_CHAR_PROP_BIT_WRITE | ESP_GATT_CHAR_PROP_BIT_READ | ESP_GATT_CHAR_PROP_BIT_NOTIFY;
// 读、通知权限
static const uint8_t char_prop_read_notify = ESP_GATT_CHAR_PROP_BIT_READ | ESP_GATT_CHAR_PROP_BIT_NOTIFY;
// 特征1客户端特征配置
static uint8_t sv1_ch1_client_cfg[2] = {0x00, 0x00};
// 特征2客户端特征配置
static uint8_t sv1_ch2_client_cfg[2] = {0x00, 0x00};

// gatt的访问接口，一个Profile（APP）对应1个
static uint16_t gl_gatts_if = ESP_GATT_IF_NONE;
// 连接ID，连接成功后
static uint16_t gl_conn_id = 0xFFFF;

// 服务1的两个特征值
static uint8_t sv1_char1_value[8] = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00}; // 用于接收
static uint8_t sv1_char2_value[8] = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00}; // 用于发送

// att的handle表
uint16_t sv1_handle_table[SV1_IDX_NB];

static uint8_t adv_config_done = 0;

#define ADV_CONFIG_FLAG (1 << 0)
#define SCAN_RSP_CONFIG_FLAG (1 << 1)

// 广播参数
static esp_ble_adv_params_t adv_params = {
    .adv_int_min = 0x20,                                    // 最小广播间隔，单位:0.625ms
    .adv_int_max = 0x40,                                    // 最大广播间隔，单位:0.625ms
    .adv_type = ADV_TYPE_IND,                               // 广播类型(可连接的非定向广播)
    .own_addr_type = BLE_ADDR_TYPE_PUBLIC,                  // 使用固定地址广播
    .channel_map = ADV_CHNL_ALL,                            // 在37、38、39信道进行广播
    .adv_filter_policy = ADV_FILTER_ALLOW_SCAN_ANY_CON_ANY, // 广播过滤策略（接收任何scan和任何连接）
};

// gatt描述表
static const esp_gatts_attr_db_t gatt1_db[SV1_IDX_NB] =
    {
        // 服务声明
        [SV1_IDX_SVC] =
            {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t *)&primary_service_uuid, ESP_GATT_PERM_READ, sizeof(uint16_t), sizeof(GATTS_SERVICE_UUID_TEST), (uint8_t *)&GATTS_SERVICE_UUID_TEST}},

        // 特征1
        // 特征声明
        [SV1_CH1_IDX_CHAR] =
            {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t *)&character_declaration_uuid, ESP_GATT_PERM_READ, sizeof(uint8_t), sizeof(uint8_t), (uint8_t *)&char_prop_read_write_notify}}, // 特征值1允许读写和通知
                                                                                                                                                                                             // 特征值
        [SV1_CH1_IDX_CHAR_VAL] =
            {{ESP_GATT_RSP_BY_APP}, {ESP_UUID_LEN_16, (uint8_t *)&GATTS_CHAR_UUID_CH1, ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE, sizeof(sv1_char1_value), sizeof(sv1_char1_value), (uint8_t *)sv1_char1_value}},
        // 特征描述->客户端特征配置
        [SV1_CH1_IDX_CHAR_CFG] =
            {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t *)&character_client_config_uuid, ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE, sizeof(uint16_t), sizeof(sv1_ch1_client_cfg), (uint8_t *)sv1_ch1_client_cfg}},

        // 特征2
        // 特征声明
        [SV1_CH2_IDX_CHAR] =
            {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t *)&character_declaration_uuid, ESP_GATT_PERM_READ, sizeof(uint8_t), sizeof(uint8_t), (uint8_t *)&char_prop_read_notify}}, // 特征值2只允许读和通知

        // 特征值
        [SV1_CH2_IDX_CHAR_VAL] =
            {{ESP_GATT_RSP_BY_APP}, {ESP_UUID_LEN_16, (uint8_t *)&GATTS_CHAR_UUID_CH2, ESP_GATT_PERM_READ, sizeof(sv1_char2_value), sizeof(sv1_char2_value), (uint8_t *)sv1_char2_value}},

        // 特征描述->客户端特征配置
        [SV1_CH2_IDX_CHAR_CFG] =
            {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t *)&character_client_config_uuid, ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE, sizeof(uint16_t), sizeof(sv1_ch2_client_cfg), (uint8_t *)&sv1_ch2_client_cfg}},

};

static uint8_t adv_service_uuid16[] = {
    /* LSB <--------------------------------------------------------------------------------> MSB */
    // first uuid, 16bit, [12],[13] is the value
    0xfb, 0x34, 0x9b, 0x5f, 0x80, 0x00, 0x00, 0x80, 0x00, 0x10, 0x00, 0x00, GATTS_SERVICE_UUID_TEST & 0xff, (GATTS_SERVICE_UUID_TEST >> 8) & 0xff, 0x00, 0x00,
    // GATTS_SERVICE_UUID_TEST&0xff,(GATTS_SERVICE_UUID_TEST>>8)&0xff,
    // GATTS_SERVICE2_UUID_TEST&0xff,(GATTS_SERVICE2_UUID_TEST>>8)&0xff,
};

// The length of adv data must be less than 31 bytes
// static uint8_t test_manufacturer[TEST_MANUFACTURER_DATA_LEN] =  {0x12, 0x23, 0x45, 0x56};
// adv data广播数据
static esp_ble_adv_data_t adv_data = {
    .set_scan_rsp = false,                                                // 此广播数据是否扫描回复
    .include_name = true,                                                 // 是否包含名字
    .include_txpower = false,                                             // 是否包含发射功率
    .min_interval = 0x0006,                                               // 最小连接间隔 单位1.25ms
    .max_interval = 0x0010,                                               // 最大连接间隔 单位1.25ms
    .appearance = 0x00,                                                   // apperance
    .manufacturer_len = 0,                                                // 厂商信息长度
    .p_manufacturer_data = NULL,                                          // 厂商信息
    .service_data_len = 0,                                                // 服务数据长度
    .p_service_data = NULL,                                               // 服务数据
    .service_uuid_len = sizeof(adv_service_uuid16),                       // 服务UUID长度
    .p_service_uuid = adv_service_uuid16,                                 // 服务UUID
    .flag = (ESP_BLE_ADV_FLAG_GEN_DISC | ESP_BLE_ADV_FLAG_BREDR_NOT_SPT), // 普通发现模式|不支持EDR经典蓝牙
};
// 扫描回复数据，用于主机在主动扫描时，向设备发起扫描请求，设备需要回复的内容
static esp_ble_adv_data_t scan_rsp_data = {
    .set_scan_rsp = true,
    .include_name = true,
    .include_txpower = true,
    //.min_interval = 0x0006,
    //.max_interval = 0x0010,
    .appearance = 0x00,
    .manufacturer_len = 0,       // TEST_MANUFACTURER_DATA_LEN,
    .p_manufacturer_data = NULL, //&test_manufacturer[0],
    .service_data_len = 0,
    .p_service_data = NULL,
    .service_uuid_len = sizeof(adv_service_uuid16),
    .p_service_uuid = adv_service_uuid16,
    .flag = (ESP_BLE_ADV_FLAG_GEN_DISC | ESP_BLE_ADV_FLAG_BREDR_NOT_SPT),
};

// gatt事件回调函数
static void gatts_profile_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, esp_ble_gatts_cb_param_t *param)
{
    switch (event)
    {
    case ESP_GATTS_REG_EVT: // 可以认为是一个Profile GATTS启动时会进入此事件
    {
        // 设置广播名称
        esp_err_t set_dev_name_ret = esp_ble_gap_set_device_name(BLE_DEVICE_NAME);
        if (set_dev_name_ret)
        {
            ESP_LOGE(TAG, "set device name failed, error code = %x", set_dev_name_ret);
        }
        // 设置广播数据
        esp_err_t ret = esp_ble_gap_config_adv_data(&adv_data);
        if (ret)
        {
            ESP_LOGE(TAG, "config adv data failed, error code = %x", ret);
        }
        adv_config_done |= ADV_CONFIG_FLAG;
        // 设置扫描回复参数
        ret = esp_ble_gap_config_adv_data(&scan_rsp_data);
        if (ret)
        {
            ESP_LOGE(TAG, "config scan response data failed, error code = %x", ret);
        }
        adv_config_done |= SCAN_RSP_CONFIG_FLAG;
        // 注册attr表1
        esp_err_t create_attr_ret = esp_ble_gatts_create_attr_tab(gatt1_db, gatts_if, SV1_IDX_NB, SVC_IND_ID1);
        if (create_attr_ret)
        {
            ESP_LOGE(TAG, "create attr1 table failed, error code = %x", create_attr_ret);
        }

        if (param->reg.status == ESP_GATT_OK)
        {
            gl_gatts_if = gatts_if;
            // gl_conn_id = param->connect.conn_id;
        }
    }
    break;
    case ESP_GATTS_READ_EVT: // 收到客户端的读取事件
    {
        ESP_LOGI(TAG, "ESP_GATTS_READ_EVT");
        esp_gatt_rsp_t rsp;
        memset(&rsp, 0, sizeof(esp_gatt_rsp_t));
        rsp.attr_value.handle = param->read.handle;
        if (sv1_handle_table[SV1_CH1_IDX_CHAR_VAL] == param->read.handle) // 读取特征值1
        {
            rsp.attr_value.len = sizeof(sv1_char1_value);
            memcpy(rsp.attr_value.value, sv1_char1_value, sizeof(sv1_char1_value));
        }
        if (sv1_handle_table[SV1_CH2_IDX_CHAR_VAL] == param->read.handle) // 读取特征值2
        {
            rsp.attr_value.len = sizeof(sv1_char2_value);
            memcpy(rsp.attr_value.value, sv1_char2_value, sizeof(sv1_char2_value));
        }
        esp_ble_gatts_send_response(gatts_if, param->read.conn_id, param->read.trans_id, ESP_GATT_OK, &rsp);
        break;
    }
    case ESP_GATTS_WRITE_EVT: // 收到客户端的写事件
        if (!param->write.is_prep)
        {
            // the data length of gattc write  must be less than GATTS_DEMO_CHAR_VAL_LEN_MAX.
            ESP_LOGI(TAG, "GATT_WRITE_EVT, handle = %d, value len = %d, value :", param->write.handle, param->write.len);
            esp_log_buffer_hex(TAG, param->write.value, param->write.len);

            if (param->write.handle == sv1_handle_table[SV1_CH1_IDX_CHAR_CFG]) // 特征1客户端特征配置
            {
                sv1_ch1_client_cfg[0] = param->write.value[0];
                sv1_ch1_client_cfg[1] = param->write.value[1];
            }
            else if (param->write.handle == sv1_handle_table[SV1_CH2_IDX_CHAR_CFG]) // 特征2客户端特征配置
            {
                sv1_ch2_client_cfg[0] = param->write.value[0];
                sv1_ch2_client_cfg[1] = param->write.value[1];
            }
            else if (param->write.handle == sv1_handle_table[SV1_CH1_IDX_CHAR_VAL]) // 特征1的值
            {
                ESP_LOGI(TAG, "接收到特征1的数据，长度 = %d", param->write.len);

                // 将接收到的数据存储到 sv1_char1_value 中
                memset(sv1_char1_value, 0, sizeof(sv1_char1_value)); // 清空存储缓冲区
                memcpy(sv1_char1_value, param->write.value, param->write.len > sizeof(sv1_char1_value) ? sizeof(sv1_char1_value) : param->write.len);

                // 提取 cmd_id（假设 cmd_id 存储在字节 4 和字节 5 中）
                uint16_t cmd_id = sv1_char1_value[4] | (sv1_char1_value[5] << 8);

                // 调用 send_status_packet 直接转发
                send_status_packet(cmd_id);

                ESP_LOGI(TAG, "转发数据包，cmd_id=0x%04X", cmd_id);
            }
            else if (param->write.handle == sv1_handle_table[SV1_CH2_IDX_CHAR_VAL]) // 特征2的值
            {
                ESP_LOGI(TAG, "接收到特征2的数据，长度 = %d", param->write.len);

                // 将接收到的数据转换为字符串
                char receivedStr[128] = {0}; // 假设最大字符串长度为 128
                memcpy(receivedStr, param->write.value, param->write.len);
                receivedStr[param->write.len] = '\0'; // 确保字符串以 '\0' 结尾
                ESP_LOGI(TAG, "接收到的字符串: %s", receivedStr);
                sv1_char2_value[0] = param->write.value[0];
                sv1_char2_value[1] = param->write.value[1]; // 这里取决于发来的数据包格式大小，有八个就存储到param->write.value[7]
            }
            if (param->write.need_rsp)
            {
                esp_ble_gatts_send_response(gatts_if, param->write.conn_id, param->write.trans_id, ESP_GATT_OK, NULL);
            }
        }
        break;
    case ESP_GATTS_EXEC_WRITE_EVT:
        // the length of gattc prepare write data must be less than GATTS_DEMO_CHAR_VAL_LEN_MAX.
        ESP_LOGI(TAG, "ESP_GATTS_EXEC_WRITE_EVT");
        // example_exec_write_event_env(&prepare_write_env, param);
        break;
    case ESP_GATTS_MTU_EVT:
        ESP_LOGI(TAG, "ESP_GATTS_MTU_EVT, MTU %d", param->mtu.mtu);
        break;
    case ESP_GATTS_CONF_EVT:
        ESP_LOGI(TAG, "ESP_GATTS_CONF_EVT, status = %d, attr_handle %d", param->conf.status, param->conf.handle);
        break;
    case ESP_GATTS_START_EVT:
        ESP_LOGI(TAG, "SERVICE_START_EVT, status %d, service_handle %d", param->start.status, param->start.service_handle);
        break;
    case ESP_GATTS_CONNECT_EVT: // 收到连接事件
        ESP_LOGI(TAG, "ESP_GATTS_CONNECT_EVT, conn_id = %d", param->connect.conn_id);
        esp_log_buffer_hex(TAG, param->connect.remote_bda, 6);
        esp_ble_conn_update_params_t conn_params = {0};
        memcpy(conn_params.bda, param->connect.remote_bda, sizeof(esp_bd_addr_t));
        /* For the iOS system, please refer to Apple official documents about the BLE connection parameters restrictions. */
        conn_params.latency = 0;    // 从机延迟
        conn_params.max_int = 0x20; // 最大连接间隔 = 0x20*1.25ms = 40ms
        conn_params.min_int = 0x10; // 最小连接间隔 = 0x10*1.25ms = 20ms
        conn_params.timeout = 400;  // 监控超时 = 400*10ms = 4000ms

        esp_ble_gap_update_conn_params(&conn_params);
        gl_conn_id = param->connect.conn_id;

        send_status_packet(0xFFFF); // 获取一次最新状态，此时出现差量，就会进行一次上传
        break;
    case ESP_GATTS_DISCONNECT_EVT: // 收到断开连接事件
        ESP_LOGI(TAG, "ESP_GATTS_DISCONNECT_EVT, reason = 0x%x", param->disconnect.reason);
        esp_ble_gap_start_advertising(&adv_params);
        gl_conn_id = 0xFFFF;
        break;
    case ESP_GATTS_CREAT_ATTR_TAB_EVT: // 注册ATTR表成功事件
        if (param->add_attr_tab.status != ESP_GATT_OK)
        {
            ESP_LOGE(TAG, "create attribute table failed, svc id = %d,error code=0x%x", param->add_attr_tab.svc_inst_id, param->add_attr_tab.status);
        }
        if (param->add_attr_tab.svc_inst_id == SVC_IND_ID1)
        {

            if (param->add_attr_tab.num_handle != SV1_IDX_NB)
            {
                ESP_LOGE(TAG, "create attribute table abnormally, num_handle (%d) \
                            doesn't equal to NETCFG_IDX_NB(%d)",
                         param->add_attr_tab.num_handle, SV1_IDX_NB);
            }
            else
            {
                ESP_LOGI(TAG, "create attribute table successfully, the number handle = %d\n", param->add_attr_tab.num_handle);
                memcpy(sv1_handle_table, param->add_attr_tab.handles, sizeof(sv1_handle_table));
                esp_ble_gatts_start_service(sv1_handle_table[SV1_IDX_SVC]);
            }
        }

        break;
    case ESP_GATTS_STOP_EVT:
    case ESP_GATTS_OPEN_EVT:
    case ESP_GATTS_CANCEL_OPEN_EVT:
    case ESP_GATTS_CLOSE_EVT:
    case ESP_GATTS_LISTEN_EVT:
    case ESP_GATTS_CONGEST_EVT:
    case ESP_GATTS_UNREG_EVT:
    case ESP_GATTS_DELETE_EVT:
    default:
        break;
    }
}

// gap事件回调函数
static void gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param)
{
    switch (event)
    {
    case ESP_GAP_BLE_ADV_DATA_SET_COMPLETE_EVT: // 设置广播数据成功事件
        adv_config_done &= (~ADV_CONFIG_FLAG);
        if (adv_config_done == 0)
        {
            esp_ble_gap_start_advertising(&adv_params);
        }
        break;
    case ESP_GAP_BLE_SCAN_RSP_DATA_SET_COMPLETE_EVT: // 设置扫描回复数据成功事件
        adv_config_done &= (~SCAN_RSP_CONFIG_FLAG);
        if (adv_config_done == 0)
        {
            esp_ble_gap_start_advertising(&adv_params);
        }
        break;
    case ESP_GAP_BLE_ADV_START_COMPLETE_EVT: // 启动广播成功事件
        /* advertising start complete event to indicate advertising start successfully or failed */
        if (param->adv_start_cmpl.status != ESP_BT_STATUS_SUCCESS)
        {
            ESP_LOGE(TAG, "advertising start failed");
        }
        else
        {
            ESP_LOGI(TAG, "advertising start successfully");
        }
        break;
    case ESP_GAP_BLE_ADV_STOP_COMPLETE_EVT: // 停止广播成功事件
        if (param->adv_stop_cmpl.status != ESP_BT_STATUS_SUCCESS)
        {
            ESP_LOGE(TAG, "Advertising stop failed");
        }
        else
        {
            ESP_LOGI(TAG, "Stop adv successfully\n");
        }
        break;
    case ESP_GAP_BLE_UPDATE_CONN_PARAMS_EVT: // 更新连接参数成功事件
        // ble_set_ch2_value(buffer, FRAME_LEN); // 特征值2用于发送给小程序端
        ESP_LOGI(TAG, "update connection params status = %d, min_int = %d, max_int = %d,conn_int = %d,latency = %d, timeout = %d",
                 param->update_conn_params.status,
                 param->update_conn_params.min_int,
                 param->update_conn_params.max_int,
                 param->update_conn_params.conn_int,
                 param->update_conn_params.latency,
                 param->update_conn_params.timeout);
        break;
    default:
        break;
    }
}

// 初始化
void ble_start(void)
{
    // ESP_ERROR_CHECK(nvs_flash_init()); //main中初始化
    ESP_ERROR_CHECK(esp_bt_controller_mem_release(ESP_BT_MODE_CLASSIC_BT));

    esp_bt_controller_config_t bt_cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_bt_controller_init(&bt_cfg));
    ESP_ERROR_CHECK(esp_bt_controller_enable(ESP_BT_MODE_BLE));
    esp_bluedroid_config_t bluedroid_cfg = BT_BLUEDROID_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_bluedroid_init_with_cfg(&bluedroid_cfg));
    ESP_ERROR_CHECK(esp_bluedroid_enable());
    ESP_ERROR_CHECK(esp_ble_gatts_register_callback(gatts_profile_event_handler));
    ESP_ERROR_CHECK(esp_ble_gap_register_callback(gap_event_handler));
    ESP_ERROR_CHECK(esp_ble_gatts_app_register(ESP_APP_ID)); // 一个APP对应一份Profile
    ESP_ERROR_CHECK(esp_ble_gatt_set_local_mtu(500));
}

void ble_set_ch1_value(uint8_t *data, size_t length)
{
    if (length > sizeof(sv1_char1_value))
    {
        ESP_LOGE(TAG, "数据包长度超过特征1的最大长度");
        return;
    }

    // 将数据包复制到特征值存储
    memcpy(sv1_char1_value, data, length);

    // 判断连接是否有效，以及客户端特征配置是否不为0
    if (gl_conn_id != 0xFFFF && (sv1_ch1_client_cfg[0] | sv1_ch1_client_cfg[1]))
    {
        // 设置特征值
        esp_ble_gatts_set_attr_value(sv1_handle_table[SV1_CH1_IDX_CHAR_VAL], length, sv1_char1_value);

        // 发送通知
        esp_ble_gatts_send_indicate(gl_gatts_if, gl_conn_id, sv1_handle_table[SV1_CH1_IDX_CHAR_VAL], length, sv1_char1_value, false);
        ESP_LOGI(TAG, "通知特征1: 数据长度 = %d, 数据内容:", length);
        esp_log_buffer_hex(TAG, sv1_char1_value, length);
    }
}

void ble_set_ch2_value(uint8_t *data, size_t length)
{
    if (length > sizeof(sv1_char2_value))
    {
        ESP_LOGE(TAG, "数据包长度超过特征2的最大长度");
        return;
    }

    // 将数据包复制到特征值存储
    memcpy(sv1_char2_value, data, length);

    // 判断连接是否有效，以及客户端特征配置是否不为0
    if (gl_conn_id != 0xFFFF && (sv1_ch2_client_cfg[0] | sv1_ch2_client_cfg[1]))
    {
        // 设置特征值
        esp_ble_gatts_set_attr_value(sv1_handle_table[SV1_CH2_IDX_CHAR_VAL], length, sv1_char2_value);
        log_memory_usage("BLE_FLASH");
        // 发送通知
        esp_ble_gatts_send_indicate(gl_gatts_if, gl_conn_id, sv1_handle_table[SV1_CH2_IDX_CHAR_VAL], length, sv1_char2_value, false);
        ESP_LOGI(TAG, "通知特征1: 数据长度 = %d, 数据内容:", length);
        esp_log_buffer_hex(TAG, sv1_char2_value, length);
    }
}