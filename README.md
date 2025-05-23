# esp32c2端对接文档

#### 各模块说明
- WIFI： 首先进行wifi连接，暂时使用本地wifi测试（小程序配网后续完善），
    ```c
    #define WIFI_SSID "odddouglas"     // Wi-Fi SSID
    #define WIFI_PASSWORD "odddouglas" // Wi-Fi 密码
    ```
	
- MQTT：IOT端的属性列表，命令列表
    ```c
    #define MQTT_ADDRESS "mqtt://e5e7404266.st1.iotda-device.cn-north-4.myhuaweicloud.com:1883"
    #define MQTT_CLIENFID "67fe4c765367f573f7830638_esp32_0_0_2025051303"
    #define MQTT_USERNAME "67fe4c765367f573f7830638_esp32"
    #define MQTT_PASSWORD "beb57fa257b6fc3dc92d71a515d059d0788640a6f17b82c78860c18c5fde50ff"
    #define DEVICE_ID "67fe4c765367f573f7830638_esp32"
    #define SERVER_ID "gateway_data"
    #define MQTT_TOPIC_REPORT "$oc/devices/" DEVICE_ID "/sys/properties/report"
    #define MQTT_TOPIC_COMMAND "$oc/devices/" DEVICE_ID "/sys/commands/#"
    #define MQTT_TOPIC_COMMAND_RESPOND "$oc/devices/" DEVICE_ID "/sys/commands/response/request_id="
    ```
	
	![](manual/img/iot1.jpg)
	![](manual/img/iot2.jpg)
	![](manual/img/iot3.jpg)
	
    ```bash
    //数据格式参考
    pcLight:{"pcLightBreathing":false,"pcLightFleeting":false,"pcLightColor":"white"}
    pcFan:{"pcFanVolume":"high","pcFanIn":true,"pcFanOut":true}
    pcBaseData:{"temperature":0,"humidity":0}
    pcStatus:1
    ```

- BLE：广播之后，等待连接（不影响MQTT线程），连接之后，此时语音芯片一旦作答，在MQTT上报的同时，也会向小程序发送类似`0xA5 0xFA 0x00 0x81 0xC5 0x07 0xEC 0xFB`的数据包。

    ```c
    // 数据格式
    static uint8_t sv1_char1_value[8] = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
    static uint8_t sv1_char2_value[8] = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
    
    // 发送通知部分
    esp_ble_gatts_set_attr_value(sv1_handle_table[SV1_CH1_IDX_CHAR_VAL], length, sv1_char1_value);
    
    esp_ble_gatts_send_indicate(gl_gatts_if, gl_conn_id, sv1_handle_table[SV1_CH1_IDX_CHAR_VAL], length, sv1_char1_value, false);
    ESP_LOGI(TAG, "通知特征1: 数据长度 = %d, 数据内容:", length);
    esp_log_buffer_hex(TAG, sv1_char1_value, length);
    ```
    
- MINIPROGRAM：示例解析
    ```ts
    // 将 ArrayBuffer 转换为十六进制字符串
    function ab2hex(buffer) {
        const hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        bit => ('00' + bit.toString(16)).slice(-2)
        );
        return hexArr.join(' ');
    }   
    // 接收蓝牙特征值变化事件
    wx.onBLECharacteristicValueChange(characteristic => {
        console.log("收到原始的数据", characteristic, characteristic.value);
        const receivedData = ab2hex(characteristic.value); // 转换为字符串
        console.log("接收到的数据", receivedData);
        parseReceivedData(page, receivedData);
    });
    ```
    
- UART：`TX(IO1)`，`RX(IO3)`，这是负责收发语音芯片数据的串口NUM1，另一个串口负责打印信息，esp32c2的系列的默认串口0有所区别。已完成收发，对语音芯片的数据进行解析并上传，同时接收云端命令下发并解析发给语音芯片完成控制
  ```c
    #define UART_PORT_NUM UART_NUM_1
    #define UART_BAUD_RATE 9600
    #define UART_TX_PIN 1
    #define UART_RX_PIN 3
    #define BUF_SIZE 1024
    #define FRAME_LEN 8
    #define MAX_FRAME_ERRORS 5
  
  ```

