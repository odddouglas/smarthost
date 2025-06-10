// utils/mqtt.js
const Paho = require('paho-mqtt');

const mqttConfig = {
    brokerUrl: "mqtt://e5e7404266.st1.iotda-device.cn-north-4.myhuaweicloud.com:1883",
    clientId: "67fe4c765367f573f7830638_esp32_0_0_2025051303",
    username: "67fe4c765367f573f7830638_esp32",
    password: "beb57fa257b6fc3dc92d71a515d059d0788640a6f17b82c78860c18c5fde50ff",
    deviceId: "67fe4c765367f573f7830638_esp32",
    serverId: "gateway_data",
};

const client = new Paho.Client(mqttConfig.brokerUrl, mqttConfig.clientId);

client.connect({
    onSuccess: () => {
        console.log('MQTT 连接成功');
        client.subscribe(`${MQTT_TOPIC_COMMAND}#`, { qos: 1 });
    },
    onFailure: (error) => {
        console.error('MQTT 连接失败', error);
    },
    userName: mqttConfig.username,
    password: mqttConfig.password,
});

export default client;