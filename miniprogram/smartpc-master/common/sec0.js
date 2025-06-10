/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
// var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.S0SessionCmd = (function() {

    /**
     * Properties of a S0SessionCmd.
     * @exports IS0SessionCmd
     * @interface IS0SessionCmd
     */

    /**
     * Constructs a new S0SessionCmd.
     * @exports S0SessionCmd
     * @classdesc Represents a S0SessionCmd.
     * @implements IS0SessionCmd
     * @constructor
     * @param {IS0SessionCmd=} [properties] Properties to set
     */
    function S0SessionCmd(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new S0SessionCmd instance using the specified properties.
     * @function create
     * @memberof S0SessionCmd
     * @static
     * @param {IS0SessionCmd=} [properties] Properties to set
     * @returns {S0SessionCmd} S0SessionCmd instance
     */
    S0SessionCmd.create = function create(properties) {
        return new S0SessionCmd(properties);
    };

    /**
     * Encodes the specified S0SessionCmd message. Does not implicitly {@link S0SessionCmd.verify|verify} messages.
     * @function encode
     * @memberof S0SessionCmd
     * @static
     * @param {IS0SessionCmd} message S0SessionCmd message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    S0SessionCmd.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        return writer;
    };

    /**
     * Encodes the specified S0SessionCmd message, length delimited. Does not implicitly {@link S0SessionCmd.verify|verify} messages.
     * @function encodeDelimited
     * @memberof S0SessionCmd
     * @static
     * @param {IS0SessionCmd} message S0SessionCmd message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    S0SessionCmd.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a S0SessionCmd message from the specified reader or buffer.
     * @function decode
     * @memberof S0SessionCmd
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {S0SessionCmd} S0SessionCmd
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    S0SessionCmd.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.S0SessionCmd();
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
     * Decodes a S0SessionCmd message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof S0SessionCmd
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {S0SessionCmd} S0SessionCmd
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    S0SessionCmd.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a S0SessionCmd message.
     * @function verify
     * @memberof S0SessionCmd
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    S0SessionCmd.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        return null;
    };

    /**
     * Creates a S0SessionCmd message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof S0SessionCmd
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {S0SessionCmd} S0SessionCmd
     */
    S0SessionCmd.fromObject = function fromObject(object) {
        if (object instanceof $root.S0SessionCmd)
            return object;
        return new $root.S0SessionCmd();
    };

    /**
     * Creates a plain object from a S0SessionCmd message. Also converts values to other types if specified.
     * @function toObject
     * @memberof S0SessionCmd
     * @static
     * @param {S0SessionCmd} message S0SessionCmd
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    S0SessionCmd.toObject = function toObject() {
        return {};
    };

    /**
     * Converts this S0SessionCmd to JSON.
     * @function toJSON
     * @memberof S0SessionCmd
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    S0SessionCmd.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for S0SessionCmd
     * @function getTypeUrl
     * @memberof S0SessionCmd
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    S0SessionCmd.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/S0SessionCmd";
    };

    return S0SessionCmd;
})();

$root.S0SessionResp = (function() {

    /**
     * Properties of a S0SessionResp.
     * @exports IS0SessionResp
     * @interface IS0SessionResp
     * @property {Status|null} [status] S0SessionResp status
     */

    /**
     * Constructs a new S0SessionResp.
     * @exports S0SessionResp
     * @classdesc Represents a S0SessionResp.
     * @implements IS0SessionResp
     * @constructor
     * @param {IS0SessionResp=} [properties] Properties to set
     */
    function S0SessionResp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * S0SessionResp status.
     * @member {Status} status
     * @memberof S0SessionResp
     * @instance
     */
    S0SessionResp.prototype.status = 0;

    /**
     * Creates a new S0SessionResp instance using the specified properties.
     * @function create
     * @memberof S0SessionResp
     * @static
     * @param {IS0SessionResp=} [properties] Properties to set
     * @returns {S0SessionResp} S0SessionResp instance
     */
    S0SessionResp.create = function create(properties) {
        return new S0SessionResp(properties);
    };

    /**
     * Encodes the specified S0SessionResp message. Does not implicitly {@link S0SessionResp.verify|verify} messages.
     * @function encode
     * @memberof S0SessionResp
     * @static
     * @param {IS0SessionResp} message S0SessionResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    S0SessionResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.status != null && Object.hasOwnProperty.call(message, "status"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
        return writer;
    };

    /**
     * Encodes the specified S0SessionResp message, length delimited. Does not implicitly {@link S0SessionResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof S0SessionResp
     * @static
     * @param {IS0SessionResp} message S0SessionResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    S0SessionResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a S0SessionResp message from the specified reader or buffer.
     * @function decode
     * @memberof S0SessionResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {S0SessionResp} S0SessionResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    S0SessionResp.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.S0SessionResp();
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
     * Decodes a S0SessionResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof S0SessionResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {S0SessionResp} S0SessionResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    S0SessionResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a S0SessionResp message.
     * @function verify
     * @memberof S0SessionResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    S0SessionResp.verify = function verify(message) {
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
     * Creates a S0SessionResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof S0SessionResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {S0SessionResp} S0SessionResp
     */
    S0SessionResp.fromObject = function fromObject(object) {
        if (object instanceof $root.S0SessionResp)
            return object;
        var message = new $root.S0SessionResp();
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
     * Creates a plain object from a S0SessionResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof S0SessionResp
     * @static
     * @param {S0SessionResp} message S0SessionResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    S0SessionResp.toObject = function toObject(message, options) {
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
     * Converts this S0SessionResp to JSON.
     * @function toJSON
     * @memberof S0SessionResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    S0SessionResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for S0SessionResp
     * @function getTypeUrl
     * @memberof S0SessionResp
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    S0SessionResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/S0SessionResp";
    };

    return S0SessionResp;
})();