- HW_TIMER：进行简单的定时全属性上报（统一），目前mqtt的上报是使用差量上传（语音芯片响应之后，将发生变化的属性进行上报），目前设置的是120s上传一次，避免影子数据遗留问题。

  ```c
      #define TIMER_GROUP TIMER_GROUP_0
      #define TIMER_IDX TIMER_0
      #define TIMER_INTERVAL_SEC 120 // 120 秒周期
  ```

  

#### esp-idf框架

```bash
esp32c2/
├── .devcontainer/
├── .gitignore
├── .vscode/
├── CMakeLists.txt
├── README.md
├── sdkconfig
├── sdkconfig.old
├── build/
│   ├── main.bin    # 编译生成的二进制文件，可使用 flash 工具烧录
├── partitions.csv  # 自定义flash分区表，目前设置仅支持两个栈大小为2048的任务执行
├── main/
│   ├── main.c
|   ├── main.h     # 主模块的头文件（如全局变量声明等）
│   └── CMakeLists.txt
├── components/    # 自定义组件（Component）目录，自行添加需要补充main/Cmake链接
│   ├── bsp_ble/  # BLE 功能模块
│   │   ├── bsp_ble.c
│   │   ├── CMakeLists.txt
│   │   └── include/
│   │       └── bsp_ble.h  # BLE 公共头文件（供外部引用，一般在这些组件里修改一些全局变量）
│   ├── bsp_hw_timer/ # 硬件定时器模块
│   │   ├── bsp_hw_timer.c
│   │   ├── CMakeLists.txt
│   │   └── include/
│   │       └── bsp_hw_timer.h
│   ├── bsp_mqtt/ # MQTT 通信模块 
│   │   ├── bsp_mqtt.c
│   │   ├── CMakeLists.txt
│   │   └── include/
│   │       └── bsp_mqtt.h
│   ├── bsp_uart/ # UART 串口通信模块 IO3
│   │   ├── bsp_uart.c
│   │   ├── CMakeLists.txt
│   │   └── include/
│   │       └── bsp_uart.h
│   └── bsp_wifi/  # Wi-Fi 连接模块
│       ├── bsp_wifi.c
│       ├── CMakeLists.txt
│       └── include/
│           └── bsp_wifi.h
```

#### arduino框架（弃用，ble_mesh编译链缺失，官方暂时未支持该框架下的ble开发）

```bash
esp32c2/
├── build/
│   └── esp32.esp32.esp32c2/        # 编译生成的二进制文件目录，可使用 flash 工具烧录
│       ├── esp32c2.ino.bin              # 程序主固件二进制文件
│       ├── esp32c2.ino.bootloader.bin   # 启动加载程序二进制文件
│       ├── esp32c2.ino.elf               # 可执行文件，包含调试信息
│       ├── esp32c2.ino.map               # 内存映射文件，调试用
│       ├── esp32c2.ino.merged.bin        # 合并后的完整固件二进制文件
│       └── esp32c2.ino.partitions.bin    # flash 分区表二进制文件
├── esp32c2.ino                      # Arduino 主程序入口文件
├── libraries/                     
│   ├── Adafruit_Unified_Sensor/     # 传感器统一库
│   ├── ArduinoJson/                  # JSON 解析库
│   ├── NimBLE-Arduino/               # 轻量级 BLE 库
│   ├── PubSubClient/                 # MQTT 客户端库
│   └── WiFiManager/                  # WiFi 管理库，自动连接配置
```



#### 对接协议

![协议对接](manual/img/img1.png)

![协议对接](manual/img/img2.jpg)
