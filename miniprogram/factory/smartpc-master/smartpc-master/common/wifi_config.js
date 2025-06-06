/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root ={};

$root.CmdGetStatus = (function() {

    /**
     * Properties of a CmdGetStatus.
     * @exports ICmdGetStatus
     * @interface ICmdGetStatus
     */

    /**
     * Constructs a new CmdGetStatus.
     * @exports CmdGetStatus
     * @classdesc Represents a CmdGetStatus.
     * @implements ICmdGetStatus
     * @constructor
     * @param {ICmdGetStatus=} [properties] Properties to set
     */
    function CmdGetStatus(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new CmdGetStatus instance using the specified properties.
     * @function create
     * @memberof CmdGetStatus
     * @static
     * @param {ICmdGetStatus=} [properties] Properties to set
     * @returns {CmdGetStatus} CmdGetStatus instance
     */
    CmdGetStatus.create = function create(properties) {
        return new CmdGetStatus(properties);
    };

    /**
     * Encodes the specified CmdGetStatus message. Does not implicitly {@link CmdGetStatus.verify|verify} messages.
     * @function encode
     * @memberof CmdGetStatus
     * @static
     * @param {ICmdGetStatus} message CmdGetStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdGetStatus.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        return writer;
    };

    /**
     * Encodes the specified CmdGetStatus message, length delimited. Does not implicitly {@link CmdGetStatus.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CmdGetStatus
     * @static
     * @param {ICmdGetStatus} message CmdGetStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdGetStatus.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CmdGetStatus message from the specified reader or buffer.
     * @function decode
     * @memberof CmdGetStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CmdGetStatus} CmdGetStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdGetStatus.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CmdGetStatus();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CmdGetStatus message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CmdGetStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CmdGetStatus} CmdGetStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdGetStatus.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CmdGetStatus message.
     * @function verify
     * @memberof CmdGetStatus
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CmdGetStatus.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        return null;
    };

    /**
     * Creates a CmdGetStatus message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CmdGetStatus
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CmdGetStatus} CmdGetStatus
     */
    CmdGetStatus.fromObject = function fromObject(object) {
        if (object instanceof $root.CmdGetStatus)
            return object;
        return new $root.CmdGetStatus();
    };

    /**
     * Creates a plain object from a CmdGetStatus message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CmdGetStatus
     * @static
     * @param {CmdGetStatus} message CmdGetStatus
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CmdGetStatus.toObject = function toObject() {
        return {};
    };

    /**
     * Converts this CmdGetStatus to JSON.
     * @function toJSON
     * @memberof CmdGetStatus
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CmdGetStatus.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CmdGetStatus
     * @function getTypeUrl
     * @memberof CmdGetStatus
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CmdGetStatus.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CmdGetStatus";
    };

    return CmdGetStatus;
})();

$root.RespGetStatus = (function() {

    /**
     * Properties of a RespGetStatus.
     * @exports IRespGetStatus
     * @interface IRespGetStatus
     * @property {Status|null} [status] RespGetStatus status
     * @property {WifiStationState|null} [staState] RespGetStatus staState
     * @property {WifiConnectFailedReason|null} [failReason] RespGetStatus failReason
     * @property {IWifiConnectedState|null} [connected] RespGetStatus connected
     */

    /**
     * Constructs a new RespGetStatus.
     * @exports RespGetStatus
     * @classdesc Represents a RespGetStatus.
     * @implements IRespGetStatus
     * @constructor
     * @param {IRespGetStatus=} [properties] Properties to set
     */
    function RespGetStatus(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RespGetStatus status.
     * @member {Status} status
     * @memberof RespGetStatus
     * @instance
     */
    RespGetStatus.prototype.status = 0;

    /**
     * RespGetStatus staState.
     * @member {WifiStationState} staState
     * @memberof RespGetStatus
     * @instance
     */
    RespGetStatus.prototype.staState = 0;

    /**
     * RespGetStatus failReason.
     * @member {WifiConnectFailedReason|null|undefined} failReason
     * @memberof RespGetStatus
     * @instance
     */
    RespGetStatus.prototype.failReason = null;

    /**
     * RespGetStatus connected.
     * @member {IWifiConnectedState|null|undefined} connected
     * @memberof RespGetStatus
     * @instance
     */
    RespGetStatus.prototype.connected = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * RespGetStatus state.
     * @member {"failReason"|"connected"|undefined} state
     * @memberof RespGetStatus
     * @instance
     */
    Object.defineProperty(RespGetStatus.prototype, "state", {
        get: $util.oneOfGetter($oneOfFields = ["failReason", "connected"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new RespGetStatus instance using the specified properties.
     * @function create
     * @memberof RespGetStatus
     * @static
     * @param {IRespGetStatus=} [properties] Properties to set
     * @returns {RespGetStatus} RespGetStatus instance
     */
    RespGetStatus.create = function create(properties) {
        return new RespGetStatus(properties);
    };

    /**
     * Encodes the specified RespGetStatus message. Does not implicitly {@link RespGetStatus.verify|verify} messages.
     * @function encode
     * @memberof RespGetStatus
     * @static
     * @param {IRespGetStatus} message RespGetStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RespGetStatus.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.status != null && Object.hasOwnProperty.call(message, "status"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
        if (message.staState != null && Object.hasOwnProperty.call(message, "staState"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.staState);
        if (message.failReason != null && Object.hasOwnProperty.call(message, "failReason"))
            writer.uint32(/* id 10, wireType 0 =*/80).int32(message.failReason);
        if (message.connected != null && Object.hasOwnProperty.call(message, "connected"))
            $root.WifiConnectedState.encode(message.connected, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified RespGetStatus message, length delimited. Does not implicitly {@link RespGetStatus.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RespGetStatus
     * @static
     * @param {IRespGetStatus} message RespGetStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RespGetStatus.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RespGetStatus message from the specified reader or buffer.
     * @function decode
     * @memberof RespGetStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RespGetStatus} RespGetStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RespGetStatus.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RespGetStatus();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.status = reader.int32();
                    break;
                }
            case 2: {
                    message.staState = reader.int32();
                    break;
                }
            case 10: {
                    message.failReason = reader.int32();
                    break;
                }
            case 11: {
                    message.connected = $root.WifiConnectedState.decode(reader, reader.uint32());
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a RespGetStatus message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RespGetStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RespGetStatus} RespGetStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RespGetStatus.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RespGetStatus message.
     * @function verify
     * @memberof RespGetStatus
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RespGetStatus.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.status != null && message.hasOwnProperty("status"))
            switch (message.status) {
            default:
                return "status: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                break;
            }
        if (message.staState != null && message.hasOwnProperty("staState"))
            switch (message.staState) {
            default:
                return "staState: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        if (message.failReason != null && message.hasOwnProperty("failReason")) {
            properties.state = 1;
            switch (message.failReason) {
            default:
                return "failReason: enum value expected";
            case 0:
            case 1:
                break;
            }
        }
        if (message.connected != null && message.hasOwnProperty("connected")) {
            if (properties.state === 1)
                return "state: multiple values";
            properties.state = 1;
            {
                var error = $root.WifiConnectedState.verify(message.connected);
                if (error)
                    return "connected." + error;
            }
        }
        return null;
    };

    /**
     * Creates a RespGetStatus message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RespGetStatus
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RespGetStatus} RespGetStatus
     */
    RespGetStatus.fromObject = function fromObject(object) {
        if (object instanceof $root.RespGetStatus)
            return object;
        var message = new $root.RespGetStatus();
        switch (object.status) {
        default:
            if (typeof object.status === "number") {
                message.status = object.status;
                break;
            }
            break;
        case "Success":
        case 0:
            message.status = 0;
            break;
        case "InvalidSecScheme":
        case 1:
            message.status = 1;
            break;
        case "InvalidProto":
        case 2:
            message.status = 2;
            break;
        case "TooManySessions":
        case 3:
            message.status = 3;
            break;
        case "InvalidArgument":
        case 4:
            message.status = 4;
            break;
        case "InternalError":
        case 5:
            message.status = 5;
            break;
        case "CryptoError":
        case 6:
            message.status = 6;
            break;
        case "InvalidSession":
        case 7:
            message.status = 7;
            break;
        }
        switch (object.staState) {
        default:
            if (typeof object.staState === "number") {
                message.staState = object.staState;
                break;
            }
            break;
        case "Connected":
        case 0:
            message.staState = 0;
            break;
        case "Connecting":
        case 1:
            message.staState = 1;
            break;
        case "Disconnected":
        case 2:
            message.staState = 2;
            break;
        case "ConnectionFailed":
        case 3:
            message.staState = 3;
            break;
        }
        switch (object.failReason) {
        default:
            if (typeof object.failReason === "number") {
                message.failReason = object.failReason;
                break;
            }
            break;
        case "AuthError":
        case 0:
            message.failReason = 0;
            break;
        case "NetworkNotFound":
        case 1:
            message.failReason = 1;
            break;
        }
        if (object.connected != null) {
            if (typeof object.connected !== "object")
                throw TypeError(".RespGetStatus.connected: object expected");
            message.connected = $root.WifiConnectedState.fromObject(object.connected);
        }
        return message;
    };

    /**
     * Creates a plain object from a RespGetStatus message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RespGetStatus
     * @static
     * @param {RespGetStatus} message RespGetStatus
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RespGetStatus.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.status = options.enums === String ? "Success" : 0;
            object.staState = options.enums === String ? "Connected" : 0;
        }
        if (message.status != null && message.hasOwnProperty("status"))
            object.status = options.enums === String ? $root.Status[message.status] === undefined ? message.status : $root.Status[message.status] : message.status;
        if (message.staState != null && message.hasOwnProperty("staState"))
            object.staState = options.enums === String ? $root.WifiStationState[message.staState] === undefined ? message.staState : $root.WifiStationState[message.staState] : message.staState;
        if (message.failReason != null && message.hasOwnProperty("failReason")) {
            object.failReason = options.enums === String ? $root.WifiConnectFailedReason[message.failReason] === undefined ? message.failReason : $root.WifiConnectFailedReason[message.failReason] : message.failReason;
            if (options.oneofs)
                object.state = "failReason";
        }
        if (message.connected != null && message.hasOwnProperty("connected")) {
            object.connected = $root.WifiConnectedState.toObject(message.connected, options);
            if (options.oneofs)
                object.state = "connected";
        }
        return object;
    };

    /**
     * Converts this RespGetStatus to JSON.
     * @function toJSON
     * @memberof RespGetStatus
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RespGetStatus.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RespGetStatus
     * @function getTypeUrl
     * @memberof RespGetStatus
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RespGetStatus.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RespGetStatus";
    };

    return RespGetStatus;
})();

$root.CmdSetConfig = (function() {

    /**
     * Properties of a CmdSetConfig.
     * @exports ICmdSetConfig
     * @interface ICmdSetConfig
     * @property {Uint8Array|null} [ssid] CmdSetConfig ssid
     * @property {Uint8Array|null} [passphrase] CmdSetConfig passphrase
     * @property {Uint8Array|null} [bssid] CmdSetConfig bssid
     * @property {number|null} [channel] CmdSetConfig channel
     */

    /**
     * Constructs a new CmdSetConfig.
     * @exports CmdSetConfig
     * @classdesc Represents a CmdSetConfig.
     * @implements ICmdSetConfig
     * @constructor
     * @param {ICmdSetConfig=} [properties] Properties to set
     */
    function CmdSetConfig(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CmdSetConfig ssid.
     * @member {Uint8Array} ssid
     * @memberof CmdSetConfig
     * @instance
     */
    CmdSetConfig.prototype.ssid = $util.newBuffer([]);

    /**
     * CmdSetConfig passphrase.
     * @member {Uint8Array} passphrase
     * @memberof CmdSetConfig
     * @instance
     */
    CmdSetConfig.prototype.passphrase = $util.newBuffer([]);

    /**
     * CmdSetConfig bssid.
     * @member {Uint8Array} bssid
     * @memberof CmdSetConfig
     * @instance
     */
    CmdSetConfig.prototype.bssid = $util.newBuffer([]);

    /**
     * CmdSetConfig channel.
     * @member {number} channel
     * @memberof CmdSetConfig
     * @instance
     */
    CmdSetConfig.prototype.channel = 0;

    /**
     * Creates a new CmdSetConfig instance using the specified properties.
     * @function create
     * @memberof CmdSetConfig
     * @static
     * @param {ICmdSetConfig=} [properties] Properties to set
     * @returns {CmdSetConfig} CmdSetConfig instance
     */
    CmdSetConfig.create = function create(properties) {
        return new CmdSetConfig(properties);
    };

    /**
     * Encodes the specified CmdSetConfig message. Does not implicitly {@link CmdSetConfig.verify|verify} messages.
     * @function encode
     * @memberof CmdSetConfig
     * @static
     * @param {ICmdSetConfig} message CmdSetConfig message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdSetConfig.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.ssid != null && Object.hasOwnProperty.call(message, "ssid"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ssid);
        if (message.passphrase != null && Object.hasOwnProperty.call(message, "passphrase"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.passphrase);
        if (message.bssid != null && Object.hasOwnProperty.call(message, "bssid"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.bssid);
        if (message.channel != null && Object.hasOwnProperty.call(message, "channel"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.channel);
        return writer;
    };

    /**
     * Encodes the specified CmdSetConfig message, length delimited. Does not implicitly {@link CmdSetConfig.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CmdSetConfig
     * @static
     * @param {ICmdSetConfig} message CmdSetConfig message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdSetConfig.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CmdSetConfig message from the specified reader or buffer.
     * @function decode
     * @memberof CmdSetConfig
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CmdSetConfig} CmdSetConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdSetConfig.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CmdSetConfig();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.ssid = reader.bytes();
                    break;
                }
            case 2: {
                    message.passphrase = reader.bytes();
                    break;
                }
            case 3: {
                    message.bssid = reader.bytes();
                    break;
                }
            case 4: {
                    message.channel = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CmdSetConfig message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CmdSetConfig
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CmdSetConfig} CmdSetConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdSetConfig.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CmdSetConfig message.
     * @function verify
     * @memberof CmdSetConfig
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CmdSetConfig.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.ssid != null && message.hasOwnProperty("ssid"))
            if (!(message.ssid && typeof message.ssid.length === "number" || $util.isString(message.ssid)))
                return "ssid: buffer expected";
        if (message.passphrase != null && message.hasOwnProperty("passphrase"))
            if (!(message.passphrase && typeof message.passphrase.length === "number" || $util.isString(message.passphrase)))
                return "passphrase: buffer expected";
        if (message.bssid != null && message.hasOwnProperty("bssid"))
            if (!(message.bssid && typeof message.bssid.length === "number" || $util.isString(message.bssid)))
                return "bssid: buffer expected";
        if (message.channel != null && message.hasOwnProperty("channel"))
            if (!$util.isInteger(message.channel))
                return "channel: integer expected";
        return null;
    };

    /**
     * Creates a CmdSetConfig message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CmdSetConfig
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CmdSetConfig} CmdSetConfig
     */
    CmdSetConfig.fromObject = function fromObject(object) {
        if (object instanceof $root.CmdSetConfig)
            return object;
        var message = new $root.CmdSetConfig();
        if (object.ssid != null)
            if (typeof object.ssid === "string")
                $util.base64.decode(object.ssid, message.ssid = $util.newBuffer($util.base64.length(object.ssid)), 0);
            else if (object.ssid.length >= 0)
                message.ssid = object.ssid;
        if (object.passphrase != null)
            if (typeof object.passphrase === "string")
                $util.base64.decode(object.passphrase, message.passphrase = $util.newBuffer($util.base64.length(object.passphrase)), 0);
            else if (object.passphrase.length >= 0)
                message.passphrase = object.passphrase;
        if (object.bssid != null)
            if (typeof object.bssid === "string")
                $util.base64.decode(object.bssid, message.bssid = $util.newBuffer($util.base64.length(object.bssid)), 0);
            else if (object.bssid.length >= 0)
                message.bssid = object.bssid;
        if (object.channel != null)
            message.channel = object.channel | 0;
        return message;
    };

    /**
     * Creates a plain object from a CmdSetConfig message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CmdSetConfig
     * @static
     * @param {CmdSetConfig} message CmdSetConfig
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CmdSetConfig.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.ssid = "";
            else {
                object.ssid = [];
                if (options.bytes !== Array)
                    object.ssid = $util.newBuffer(object.ssid);
            }
            if (options.bytes === String)
                object.passphrase = "";
            else {
                object.passphrase = [];
                if (options.bytes !== Array)
                    object.passphrase = $util.newBuffer(object.passphrase);
            }
            if (options.bytes === String)
                object.bssid = "";
            else {
                object.bssid = [];
                if (options.bytes !== Array)
                    object.bssid = $util.newBuffer(object.bssid);
            }
            object.channel = 0;
        }
        if (message.ssid != null && message.hasOwnProperty("ssid"))
            object.ssid = options.bytes === String ? $util.base64.encode(message.ssid, 0, message.ssid.length) : options.bytes === Array ? Array.prototype.slice.call(message.ssid) : message.ssid;
        if (message.passphrase != null && message.hasOwnProperty("passphrase"))
            object.passphrase = options.bytes === String ? $util.base64.encode(message.passphrase, 0, message.passphrase.length) : options.bytes === Array ? Array.prototype.slice.call(message.passphrase) : message.passphrase;
        if (message.bssid != null && message.hasOwnProperty("bssid"))
            object.bssid = options.bytes === String ? $util.base64.encode(message.bssid, 0, message.bssid.length) : options.bytes === Array ? Array.prototype.slice.call(message.bssid) : message.bssid;
        if (message.channel != null && message.hasOwnProperty("channel"))
            object.channel = message.channel;
        return object;
    };

    /**
     * Converts this CmdSetConfig to JSON.
     * @function toJSON
     * @memberof CmdSetConfig
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CmdSetConfig.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CmdSetConfig
     * @function getTypeUrl
     * @memberof CmdSetConfig
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CmdSetConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CmdSetConfig";
    };

    return CmdSetConfig;
})();

$root.RespSetConfig = (function() {

    /**
     * Properties of a RespSetConfig.
     * @exports IRespSetConfig
     * @interface IRespSetConfig
     * @property {Status|null} [status] RespSetConfig status
     */

    /**
     * Constructs a new RespSetConfig.
     * @exports RespSetConfig
     * @classdesc Represents a RespSetConfig.
     * @implements IRespSetConfig
     * @constructor
     * @param {IRespSetConfig=} [properties] Properties to set
     */
    function RespSetConfig(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RespSetConfig status.
     * @member {Status} status
     * @memberof RespSetConfig
     * @instance
     */
    RespSetConfig.prototype.status = 0;

    /**
     * Creates a new RespSetConfig instance using the specified properties.
     * @function create
     * @memberof RespSetConfig
     * @static
     * @param {IRespSetConfig=} [properties] Properties to set
     * @returns {RespSetConfig} RespSetConfig instance
     */
    RespSetConfig.create = function create(properties) {
        return new RespSetConfig(properties);
    };

    /**
     * Encodes the specified RespSetConfig message. Does not implicitly {@link RespSetConfig.verify|verify} messages.
     * @function encode
     * @memberof RespSetConfig
     * @static
     * @param {IRespSetConfig} message RespSetConfig message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RespSetConfig.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.status != null && Object.hasOwnProperty.call(message, "status"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
        return writer;
    };

    /**
     * Encodes the specified RespSetConfig message, length delimited. Does not implicitly {@link RespSetConfig.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RespSetConfig
     * @static
     * @param {IRespSetConfig} message RespSetConfig message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RespSetConfig.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RespSetConfig message from the specified reader or buffer.
     * @function decode
     * @memberof RespSetConfig
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RespSetConfig} RespSetConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RespSetConfig.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RespSetConfig();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.status = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a RespSetConfig message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RespSetConfig
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RespSetConfig} RespSetConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RespSetConfig.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RespSetConfig message.
     * @function verify
     * @memberof RespSetConfig
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RespSetConfig.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.status != null && message.hasOwnProperty("status"))
            switch (message.status) {
            default:
                return "status: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                break;
            }
        return null;
    };

    /**
     * Creates a RespSetConfig message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RespSetConfig
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RespSetConfig} RespSetConfig
     */
    RespSetConfig.fromObject = function fromObject(object) {
        if (object instanceof $root.RespSetConfig)
            return object;
        var message = new $root.RespSetConfig();
        switch (object.status) {
        default:
            if (typeof object.status === "number") {
                message.status = object.status;
                break;
            }
            break;
        case "Success":
        case 0:
            message.status = 0;
            break;
        case "InvalidSecScheme":
        case 1:
            message.status = 1;
            break;
        case "InvalidProto":
        case 2:
            message.status = 2;
            break;
        case "TooManySessions":
        case 3:
            message.status = 3;
            break;
        case "InvalidArgument":
        case 4:
            message.status = 4;
            break;
        case "InternalError":
        case 5:
            message.status = 5;
            break;
        case "CryptoError":
        case 6:
            message.status = 6;
            break;
        case "InvalidSession":
        case 7:
            message.status = 7;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from a RespSetConfig message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RespSetConfig
     * @static
     * @param {RespSetConfig} message RespSetConfig
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RespSetConfig.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.status = options.enums === String ? "Success" : 0;
        if (message.status != null && message.hasOwnProperty("status"))
            object.status = options.enums === String ? $root.Status[message.status] === undefined ? message.status : $root.Status[message.status] : message.status;
        return object;
    };

    /**
     * Converts this RespSetConfig to JSON.
     * @function toJSON
     * @memberof RespSetConfig
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RespSetConfig.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RespSetConfig
     * @function getTypeUrl
     * @memberof RespSetConfig
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RespSetConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RespSetConfig";
    };

    return RespSetConfig;
})();

$root.CmdApplyConfig = (function() {

    /**
     * Properties of a CmdApplyConfig.
     * @exports ICmdApplyConfig
     * @interface ICmdApplyConfig
     */

    /**
     * Constructs a new CmdApplyConfig.
     * @exports CmdApplyConfig
     * @classdesc Represents a CmdApplyConfig.
     * @implements ICmdApplyConfig
     * @constructor
     * @param {ICmdApplyConfig=} [properties] Properties to set
     */
    function CmdApplyConfig(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new CmdApplyConfig instance using the specified properties.
     * @function create
     * @memberof CmdApplyConfig
     * @static
     * @param {ICmdApplyConfig=} [properties] Properties to set
     * @returns {CmdApplyConfig} CmdApplyConfig instance
     */
    CmdApplyConfig.create = function create(properties) {
        return new CmdApplyConfig(properties);
    };

    /**
     * Encodes the specified CmdApplyConfig message. Does not implicitly {@link CmdApplyConfig.verify|verify} messages.
     * @function encode
     * @memberof CmdApplyConfig
     * @static
     * @param {ICmdApplyConfig} message CmdApplyConfig message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdApplyConfig.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        return writer;
    };

    /**
     * Encodes the specified CmdApplyConfig message, length delimited. Does not implicitly {@link CmdApplyConfig.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CmdApplyConfig
     * @static
     * @param {ICmdApplyConfig} message CmdApplyConfig message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdApplyConfig.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CmdApplyConfig message from the specified reader or buffer.
     * @function decode
     * @memberof CmdApplyConfig
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CmdApplyConfig} CmdApplyConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdApplyConfig.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CmdApplyConfig();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CmdApplyConfig message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CmdApplyConfig
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CmdApplyConfig} CmdApplyConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdApplyConfig.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CmdApplyConfig message.
     * @function verify
     * @memberof CmdApplyConfig
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CmdApplyConfig.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        return null;
    };

    /**
     * Creates a CmdApplyConfig message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CmdApplyConfig
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CmdApplyConfig} CmdApplyConfig
     */
    CmdApplyConfig.fromObject = function fromObject(object) {
        if (object instanceof $root.CmdApplyConfig)
            return object;
        return new $root.CmdApplyConfig();
    };

    /**
     * Creates a plain object from a CmdApplyConfig message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CmdApplyConfig
     * @static
     * @param {CmdApplyConfig} message CmdApplyConfig
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CmdApplyConfig.toObject = function toObject() {
        return {};
    };

    /**
     * Converts this CmdApplyConfig to JSON.
     * @function toJSON
     * @memberof CmdApplyConfig
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CmdApplyConfig.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CmdApplyConfig
     * @function getTypeUrl
     * @memberof CmdApplyConfig
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CmdApplyConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CmdApplyConfig";
    };

    return CmdApplyConfig;
})();

$root.RespApplyConfig = (function() {

    /**
     * Properties of a RespApplyConfig.
     * @exports IRespApplyConfig
     * @interface IRespApplyConfig
     * @property {Status|null} [status] RespApplyConfig status
     */

    /**
     * Constructs a new RespApplyConfig.
     * @exports RespApplyConfig
     * @classdesc Represents a RespApplyConfig.
     * @implements IRespApplyConfig
     * @constructor
     * @param {IRespApplyConfig=} [properties] Properties to set
     */
    function RespApplyConfig(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RespApplyConfig status.
     * @member {Status} status
     * @memberof RespApplyConfig
     * @instance
     */
    RespApplyConfig.prototype.status = 0;

    /**
     * Creates a new RespApplyConfig instance using the specified properties.
     * @function create
     * @memberof RespApplyConfig
     * @static
     * @param {IRespApplyConfig=} [properties] Properties to set
     * @returns {RespApplyConfig} RespApplyConfig instance
     */
    RespApplyConfig.create = function create(properties) {
        return new RespApplyConfig(properties);
    };

    /**
     * Encodes the specified RespApplyConfig message. Does not implicitly {@link RespApplyConfig.verify|verify} messages.
     * @function encode
     * @memberof RespApplyConfig
     * @static
     * @param {IRespApplyConfig} message RespApplyConfig message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RespApplyConfig.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.status != null && Object.hasOwnProperty.call(message, "status"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
        return writer;
    };

    /**
     * Encodes the specified RespApplyConfig message, length delimited. Does not implicitly {@link RespApplyConfig.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RespApplyConfig
     * @static
     * @param {IRespApplyConfig} message RespApplyConfig message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RespApplyConfig.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RespApplyConfig message from the specified reader or buffer.
     * @function decode
     * @memberof RespApplyConfig
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RespApplyConfig} RespApplyConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RespApplyConfig.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RespApplyConfig();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.status = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a RespApplyConfig message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RespApplyConfig
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RespApplyConfig} RespApplyConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RespApplyConfig.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RespApplyConfig message.
     * @function verify
     * @memberof RespApplyConfig
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RespApplyConfig.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.status != null && message.hasOwnProperty("status"))
            switch (message.status) {
            default:
                return "status: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                break;
            }
        return null;
    };

    /**
     * Creates a RespApplyConfig message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RespApplyConfig
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RespApplyConfig} RespApplyConfig
     */
    RespApplyConfig.fromObject = function fromObject(object) {
        if (object instanceof $root.RespApplyConfig)
            return object;
        var message = new $root.RespApplyConfig();
        switch (object.status) {
        default:
            if (typeof object.status === "number") {
                message.status = object.status;
                break;
            }
            break;
        case "Success":
        case 0:
            message.status = 0;
            break;
        case "InvalidSecScheme":
        case 1:
            message.status = 1;
            break;
        case "InvalidProto":
        case 2:
            message.status = 2;
            break;
        case "TooManySessions":
        case 3:
            message.status = 3;
            break;
        case "InvalidArgument":
        case 4:
            message.status = 4;
            break;
        case "InternalError":
        case 5:
            message.status = 5;
            break;
        case "CryptoError":
        case 6:
            message.status = 6;
            break;
        case "InvalidSession":
        case 7:
            message.status = 7;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from a RespApplyConfig message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RespApplyConfig
     * @static
     * @param {RespApplyConfig} message RespApplyConfig
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RespApplyConfig.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.status = options.enums === String ? "Success" : 0;
        if (message.status != null && message.hasOwnProperty("status"))
            object.status = options.enums === String ? $root.Status[message.status] === undefined ? message.status : $root.Status[message.status] : message.status;
        return object;
    };

    /**
     * Converts this RespApplyConfig to JSON.
     * @function toJSON
     * @memberof RespApplyConfig
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RespApplyConfig.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RespApplyConfig
     * @function getTypeUrl
     * @memberof RespApplyConfig
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RespApplyConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RespApplyConfig";
    };

    return RespApplyConfig;
})();

/**
 * WiFiConfigMsgType enum.
 * @exports WiFiConfigMsgType
 * @enum {number}
 * @property {number} TypeCmdGetStatus=0 TypeCmdGetStatus value
 * @property {number} TypeRespGetStatus=1 TypeRespGetStatus value
 * @property {number} TypeCmdSetConfig=2 TypeCmdSetConfig value
 * @property {number} TypeRespSetConfig=3 TypeRespSetConfig value
 * @property {number} TypeCmdApplyConfig=4 TypeCmdApplyConfig value
 * @property {number} TypeRespApplyConfig=5 TypeRespApplyConfig value
 */
$root.WiFiConfigMsgType = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "TypeCmdGetStatus"] = 0;
    values[valuesById[1] = "TypeRespGetStatus"] = 1;
    values[valuesById[2] = "TypeCmdSetConfig"] = 2;
    values[valuesById[3] = "TypeRespSetConfig"] = 3;
    values[valuesById[4] = "TypeCmdApplyConfig"] = 4;
    values[valuesById[5] = "TypeRespApplyConfig"] = 5;
    return values;
})();

$root.WiFiConfigPayload = (function() {

    /**
     * Properties of a WiFiConfigPayload.
     * @exports IWiFiConfigPayload
     * @interface IWiFiConfigPayload
     * @property {WiFiConfigMsgType|null} [msg] WiFiConfigPayload msg
     * @property {ICmdGetStatus|null} [cmdGetStatus] WiFiConfigPayload cmdGetStatus
     * @property {IRespGetStatus|null} [respGetStatus] WiFiConfigPayload respGetStatus
     * @property {ICmdSetConfig|null} [cmdSetConfig] WiFiConfigPayload cmdSetConfig
     * @property {IRespSetConfig|null} [respSetConfig] WiFiConfigPayload respSetConfig
     * @property {ICmdApplyConfig|null} [cmdApplyConfig] WiFiConfigPayload cmdApplyConfig
     * @property {IRespApplyConfig|null} [respApplyConfig] WiFiConfigPayload respApplyConfig
     */

    /**
     * Constructs a new WiFiConfigPayload.
     * @exports WiFiConfigPayload
     * @classdesc Represents a WiFiConfigPayload.
     * @implements IWiFiConfigPayload
     * @constructor
     * @param {IWiFiConfigPayload=} [properties] Properties to set
     */
    function WiFiConfigPayload(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WiFiConfigPayload msg.
     * @member {WiFiConfigMsgType} msg
     * @memberof WiFiConfigPayload
     * @instance
     */
    WiFiConfigPayload.prototype.msg = 0;

    /**
     * WiFiConfigPayload cmdGetStatus.
     * @member {ICmdGetStatus|null|undefined} cmdGetStatus
     * @memberof WiFiConfigPayload
     * @instance
     */
    WiFiConfigPayload.prototype.cmdGetStatus = null;

    /**
     * WiFiConfigPayload respGetStatus.
     * @member {IRespGetStatus|null|undefined} respGetStatus
     * @memberof WiFiConfigPayload
     * @instance
     */
    WiFiConfigPayload.prototype.respGetStatus = null;

    /**
     * WiFiConfigPayload cmdSetConfig.
     * @member {ICmdSetConfig|null|undefined} cmdSetConfig
     * @memberof WiFiConfigPayload
     * @instance
     */
    WiFiConfigPayload.prototype.cmdSetConfig = null;

    /**
     * WiFiConfigPayload respSetConfig.
     * @member {IRespSetConfig|null|undefined} respSetConfig
     * @memberof WiFiConfigPayload
     * @instance
     */
    WiFiConfigPayload.prototype.respSetConfig = null;

    /**
     * WiFiConfigPayload cmdApplyConfig.
     * @member {ICmdApplyConfig|null|undefined} cmdApplyConfig
     * @memberof WiFiConfigPayload
     * @instance
     */
    WiFiConfigPayload.prototype.cmdApplyConfig = null;

    /**
     * WiFiConfigPayload respApplyConfig.
     * @member {IRespApplyConfig|null|undefined} respApplyConfig
     * @memberof WiFiConfigPayload
     * @instance
     */
    WiFiConfigPayload.prototype.respApplyConfig = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * WiFiConfigPayload payload.
     * @member {"cmdGetStatus"|"respGetStatus"|"cmdSetConfig"|"respSetConfig"|"cmdApplyConfig"|"respApplyConfig"|undefined} payload
     * @memberof WiFiConfigPayload
     * @instance
     */
    Object.defineProperty(WiFiConfigPayload.prototype, "payload", {
        get: $util.oneOfGetter($oneOfFields = ["cmdGetStatus", "respGetStatus", "cmdSetConfig", "respSetConfig", "cmdApplyConfig", "respApplyConfig"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new WiFiConfigPayload instance using the specified properties.
     * @function create
     * @memberof WiFiConfigPayload
     * @static
     * @param {IWiFiConfigPayload=} [properties] Properties to set
     * @returns {WiFiConfigPayload} WiFiConfigPayload instance
     */
    WiFiConfigPayload.create = function create(properties) {
        return new WiFiConfigPayload(properties);
    };

    /**
     * Encodes the specified WiFiConfigPayload message. Does not implicitly {@link WiFiConfigPayload.verify|verify} messages.
     * @function encode
     * @memberof WiFiConfigPayload
     * @static
     * @param {IWiFiConfigPayload} message WiFiConfigPayload message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WiFiConfigPayload.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.msg);
        if (message.cmdGetStatus != null && Object.hasOwnProperty.call(message, "cmdGetStatus"))
            $root.CmdGetStatus.encode(message.cmdGetStatus, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
        if (message.respGetStatus != null && Object.hasOwnProperty.call(message, "respGetStatus"))
            $root.RespGetStatus.encode(message.respGetStatus, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
        if (message.cmdSetConfig != null && Object.hasOwnProperty.call(message, "cmdSetConfig"))
            $root.CmdSetConfig.encode(message.cmdSetConfig, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
        if (message.respSetConfig != null && Object.hasOwnProperty.call(message, "respSetConfig"))
            $root.RespSetConfig.encode(message.respSetConfig, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
        if (message.cmdApplyConfig != null && Object.hasOwnProperty.call(message, "cmdApplyConfig"))
            $root.CmdApplyConfig.encode(message.cmdApplyConfig, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
        if (message.respApplyConfig != null && Object.hasOwnProperty.call(message, "respApplyConfig"))
            $root.RespApplyConfig.encode(message.respApplyConfig, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified WiFiConfigPayload message, length delimited. Does not implicitly {@link WiFiConfigPayload.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WiFiConfigPayload
     * @static
     * @param {IWiFiConfigPayload} message WiFiConfigPayload message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WiFiConfigPayload.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WiFiConfigPayload message from the specified reader or buffer.
     * @function decode
     * @memberof WiFiConfigPayload
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WiFiConfigPayload} WiFiConfigPayload
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WiFiConfigPayload.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WiFiConfigPayload();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.msg = reader.int32();
                    break;
                }
            case 10: {
                    message.cmdGetStatus = $root.CmdGetStatus.decode(reader, reader.uint32());
                    break;
                }
            case 11: {
                    message.respGetStatus = $root.RespGetStatus.decode(reader, reader.uint32());
                    break;
                }
            case 12: {
                    message.cmdSetConfig = $root.CmdSetConfig.decode(reader, reader.uint32());
                    break;
                }
            case 13: {
                    message.respSetConfig = $root.RespSetConfig.decode(reader, reader.uint32());
                    break;
                }
            case 14: {
                    message.cmdApplyConfig = $root.CmdApplyConfig.decode(reader, reader.uint32());
                    break;
                }
            case 15: {
                    message.respApplyConfig = $root.RespApplyConfig.decode(reader, reader.uint32());
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a WiFiConfigPayload message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WiFiConfigPayload
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WiFiConfigPayload} WiFiConfigPayload
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WiFiConfigPayload.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WiFiConfigPayload message.
     * @function verify
     * @memberof WiFiConfigPayload
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WiFiConfigPayload.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.msg != null && message.hasOwnProperty("msg"))
            switch (message.msg) {
            default:
                return "msg: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            }
        if (message.cmdGetStatus != null && message.hasOwnProperty("cmdGetStatus")) {
            properties.payload = 1;
            {
                var error = $root.CmdGetStatus.verify(message.cmdGetStatus);
                if (error)
                    return "cmdGetStatus." + error;
            }
        }
        if (message.respGetStatus != null && message.hasOwnProperty("respGetStatus")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                var error = $root.RespGetStatus.verify(message.respGetStatus);
                if (error)
                    return "respGetStatus." + error;
            }
        }
        if (message.cmdSetConfig != null && message.hasOwnProperty("cmdSetConfig")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                var error = $root.CmdSetConfig.verify(message.cmdSetConfig);
                if (error)
                    return "cmdSetConfig." + error;
            }
        }
        if (message.respSetConfig != null && message.hasOwnProperty("respSetConfig")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                var error = $root.RespSetConfig.verify(message.respSetConfig);
                if (error)
                    return "respSetConfig." + error;
            }
        }
        if (message.cmdApplyConfig != null && message.hasOwnProperty("cmdApplyConfig")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                var error = $root.CmdApplyConfig.verify(message.cmdApplyConfig);
                if (error)
                    return "cmdApplyConfig." + error;
            }
        }
        if (message.respApplyConfig != null && message.hasOwnProperty("respApplyConfig")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                var error = $root.RespApplyConfig.verify(message.respApplyConfig);
                if (error)
                    return "respApplyConfig." + error;
            }
        }
        return null;
    };

    /**
     * Creates a WiFiConfigPayload message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WiFiConfigPayload
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WiFiConfigPayload} WiFiConfigPayload
     */
    WiFiConfigPayload.fromObject = function fromObject(object) {
        if (object instanceof $root.WiFiConfigPayload)
            return object;
        var message = new $root.WiFiConfigPayload();
        switch (object.msg) {
        default:
            if (typeof object.msg === "number") {
                message.msg = object.msg;
                break;
            }
            break;
        case "TypeCmdGetStatus":
        case 0:
            message.msg = 0;
            break;
        case "TypeRespGetStatus":
        case 1:
            message.msg = 1;
            break;
        case "TypeCmdSetConfig":
        case 2:
            message.msg = 2;
            break;
        case "TypeRespSetConfig":
        case 3:
            message.msg = 3;
            break;
        case "TypeCmdApplyConfig":
        case 4:
            message.msg = 4;
            break;
        case "TypeRespApplyConfig":
        case 5:
            message.msg = 5;
            break;
        }
        if (object.cmdGetStatus != null) {
            if (typeof object.cmdGetStatus !== "object")
                throw TypeError(".WiFiConfigPayload.cmdGetStatus: object expected");
            message.cmdGetStatus = $root.CmdGetStatus.fromObject(object.cmdGetStatus);
        }
        if (object.respGetStatus != null) {
            if (typeof object.respGetStatus !== "object")
                throw TypeError(".WiFiConfigPayload.respGetStatus: object expected");
            message.respGetStatus = $root.RespGetStatus.fromObject(object.respGetStatus);
        }
        if (object.cmdSetConfig != null) {
            if (typeof object.cmdSetConfig !== "object")
                throw TypeError(".WiFiConfigPayload.cmdSetConfig: object expected");
            message.cmdSetConfig = $root.CmdSetConfig.fromObject(object.cmdSetConfig);
        }
        if (object.respSetConfig != null) {
            if (typeof object.respSetConfig !== "object")
                throw TypeError(".WiFiConfigPayload.respSetConfig: object expected");
            message.respSetConfig = $root.RespSetConfig.fromObject(object.respSetConfig);
        }
        if (object.cmdApplyConfig != null) {
            if (typeof object.cmdApplyConfig !== "object")
                throw TypeError(".WiFiConfigPayload.cmdApplyConfig: object expected");
            message.cmdApplyConfig = $root.CmdApplyConfig.fromObject(object.cmdApplyConfig);
        }
        if (object.respApplyConfig != null) {
            if (typeof object.respApplyConfig !== "object")
                throw TypeError(".WiFiConfigPayload.respApplyConfig: object expected");
            message.respApplyConfig = $root.RespApplyConfig.fromObject(object.respApplyConfig);
        }
        return message;
    };

    /**
     * Creates a plain object from a WiFiConfigPayload message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WiFiConfigPayload
     * @static
     * @param {WiFiConfigPayload} message WiFiConfigPayload
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WiFiConfigPayload.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.msg = options.enums === String ? "TypeCmdGetStatus" : 0;
        if (message.msg != null && message.hasOwnProperty("msg"))
            object.msg = options.enums === String ? $root.WiFiConfigMsgType[message.msg] === undefined ? message.msg : $root.WiFiConfigMsgType[message.msg] : message.msg;
        if (message.cmdGetStatus != null && message.hasOwnProperty("cmdGetStatus")) {
            object.cmdGetStatus = $root.CmdGetStatus.toObject(message.cmdGetStatus, options);
            if (options.oneofs)
                object.payload = "cmdGetStatus";
        }
        if (message.respGetStatus != null && message.hasOwnProperty("respGetStatus")) {
            object.respGetStatus = $root.RespGetStatus.toObject(message.respGetStatus, options);
            if (options.oneofs)
                object.payload = "respGetStatus";
        }
        if (message.cmdSetConfig != null && message.hasOwnProperty("cmdSetConfig")) {
            object.cmdSetConfig = $root.CmdSetConfig.toObject(message.cmdSetConfig, options);
            if (options.oneofs)
                object.payload = "cmdSetConfig";
        }
        if (message.respSetConfig != null && message.hasOwnProperty("respSetConfig")) {
            object.respSetConfig = $root.RespSetConfig.toObject(message.respSetConfig, options);
            if (options.oneofs)
                object.payload = "respSetConfig";
        }
        if (message.cmdApplyConfig != null && message.hasOwnProperty("cmdApplyConfig")) {
            object.cmdApplyConfig = $root.CmdApplyConfig.toObject(message.cmdApplyConfig, options);
            if (options.oneofs)
                object.payload = "cmdApplyConfig";
        }
        if (message.respApplyConfig != null && message.hasOwnProperty("respApplyConfig")) {
            object.respApplyConfig = $root.RespApplyConfig.toObject(message.respApplyConfig, options);
            if (options.oneofs)
                object.payload = "respApplyConfig";
        }
        return object;
    };

    /**
     * Converts this WiFiConfigPayload to JSON.
     * @function toJSON
     * @memberof WiFiConfigPayload
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WiFiConfigPayload.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for WiFiConfigPayload
     * @function getTypeUrl
     * @memberof WiFiConfigPayload
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    WiFiConfigPayload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/WiFiConfigPayload";
    };

    return WiFiConfigPayload;
})();

/**
 * Status enum.
 * @exports Status
 * @enum {number}
 * @property {number} Success=0 Success value
 * @property {number} InvalidSecScheme=1 InvalidSecScheme value
 * @property {number} InvalidProto=2 InvalidProto value
 * @property {number} TooManySessions=3 TooManySessions value
 * @property {number} InvalidArgument=4 InvalidArgument value
 * @property {number} InternalError=5 InternalError value
 * @property {number} CryptoError=6 CryptoError value
 * @property {number} InvalidSession=7 InvalidSession value
 */
$root.Status = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "Success"] = 0;
    values[valuesById[1] = "InvalidSecScheme"] = 1;
    values[valuesById[2] = "InvalidProto"] = 2;
    values[valuesById[3] = "TooManySessions"] = 3;
    values[valuesById[4] = "InvalidArgument"] = 4;
    values[valuesById[5] = "InternalError"] = 5;
    values[valuesById[6] = "CryptoError"] = 6;
    values[valuesById[7] = "InvalidSession"] = 7;
    return values;
})();

/**
 * WifiStationState enum.
 * @exports WifiStationState
 * @enum {number}
 * @property {number} Connected=0 Connected value
 * @property {number} Connecting=1 Connecting value
 * @property {number} Disconnected=2 Disconnected value
 * @property {number} ConnectionFailed=3 ConnectionFailed value
 */
$root.WifiStationState = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "Connected"] = 0;
    values[valuesById[1] = "Connecting"] = 1;
    values[valuesById[2] = "Disconnected"] = 2;
    values[valuesById[3] = "ConnectionFailed"] = 3;
    return values;
})();

/**
 * WifiConnectFailedReason enum.
 * @exports WifiConnectFailedReason
 * @enum {number}
 * @property {number} AuthError=0 AuthError value
 * @property {number} NetworkNotFound=1 NetworkNotFound value
 */
$root.WifiConnectFailedReason = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "AuthError"] = 0;
    values[valuesById[1] = "NetworkNotFound"] = 1;
    return values;
})();

/**
 * WifiAuthMode enum.
 * @exports WifiAuthMode
 * @enum {number}
 * @property {number} Open=0 Open value
 * @property {number} WEP=1 WEP value
 * @property {number} WPA_PSK=2 WPA_PSK value
 * @property {number} WPA2_PSK=3 WPA2_PSK value
 * @property {number} WPA_WPA2_PSK=4 WPA_WPA2_PSK value
 * @property {number} WPA2_ENTERPRISE=5 WPA2_ENTERPRISE value
 * @property {number} WPA3_PSK=6 WPA3_PSK value
 * @property {number} WPA2_WPA3_PSK=7 WPA2_WPA3_PSK value
 */
$root.WifiAuthMode = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "Open"] = 0;
    values[valuesById[1] = "WEP"] = 1;
    values[valuesById[2] = "WPA_PSK"] = 2;
    values[valuesById[3] = "WPA2_PSK"] = 3;
    values[valuesById[4] = "WPA_WPA2_PSK"] = 4;
    values[valuesById[5] = "WPA2_ENTERPRISE"] = 5;
    values[valuesById[6] = "WPA3_PSK"] = 6;
    values[valuesById[7] = "WPA2_WPA3_PSK"] = 7;
    return values;
})();

$root.WifiConnectedState = (function() {

    /**
     * Properties of a WifiConnectedState.
     * @exports IWifiConnectedState
     * @interface IWifiConnectedState
     * @property {string|null} [ip4Addr] WifiConnectedState ip4Addr
     * @property {WifiAuthMode|null} [authMode] WifiConnectedState authMode
     * @property {Uint8Array|null} [ssid] WifiConnectedState ssid
     * @property {Uint8Array|null} [bssid] WifiConnectedState bssid
     * @property {number|null} [channel] WifiConnectedState channel
     */

    /**
     * Constructs a new WifiConnectedState.
     * @exports WifiConnectedState
     * @classdesc Represents a WifiConnectedState.
     * @implements IWifiConnectedState
     * @constructor
     * @param {IWifiConnectedState=} [properties] Properties to set
     */
    function WifiConnectedState(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WifiConnectedState ip4Addr.
     * @member {string} ip4Addr
     * @memberof WifiConnectedState
     * @instance
     */
    WifiConnectedState.prototype.ip4Addr = "";

    /**
     * WifiConnectedState authMode.
     * @member {WifiAuthMode} authMode
     * @memberof WifiConnectedState
     * @instance
     */
    WifiConnectedState.prototype.authMode = 0;

    /**
     * WifiConnectedState ssid.
     * @member {Uint8Array} ssid
     * @memberof WifiConnectedState
     * @instance
     */
    WifiConnectedState.prototype.ssid = $util.newBuffer([]);

    /**
     * WifiConnectedState bssid.
     * @member {Uint8Array} bssid
     * @memberof WifiConnectedState
     * @instance
     */
    WifiConnectedState.prototype.bssid = $util.newBuffer([]);

    /**
     * WifiConnectedState channel.
     * @member {number} channel
     * @memberof WifiConnectedState
     * @instance
     */
    WifiConnectedState.prototype.channel = 0;

    /**
     * Creates a new WifiConnectedState instance using the specified properties.
     * @function create
     * @memberof WifiConnectedState
     * @static
     * @param {IWifiConnectedState=} [properties] Properties to set
     * @returns {WifiConnectedState} WifiConnectedState instance
     */
    WifiConnectedState.create = function create(properties) {
        return new WifiConnectedState(properties);
    };

    /**
     * Encodes the specified WifiConnectedState message. Does not implicitly {@link WifiConnectedState.verify|verify} messages.
     * @function encode
     * @memberof WifiConnectedState
     * @static
     * @param {IWifiConnectedState} message WifiConnectedState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WifiConnectedState.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.ip4Addr != null && Object.hasOwnProperty.call(message, "ip4Addr"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.ip4Addr);
        if (message.authMode != null && Object.hasOwnProperty.call(message, "authMode"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.authMode);
        if (message.ssid != null && Object.hasOwnProperty.call(message, "ssid"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.ssid);
        if (message.bssid != null && Object.hasOwnProperty.call(message, "bssid"))
            writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.bssid);
        if (message.channel != null && Object.hasOwnProperty.call(message, "channel"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.channel);
        return writer;
    };

    /**
     * Encodes the specified WifiConnectedState message, length delimited. Does not implicitly {@link WifiConnectedState.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WifiConnectedState
     * @static
     * @param {IWifiConnectedState} message WifiConnectedState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WifiConnectedState.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WifiConnectedState message from the specified reader or buffer.
     * @function decode
     * @memberof WifiConnectedState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WifiConnectedState} WifiConnectedState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WifiConnectedState.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WifiConnectedState();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.ip4Addr = reader.string();
                    break;
                }
            case 2: {
                    message.authMode = reader.int32();
                    break;
                }
            case 3: {
                    message.ssid = reader.bytes();
                    break;
                }
            case 4: {
                    message.bssid = reader.bytes();
                    break;
                }
            case 5: {
                    message.channel = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a WifiConnectedState message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WifiConnectedState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WifiConnectedState} WifiConnectedState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WifiConnectedState.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WifiConnectedState message.
     * @function verify
     * @memberof WifiConnectedState
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WifiConnectedState.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.ip4Addr != null && message.hasOwnProperty("ip4Addr"))
            if (!$util.isString(message.ip4Addr))
                return "ip4Addr: string expected";
        if (message.authMode != null && message.hasOwnProperty("authMode"))
            switch (message.authMode) {
            default:
                return "authMode: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                break;
            }
        if (message.ssid != null && message.hasOwnProperty("ssid"))
            if (!(message.ssid && typeof message.ssid.length === "number" || $util.isString(message.ssid)))
                return "ssid: buffer expected";
        if (message.bssid != null && message.hasOwnProperty("bssid"))
            if (!(message.bssid && typeof message.bssid.length === "number" || $util.isString(message.bssid)))
                return "bssid: buffer expected";
        if (message.channel != null && message.hasOwnProperty("channel"))
            if (!$util.isInteger(message.channel))
                return "channel: integer expected";
        return null;
    };

    /**
     * Creates a WifiConnectedState message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WifiConnectedState
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WifiConnectedState} WifiConnectedState
     */
    WifiConnectedState.fromObject = function fromObject(object) {
        if (object instanceof $root.WifiConnectedState)
            return object;
        var message = new $root.WifiConnectedState();
        if (object.ip4Addr != null)
            message.ip4Addr = String(object.ip4Addr);
        switch (object.authMode) {
        default:
            if (typeof object.authMode === "number") {
                message.authMode = object.authMode;
                break;
            }
            break;
        case "Open":
        case 0:
            message.authMode = 0;
            break;
        case "WEP":
        case 1:
            message.authMode = 1;
            break;
        case "WPA_PSK":
        case 2:
            message.authMode = 2;
            break;
        case "WPA2_PSK":
        case 3:
            message.authMode = 3;
            break;
        case "WPA_WPA2_PSK":
        case 4:
            message.authMode = 4;
            break;
        case "WPA2_ENTERPRISE":
        case 5:
            message.authMode = 5;
            break;
        case "WPA3_PSK":
        case 6:
            message.authMode = 6;
            break;
        case "WPA2_WPA3_PSK":
        case 7:
            message.authMode = 7;
            break;
        }
        if (object.ssid != null)
            if (typeof object.ssid === "string")
                $util.base64.decode(object.ssid, message.ssid = $util.newBuffer($util.base64.length(object.ssid)), 0);
            else if (object.ssid.length >= 0)
                message.ssid = object.ssid;
        if (object.bssid != null)
            if (typeof object.bssid === "string")
                $util.base64.decode(object.bssid, message.bssid = $util.newBuffer($util.base64.length(object.bssid)), 0);
            else if (object.bssid.length >= 0)
                message.bssid = object.bssid;
        if (object.channel != null)
            message.channel = object.channel | 0;
        return message;
    };

    /**
     * Creates a plain object from a WifiConnectedState message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WifiConnectedState
     * @static
     * @param {WifiConnectedState} message WifiConnectedState
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WifiConnectedState.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.ip4Addr = "";
            object.authMode = options.enums === String ? "Open" : 0;
            if (options.bytes === String)
                object.ssid = "";
            else {
                object.ssid = [];
                if (options.bytes !== Array)
                    object.ssid = $util.newBuffer(object.ssid);
            }
            if (options.bytes === String)
                object.bssid = "";
            else {
                object.bssid = [];
                if (options.bytes !== Array)
                    object.bssid = $util.newBuffer(object.bssid);
            }
            object.channel = 0;
        }
        if (message.ip4Addr != null && message.hasOwnProperty("ip4Addr"))
            object.ip4Addr = message.ip4Addr;
        if (message.authMode != null && message.hasOwnProperty("authMode"))
            object.authMode = options.enums === String ? $root.WifiAuthMode[message.authMode] === undefined ? message.authMode : $root.WifiAuthMode[message.authMode] : message.authMode;
        if (message.ssid != null && message.hasOwnProperty("ssid"))
            object.ssid = options.bytes === String ? $util.base64.encode(message.ssid, 0, message.ssid.length) : options.bytes === Array ? Array.prototype.slice.call(message.ssid) : message.ssid;
        if (message.bssid != null && message.hasOwnProperty("bssid"))
            object.bssid = options.bytes === String ? $util.base64.encode(message.bssid, 0, message.bssid.length) : options.bytes === Array ? Array.prototype.slice.call(message.bssid) : message.bssid;
        if (message.channel != null && message.hasOwnProperty("channel"))
            object.channel = message.channel;
        return object;
    };

    /**
     * Converts this WifiConnectedState to JSON.
     * @function toJSON
     * @memberof WifiConnectedState
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WifiConnectedState.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for WifiConnectedState
     * @function getTypeUrl
     * @memberof WifiConnectedState
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    WifiConnectedState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/WifiConnectedState";
    };

    return WifiConnectedState;
})();

module.exports = $root;