/**
 * Sec0MsgType enum.
 * @exports Sec0MsgType
 * @enum {number}
 * @property {number} S0_Session_Command=0 S0_Session_Command value
 * @property {number} S0_Session_Response=1 S0_Session_Response value
 */
$root.Sec0MsgType = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "S0_Session_Command"] = 0;
    values[valuesById[1] = "S0_Session_Response"] = 1;
    return values;
})();

$root.Sec0Payload = (function() {

    /**
     * Properties of a Sec0Payload.
     * @exports ISec0Payload
     * @interface ISec0Payload
     * @property {Sec0MsgType|null} [msg] Sec0Payload msg
     * @property {IS0SessionCmd|null} [sc] Sec0Payload sc
     * @property {IS0SessionResp|null} [sr] Sec0Payload sr
     */

    /**
     * Constructs a new Sec0Payload.
     * @exports Sec0Payload
     * @classdesc Represents a Sec0Payload.
     * @implements ISec0Payload
     * @constructor
     * @param {ISec0Payload=} [properties] Properties to set
     */
    function Sec0Payload(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Sec0Payload msg.
     * @member {Sec0MsgType} msg
     * @memberof Sec0Payload
     * @instance
     */
    Sec0Payload.prototype.msg = 0;

    /**
     * Sec0Payload sc.
     * @member {IS0SessionCmd|null|undefined} sc
     * @memberof Sec0Payload
     * @instance
     */
    Sec0Payload.prototype.sc = null;

    /**
     * Sec0Payload sr.
     * @member {IS0SessionResp|null|undefined} sr
     * @memberof Sec0Payload
     * @instance
     */
    Sec0Payload.prototype.sr = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Sec0Payload payload.
     * @member {"sc"|"sr"|undefined} payload
     * @memberof Sec0Payload
     * @instance
     */
    Object.defineProperty(Sec0Payload.prototype, "payload", {
        get: $util.oneOfGetter($oneOfFields = ["sc", "sr"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Sec0Payload instance using the specified properties.
     * @function create
     * @memberof Sec0Payload
     * @static
     * @param {ISec0Payload=} [properties] Properties to set
     * @returns {Sec0Payload} Sec0Payload instance
     */
    Sec0Payload.create = function create(properties) {
        return new Sec0Payload(properties);
    };

    /**
     * Encodes the specified Sec0Payload message. Does not implicitly {@link Sec0Payload.verify|verify} messages.
     * @function encode
     * @memberof Sec0Payload
     * @static
     * @param {ISec0Payload} message Sec0Payload message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Sec0Payload.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.msg);
        if (message.sc != null && Object.hasOwnProperty.call(message, "sc"))
            $root.S0SessionCmd.encode(message.sc, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
        if (message.sr != null && Object.hasOwnProperty.call(message, "sr"))
            $root.S0SessionResp.encode(message.sr, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Sec0Payload message, length delimited. Does not implicitly {@link Sec0Payload.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Sec0Payload
     * @static
     * @param {ISec0Payload} message Sec0Payload message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Sec0Payload.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Sec0Payload message from the specified reader or buffer.
     * @function decode
     * @memberof Sec0Payload
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Sec0Payload} Sec0Payload
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Sec0Payload.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Sec0Payload();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.msg = reader.int32();
                    break;
                }
            case 20: {
                    message.sc = $root.S0SessionCmd.decode(reader, reader.uint32());
                    break;
                }
            case 21: {
                    message.sr = $root.S0SessionResp.decode(reader, reader.uint32());
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
     * Decodes a Sec0Payload message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Sec0Payload
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Sec0Payload} Sec0Payload
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Sec0Payload.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Sec0Payload message.
     * @function verify
     * @memberof Sec0Payload
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Sec0Payload.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.msg != null && message.hasOwnProperty("msg"))
            switch (message.msg) {
            default:
                return "msg: enum value expected";
            case 0:
            case 1:
                break;
            }
        if (message.sc != null && message.hasOwnProperty("sc")) {
            properties.payload = 1;
            {
                var error = $root.S0SessionCmd.verify(message.sc);
                if (error)
                    return "sc." + error;
            }
        }
        if (message.sr != null && message.hasOwnProperty("sr")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                var error = $root.S0SessionResp.verify(message.sr);
                if (error)
                    return "sr." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Sec0Payload message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Sec0Payload
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Sec0Payload} Sec0Payload
     */
    Sec0Payload.fromObject = function fromObject(object) {
        if (object instanceof $root.Sec0Payload)
            return object;
        var message = new $root.Sec0Payload();
        switch (object.msg) {
        default:
            if (typeof object.msg === "number") {
                message.msg = object.msg;
                break;
            }
            break;
        case "S0_Session_Command":
        case 0:
            message.msg = 0;
            break;
        case "S0_Session_Response":
        case 1:
            message.msg = 1;
            break;
        }
        if (object.sc != null) {
            if (typeof object.sc !== "object")
                throw TypeError(".Sec0Payload.sc: object expected");
            message.sc = $root.S0SessionCmd.fromObject(object.sc);
        }
        if (object.sr != null) {
            if (typeof object.sr !== "object")
                throw TypeError(".Sec0Payload.sr: object expected");
            message.sr = $root.S0SessionResp.fromObject(object.sr);
        }
        return message;
    };

    /**
     * Creates a plain object from a Sec0Payload message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Sec0Payload
     * @static
     * @param {Sec0Payload} message Sec0Payload
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Sec0Payload.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.msg = options.enums === String ? "S0_Session_Command" : 0;
        if (message.msg != null && message.hasOwnProperty("msg"))
            object.msg = options.enums === String ? $root.Sec0MsgType[message.msg] === undefined ? message.msg : $root.Sec0MsgType[message.msg] : message.msg;
        if (message.sc != null && message.hasOwnProperty("sc")) {
            object.sc = $root.S0SessionCmd.toObject(message.sc, options);
            if (options.oneofs)
                object.payload = "sc";
        }
        if (message.sr != null && message.hasOwnProperty("sr")) {
            object.sr = $root.S0SessionResp.toObject(message.sr, options);
            if (options.oneofs)
                object.payload = "sr";
        }
        return object;
    };

    /**
     * Converts this Sec0Payload to JSON.
     * @function toJSON
     * @memberof Sec0Payload
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Sec0Payload.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Sec0Payload
     * @function getTypeUrl
     * @memberof Sec0Payload
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Sec0Payload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Sec0Payload";
    };

    return Sec0Payload;
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

module.exports = $root;
