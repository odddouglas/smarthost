/**
 * 获取手机蓝牙是否打开
 */
const getBluetoothState = () => {
	// 主机模式
	return new Promise((resolve, reject) => {
		uni.openBluetoothAdapter({
			success: (r) => {
				console.log("蓝牙初始化成功");
				// 获取蓝牙的匹配状态
				uni.getBluetoothAdapterState({
					success: function(row) {
						console.log('蓝牙状态：', row.available);
						if (row.available) {
							resolve();
						} else {
							// 请开启蓝牙
							uni.showToast({
								title: '请打开蓝牙3',
								icon: 'none'
							}) 
							reject();
						}
					},
					fail: function(err) {
						// 请开启蓝牙
						uni.showToast({
							title: '请打开蓝牙2',
							icon: 'none'
						})
						reject();
					}
				})
			},
			fail: () => {
				// 请开启蓝牙
				uni.showToast({
					title: '请打开蓝牙1',
					icon: 'none'
				})
				reject();
			}
		});
	});
};
/**
 * 开始搜索蓝牙设备
 */
const startDiscoveryBluetooth = (servicesFilter, wait = 0) => {
	return new Promise((resolve) => {
		uni.startBluetoothDevicesDiscovery({
			services: servicesFilter,
			success(res) {
				console.log('启动搜索蓝牙外围设备', res.errMsg)
				if(wait > 0){
					setTimeout(() => {
						resolve();
					}, wait);
				}else{
					resolve();
				}
			}
		});
	})
};
// 监听蓝牙搜索事件
const onBluetoothDeviceFound = (callBack) => {
	console.log("监听蓝牙设备搜索")
	uni.onBluetoothDeviceFound((res) => {
		callBack(res.devices);
	});
}
// 关闭蓝牙搜索
const stopDiscoveryBluetooth = () => {
	uni.stopBluetoothDevicesDiscovery({
		success(r) {
			console.log("停止搜索蓝牙设备", r);
		}
	});
};
/**
 * 获取搜索到的设备信息
 */
const getBluetoothDevices = (deviceName) => {
	return new Promise((resolve, reject) => {
		uni.getBluetoothDevices({
			success(res) {
				console.log('获取搜索到的设备信息', res.devices);
 
				// 过滤掉name为空或者未知设备的设备
				let devices = res.devices.filter(function(obj) {
					return obj.name !== "" && obj.name !== "未知设备"
				});
				// console.log('有名称蓝牙列表', devices, deviceName);
				resolve(devices)
				// devices && devices.forEach(item => {
				// 	if (item.name && item.name === deviceName) {
				// 		resolve();
				// 		console.log('设备ID', deviceId, item);
				// 	}
				// });
			},
			fail: function() {
				console.log('搜索蓝牙设备失败');
				reject();
			},
			complete: function() {
				console.log("蓝牙搜索完成");
			}
		});
	});
}
/**
 * 连接蓝牙
 * deviceId 蓝牙设备id
 */
