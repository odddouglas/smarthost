const bluetooth = require('../../module/bluetooth.js'); // Import the new Bluetooth module

Page({

    data: {
        // 蓝牙连接部分
        devices: [], // 存储找到的蓝牙设备
        chs: [], // 存储蓝牙特征
        isConnected: false, // 蓝牙连接状态
        isFound: false, // 设备搜索状态
    },
    // 蓝牙模块函数调用 
    openBluetoothAdapter() {
        bluetooth.openBluetoothAdapter(this);
    },
    createBLEConnection(e) {
        bluetooth.createBLEConnection(this, e);
    },
    closeBLEConnection() {
        bluetooth.closeBLEConnection(this);
    },

    sendBLEData() {
        const dataToSend = "LED_ON"; // 示例数据
        bluetooth.writeBLECharacteristicValue(this, dataToSend);
    },
    onLoad() {

    },

    onReady() {

    },

})