const connectBluetooth = (deviceId) => {
	return new Promise((resolve, reject) => {
		uni.createBLEConnection({
			deviceId: deviceId, // 设备id
			success() {
				console.log('连接蓝牙成功', deviceId);
				// 蓝牙连接成功后关闭蓝牙搜索
				stopDiscoveryBluetooth();
				resolve(deviceId);
			},
			fail() {
				console.log("蓝牙连接失败");
				reject();
			}
		});
	});
};
// 获取服务id
const getServiceId = (deviceId) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			uni.getBLEDeviceServices({
				deviceId: deviceId,
				success(res) {
					console.log("获取服务Id", deviceId, res)
					if(res.services.length == 0){
						console.log("获取服务Id为空");
						reject();
					}else{
						let serviceId = res.services[0].uuid;
						console.log(serviceId)
						resolve(serviceId);
					}
				},
				fail() {
					console.log("获取服务Id失败");
					reject();
				}
			})
		
		}, 1000);
	});
};
// 获取蓝牙低功耗设备某个服务中所有特征
const getCharacteId = (deviceId, serviceId) => {
	return new Promise((resolve, reject) => {
		uni.getBLEDeviceCharacteristics({
			deviceId: deviceId, // 蓝牙设备id
			serviceId: serviceId, // 蓝牙服务UUID
			success(res) {
				console.log('数据监听', res);
				resolve(res.characteristics)
			},
			fail(err) {
				console.log("数据监听失败", err)
			}
		})
	});
};
// 启用低功耗蓝牙设备特征值变化时的notify功能
const startNotice = (deviceId, serviceId, characteristicId, onCallBack) => {
	return new Promise((resolve, reject) => {
		uni.notifyBLECharacteristicValueChange({
			deviceId: deviceId,
			serviceId: serviceId,
			characteristicId: characteristicId,
			state: true,
			success(res) {
				console.log("启用监听");
				let timer = setTimeout(()=>{
					console.log('蓝牙建立连接，启用通知')
					
					// 监听低功耗蓝牙设备的特征值变化
					uni.onBLECharacteristicValueChange(result => {
						console.log("特征值变化了",result);
						onCallBack(result);
					})
					clearTimeout(timer)
				},600)
				
			}
		});
	});
};
// 蓝牙发送数据
const writeData = (deviceId, serviceId, characteristicId, buffer) => {
	return new Promise((resolve, reject) => {
		uni.writeBLECharacteristicValue({
			deviceId: deviceId,
			serviceId: serviceId,
			characteristicId: characteristicId,
			value: hex2ab(buffer),
			success(res) {
				console.log("writeBLECharacteristicValue success", res);
				resolve();
			},
			fail(err) {
				console.log("报错了", err);
				reject();
			}
		});
	});
};
const disconnectBluetooth = (deviceId) => {
	return new Promise((resolve, reject) => {
		uni.closeBLEConnection({
			deviceId: deviceId, // 设备id
			success(res) {
				console.log(res, '断开成功')
				resolve();
			},
			fail(err) {
				console.log("断开失败", err);
				reject();
			}
		});
	});
};

// ArrayBuffer转16进制字符串
function ab2hex(buffer) {
	const hexArr = Array.prototype.map.call(  
		new Uint8Array(buffer),  
		function(bit) {  
			return ('00' + bit.toString(16)).slice(-2)  
		}  
	)  
	return hexArr.join('')  
}

//16进制字符串转字符串
function hex2str(hexCharCodeStr) {
	var trimedStr = hexCharCodeStr.trim();
	var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
	var len = rawStr.length;
	if (len % 2 !== 0) {
		console.log("存在非法字符!");
		return "";
	}
	var curCharCode;
	var resultStr = [];
	for (var i = 0; i < len; i = i + 2) {
		curCharCode = parseInt(rawStr.substr(i, 2), 16);
		resultStr.push(String.fromCharCode(curCharCode));
	}
	return resultStr.join("");
} 

function ab2str(buffer){
	var value = ab2hex(buffer);
	var restr = hex2str(value);
	console.log("ab2str: ", restr)
	return restr
}

function str2hex(str) {  
  let hexChars = '';  
  for (let i = 0; i < str.length; i++) {  
    let code = str.charCodeAt(i).toString(16).padStart(2, '0'); // 转换为16进制并填充前导零  
    hexChars += code;  
  }  
  return hexChars;  
}

function hex2ab(hexStr) {  
  hexStr = hexStr.replace(/\s/g, ''); // 去除空格  
  if (hexStr.substr(0, 2).toLowerCase() === "0x") {  
    hexStr = hexStr.substr(2); // 去除可能的"0x"前缀  
  }  
  if (hexStr.length % 2 !== 0) {  
    throw new Error('Invalid hex string');  
  }  
  let buffer = new ArrayBuffer(hexStr.length / 2);  
  let view = new Uint8Array(buffer);  
  for (let i = 0; i < hexStr.length; i += 2) {  
    view[i / 2] = parseInt(hexStr.substr(i, 2), 16);  
  }  
  return buffer;  
}
function str2ab(str){
	var hex = str2hex(str);
	var ab = hex2ab(hex);
	return ab;
}
// closeBLEConnection  deviceId  断开蓝牙
export default {
	getBluetoothState,
	startDiscoveryBluetooth,
	onBluetoothDeviceFound,
	stopDiscoveryBluetooth,
	getBluetoothDevices,
	connectBluetooth,
	getServiceId,
	getCharacteId,
	startNotice,
	writeData,
	disconnectBluetooth,
	ab2hex,
	hex2str,
	ab2str,
	str2hex,
	hex2ab,
	str2ab
};

