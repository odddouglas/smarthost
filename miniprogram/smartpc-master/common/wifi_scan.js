/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = ($protobuf.roots["default"] = {});

$root.CmdScanStart = (function() {

    /**
     * Properties of a CmdScanStart.
     * @exports ICmdScanStart
     * @interface ICmdScanStart
     * @property {boolean|null} [blocking] CmdScanStart blocking
     * @property {boolean|null} [passive] CmdScanStart passive
     * @property {number|null} [groupChannels] CmdScanStart groupChannels
     * @property {number|null} [periodMs] CmdScanStart periodMs
     */

    /**
     * Constructs a new CmdScanStart.
     * @exports CmdScanStart
     * @classdesc Represents a CmdScanStart.
     * @implements ICmdScanStart
     * @constructor
     * @param {ICmdScanStart=} [properties] Properties to set
     */
    function CmdScanStart(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CmdScanStart blocking.
     * @member {boolean} blocking
     * @memberof CmdScanStart
     * @instance
     */
    CmdScanStart.prototype.blocking = false;

    /**
     * CmdScanStart passive.
     * @member {boolean} passive
     * @memberof CmdScanStart
     * @instance
     */
    CmdScanStart.prototype.passive = false;

    /**
     * CmdScanStart groupChannels.
     * @member {number} groupChannels
     * @memberof CmdScanStart
     * @instance
     */
    CmdScanStart.prototype.groupChannels = 0;

    /**
     * CmdScanStart periodMs.
     * @member {number} periodMs
     * @memberof CmdScanStart
     * @instance
     */
    CmdScanStart.prototype.periodMs = 0;

    /**
     * Creates a new CmdScanStart instance using the specified properties.
     * @function create
     * @memberof CmdScanStart
     * @static
     * @param {ICmdScanStart=} [properties] Properties to set
     * @returns {CmdScanStart} CmdScanStart instance
     */
    CmdScanStart.create = function create(properties) {
        return new CmdScanStart(properties);
    };

    /**
     * Encodes the specified CmdScanStart message. Does not implicitly {@link CmdScanStart.verify|verify} messages.
     * @function encode
     * @memberof CmdScanStart
     * @static
     * @param {ICmdScanStart} message CmdScanStart message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdScanStart.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.blocking != null && Object.hasOwnProperty.call(message, "blocking"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.blocking);
        if (message.passive != null && Object.hasOwnProperty.call(message, "passive"))
            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.passive);
        if (message.groupChannels != null && Object.hasOwnProperty.call(message, "groupChannels"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.groupChannels);
        if (message.periodMs != null && Object.hasOwnProperty.call(message, "periodMs"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.periodMs);
        return writer;
    };

    /**
     * Encodes the specified CmdScanStart message, length delimited. Does not implicitly {@link CmdScanStart.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CmdScanStart
     * @static
     * @param {ICmdScanStart} message CmdScanStart message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdScanStart.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CmdScanStart message from the specified reader or buffer.
     * @function decode
     * @memberof CmdScanStart
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CmdScanStart} CmdScanStart
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdScanStart.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CmdScanStart();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.blocking = reader.bool();
                    break;
                }
            case 2: {
                    message.passive = reader.bool();
                    break;
                }
            case 3: {
                    message.groupChannels = reader.uint32();
                    break;
                }
            case 4: {
                    message.periodMs = reader.uint32();
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
     * Decodes a CmdScanStart message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CmdScanStart
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CmdScanStart} CmdScanStart
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdScanStart.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CmdScanStart message.
     * @function verify
     * @memberof CmdScanStart
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CmdScanStart.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.blocking != null && message.hasOwnProperty("blocking"))
            if (typeof message.blocking !== "boolean")
                return "blocking: boolean expected";
        if (message.passive != null && message.hasOwnProperty("passive"))
            if (typeof message.passive !== "boolean")
                return "passive: boolean expected";
        if (message.groupChannels != null && message.hasOwnProperty("groupChannels"))
            if (!$util.isInteger(message.groupChannels))
                return "groupChannels: integer expected";
        if (message.periodMs != null && message.hasOwnProperty("periodMs"))
            if (!$util.isInteger(message.periodMs))
                return "periodMs: integer expected";
        return null;
    };

    /**
     * Creates a CmdScanStart message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CmdScanStart
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CmdScanStart} CmdScanStart
     */
    CmdScanStart.fromObject = function fromObject(object) {
        if (object instanceof $root.CmdScanStart)
            return object;
        var message = new $root.CmdScanStart();
        if (object.blocking != null)
            message.blocking = Boolean(object.blocking);
        if (object.passive != null)
            message.passive = Boolean(object.passive);
        if (object.groupChannels != null)
            message.groupChannels = object.groupChannels >>> 0;
        if (object.periodMs != null)
            message.periodMs = object.periodMs >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a CmdScanStart message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CmdScanStart
     * @static
     * @param {CmdScanStart} message CmdScanStart
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CmdScanStart.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.blocking = false;
            object.passive = false;
            object.groupChannels = 0;
            object.periodMs = 0;
        }
        if (message.blocking != null && message.hasOwnProperty("blocking"))
            object.blocking = message.blocking;
        if (message.passive != null && message.hasOwnProperty("passive"))
            object.passive = message.passive;
        if (message.groupChannels != null && message.hasOwnProperty("groupChannels"))
            object.groupChannels = message.groupChannels;
        if (message.periodMs != null && message.hasOwnProperty("periodMs"))
            object.periodMs = message.periodMs;
        return object;
    };

    /**
     * Converts this CmdScanStart to JSON.
     * @function toJSON
     * @memberof CmdScanStart
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CmdScanStart.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CmdScanStart
     * @function getTypeUrl
     * @memberof CmdScanStart
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CmdScanStart.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CmdScanStart";
    };

    return CmdScanStart;
})();

$root.RespScanStart = (function() {

    /**
     * Properties of a RespScanStart.
     * @exports IRespScanStart
     * @interface IRespScanStart
     */

    /**
     * Constructs a new RespScanStart.
     * @exports RespScanStart
     * @classdesc Represents a RespScanStart.
     * @implements IRespScanStart
     * @constructor
     * @param {IRespScanStart=} [properties] Properties to set
     */
    function RespScanStart(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new RespScanStart instance using the specified properties.
     * @function create
     * @memberof RespScanStart
     * @static
     * @param {IRespScanStart=} [properties] Properties to set
     * @returns {RespScanStart} RespScanStart instance
     */
    RespScanStart.create = function create(properties) {
        return new RespScanStart(properties);
    };

    /**
     * Encodes the specified RespScanStart message. Does not implicitly {@link RespScanStart.verify|verify} messages.
     * @function encode
     * @memberof RespScanStart
     * @static
     * @param {IRespScanStart} message RespScanStart message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RespScanStart.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        return writer;
    };

    /**
     * Encodes the specified RespScanStart message, length delimited. Does not implicitly {@link RespScanStart.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RespScanStart
     * @static
     * @param {IRespScanStart} message RespScanStart message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RespScanStart.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RespScanStart message from the specified reader or buffer.
     * @function decode
     * @memberof RespScanStart
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RespScanStart} RespScanStart
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RespScanStart.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RespScanStart();
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
     * Decodes a RespScanStart message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RespScanStart
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RespScanStart} RespScanStart
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RespScanStart.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RespScanStart message.
     * @function verify
     * @memberof RespScanStart
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RespScanStart.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        return null;
    };

    /**
     * Creates a RespScanStart message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RespScanStart
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RespScanStart} RespScanStart
     */
    RespScanStart.fromObject = function fromObject(object) {
        if (object instanceof $root.RespScanStart)
            return object;
        return new $root.RespScanStart();
    };

    /**
     * Creates a plain object from a RespScanStart message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RespScanStart
     * @static
     * @param {RespScanStart} message RespScanStart
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RespScanStart.toObject = function toObject() {
        return {};
    };

    /**
     * Converts this RespScanStart to JSON.
     * @function toJSON
     * @memberof RespScanStart
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RespScanStart.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RespScanStart
     * @function getTypeUrl
     * @memberof RespScanStart
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RespScanStart.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RespScanStart";
    };

    return RespScanStart;
})();

$root.CmdScanStatus = (function() {

    /**
     * Properties of a CmdScanStatus.
     * @exports ICmdScanStatus
     * @interface ICmdScanStatus
     */

    /**
     * Constructs a new CmdScanStatus.
     * @exports CmdScanStatus
     * @classdesc Represents a CmdScanStatus.
     * @implements ICmdScanStatus
     * @constructor
     * @param {ICmdScanStatus=} [properties] Properties to set
     */
    function CmdScanStatus(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new CmdScanStatus instance using the specified properties.
     * @function create
     * @memberof CmdScanStatus
     * @static
     * @param {ICmdScanStatus=} [properties] Properties to set
     * @returns {CmdScanStatus} CmdScanStatus instance
     */
    CmdScanStatus.create = function create(properties) {
        return new CmdScanStatus(properties);
    };

    /**
     * Encodes the specified CmdScanStatus message. Does not implicitly {@link CmdScanStatus.verify|verify} messages.
     * @function encode
     * @memberof CmdScanStatus
     * @static
     * @param {ICmdScanStatus} message CmdScanStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdScanStatus.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        return writer;
    };

    /**
     * Encodes the specified CmdScanStatus message, length delimited. Does not implicitly {@link CmdScanStatus.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CmdScanStatus
     * @static
     * @param {ICmdScanStatus} message CmdScanStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdScanStatus.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CmdScanStatus message from the specified reader or buffer.
     * @function decode
     * @memberof CmdScanStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CmdScanStatus} CmdScanStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdScanStatus.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CmdScanStatus();
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
     * Decodes a CmdScanStatus message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CmdScanStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CmdScanStatus} CmdScanStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdScanStatus.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CmdScanStatus message.
     * @function verify
     * @memberof CmdScanStatus
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CmdScanStatus.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        return null;
    };

    /**
     * Creates a CmdScanStatus message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CmdScanStatus
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CmdScanStatus} CmdScanStatus
     */
    CmdScanStatus.fromObject = function fromObject(object) {
        if (object instanceof $root.CmdScanStatus)
            return object;
        return new $root.CmdScanStatus();
    };

    /**
     * Creates a plain object from a CmdScanStatus message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CmdScanStatus
     * @static
     * @param {CmdScanStatus} message CmdScanStatus
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CmdScanStatus.toObject = function toObject() {
        return {};
    };

    /**
     * Converts this CmdScanStatus to JSON.
     * @function toJSON
     * @memberof CmdScanStatus
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CmdScanStatus.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CmdScanStatus
     * @function getTypeUrl
     * @memberof CmdScanStatus
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CmdScanStatus.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CmdScanStatus";
    };

    return CmdScanStatus;
})();

$root.RespScanStatus = (function() {

    /**
     * Properties of a RespScanStatus.
     * @exports IRespScanStatus
     * @interface IRespScanStatus
     * @property {boolean|null} [scanFinished] RespScanStatus scanFinished
     * @property {number|null} [resultCount] RespScanStatus resultCount
     */

    /**
     * Constructs a new RespScanStatus.
     * @exports RespScanStatus
     * @classdesc Represents a RespScanStatus.
     * @implements IRespScanStatus
     * @constructor
     * @param {IRespScanStatus=} [properties] Properties to set
     */
    function RespScanStatus(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RespScanStatus scanFinished.
     * @member {boolean} scanFinished
     * @memberof RespScanStatus
     * @instance
     */
    RespScanStatus.prototype.scanFinished = false;

    /**
     * RespScanStatus resultCount.
     * @member {number} resultCount
     * @memberof RespScanStatus
     * @instance
     */
    RespScanStatus.prototype.resultCount = 0;

    /**
     * Creates a new RespScanStatus instance using the specified properties.
     * @function create
     * @memberof RespScanStatus
     * @static
     * @param {IRespScanStatus=} [properties] Properties to set
     * @returns {RespScanStatus} RespScanStatus instance
     */
    RespScanStatus.create = function create(properties) {
        return new RespScanStatus(properties);
    };

    /**
     * Encodes the specified RespScanStatus message. Does not implicitly {@link RespScanStatus.verify|verify} messages.
     * @function encode
     * @memberof RespScanStatus
     * @static
     * @param {IRespScanStatus} message RespScanStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RespScanStatus.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.scanFinished != null && Object.hasOwnProperty.call(message, "scanFinished"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.scanFinished);
        if (message.resultCount != null && Object.hasOwnProperty.call(message, "resultCount"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.resultCount);
        return writer;
    };

    /**
     * Encodes the specified RespScanStatus message, length delimited. Does not implicitly {@link RespScanStatus.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RespScanStatus
     * @static
     * @param {IRespScanStatus} message RespScanStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RespScanStatus.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RespScanStatus message from the specified reader or buffer.
     * @function decode
     * @memberof RespScanStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RespScanStatus} RespScanStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RespScanStatus.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RespScanStatus();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.scanFinished = reader.bool();
                    break;
                }
            case 2: {
                    message.resultCount = reader.uint32();
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
     * Decodes a RespScanStatus message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RespScanStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RespScanStatus} RespScanStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RespScanStatus.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RespScanStatus message.
     * @function verify
     * @memberof RespScanStatus
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RespScanStatus.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.scanFinished != null && message.hasOwnProperty("scanFinished"))
            if (typeof message.scanFinished !== "boolean")
                return "scanFinished: boolean expected";
        if (message.resultCount != null && message.hasOwnProperty("resultCount"))
            if (!$util.isInteger(message.resultCount))
                return "resultCount: integer expected";
        return null;
    };

    /**
     * Creates a RespScanStatus message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RespScanStatus
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RespScanStatus} RespScanStatus
     */
    RespScanStatus.fromObject = function fromObject(object) {
        if (object instanceof $root.RespScanStatus)
            return object;
        var message = new $root.RespScanStatus();
        if (object.scanFinished != null)
            message.scanFinished = Boolean(object.scanFinished);
        if (object.resultCount != null)
            message.resultCount = object.resultCount >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a RespScanStatus message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RespScanStatus
     * @static
     * @param {RespScanStatus} message RespScanStatus
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RespScanStatus.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.scanFinished = false;
            object.resultCount = 0;
        }
        if (message.scanFinished != null && message.hasOwnProperty("scanFinished"))
            object.scanFinished = message.scanFinished;
        if (message.resultCount != null && message.hasOwnProperty("resultCount"))
            object.resultCount = message.resultCount;
        return object;
    };

    /**
     * Converts this RespScanStatus to JSON.
     * @function toJSON
     * @memberof RespScanStatus
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RespScanStatus.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RespScanStatus
     * @function getTypeUrl
     * @memberof RespScanStatus
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RespScanStatus.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RespScanStatus";
    };

    return RespScanStatus;
})();

$root.CmdScanResult = (function() {

    /**
     * Properties of a CmdScanResult.
     * @exports ICmdScanResult
     * @interface ICmdScanResult
     * @property {number|null} [startIndex] CmdScanResult startIndex
     * @property {number|null} [count] CmdScanResult count
     */

    /**
     * Constructs a new CmdScanResult.
     * @exports CmdScanResult
     * @classdesc Represents a CmdScanResult.
     * @implements ICmdScanResult
     * @constructor
     * @param {ICmdScanResult=} [properties] Properties to set
     */
    function CmdScanResult(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CmdScanResult startIndex.
     * @member {number} startIndex
     * @memberof CmdScanResult
     * @instance
     */
    CmdScanResult.prototype.startIndex = 0;

    /**
     * CmdScanResult count.
     * @member {number} count
     * @memberof CmdScanResult
     * @instance
     */
    CmdScanResult.prototype.count = 0;

    /**
     * Creates a new CmdScanResult instance using the specified properties.
     * @function create
     * @memberof CmdScanResult
     * @static
     * @param {ICmdScanResult=} [properties] Properties to set
     * @returns {CmdScanResult} CmdScanResult instance
     */
    CmdScanResult.create = function create(properties) {
        return new CmdScanResult(properties);
    };

    /**
     * Encodes the specified CmdScanResult message. Does not implicitly {@link CmdScanResult.verify|verify} messages.
     * @function encode
     * @memberof CmdScanResult
     * @static
     * @param {ICmdScanResult} message CmdScanResult message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdScanResult.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.startIndex != null && Object.hasOwnProperty.call(message, "startIndex"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.startIndex);
        if (message.count != null && Object.hasOwnProperty.call(message, "count"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.count);
        return writer;
    };

    /**
     * Encodes the specified CmdScanResult message, length delimited. Does not implicitly {@link CmdScanResult.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CmdScanResult
     * @static
     * @param {ICmdScanResult} message CmdScanResult message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdScanResult.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CmdScanResult message from the specified reader or buffer.
     * @function decode
     * @memberof CmdScanResult
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CmdScanResult} CmdScanResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdScanResult.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CmdScanResult();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.startIndex = reader.uint32();
                    break;
                }
            case 2: {
                    message.count = reader.uint32();
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
     * Decodes a CmdScanResult message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CmdScanResult
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CmdScanResult} CmdScanResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdScanResult.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CmdScanResult message.
     * @function verify
     * @memberof CmdScanResult
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CmdScanResult.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.startIndex != null && message.hasOwnProperty("startIndex"))
            if (!$util.isInteger(message.startIndex))
                return "startIndex: integer expected";
        if (message.count != null && message.hasOwnProperty("count"))
            if (!$util.isInteger(message.count))
                return "count: integer expected";
        return null;
    };

    /**
     * Creates a CmdScanResult message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CmdScanResult
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CmdScanResult} CmdScanResult
     */
    CmdScanResult.fromObject = function fromObject(object) {
        if (object instanceof $root.CmdScanResult)
            return object;
        var message = new $root.CmdScanResult();
        if (object.startIndex != null)
            message.startIndex = object.startIndex >>> 0;
        if (object.count != null)
            message.count = object.count >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a CmdScanResult message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CmdScanResult
     * @static
     * @param {CmdScanResult} message CmdScanResult
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CmdScanResult.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.startIndex = 0;
            object.count = 0;
        }
        if (message.startIndex != null && message.hasOwnProperty("startIndex"))
            object.startIndex = message.startIndex;
        if (message.count != null && message.hasOwnProperty("count"))
            object.count = message.count;
        return object;
    };

    /**
     * Converts this CmdScanResult to JSON.
     * @function toJSON
     * @memberof CmdScanResult
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CmdScanResult.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CmdScanResult
     * @function getTypeUrl
     * @memberof CmdScanResult
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CmdScanResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CmdScanResult";
    };

    return CmdScanResult;
})();

$root.WiFiScanResult = (function() {

    /**
     * Properties of a WiFiScanResult.
     * @exports IWiFiScanResult
     * @interface IWiFiScanResult
     * @property {Uint8Array|null} [ssid] WiFiScanResult ssid
     * @property {number|null} [channel] WiFiScanResult channel
     * @property {number|null} [rssi] WiFiScanResult rssi
     * @property {Uint8Array|null} [bssid] WiFiScanResult bssid
     * @property {WifiAuthMode|null} [auth] WiFiScanResult auth
     */

    /**
     * Constructs a new WiFiScanResult.
     * @exports WiFiScanResult
     * @classdesc Represents a WiFiScanResult.
     * @implements IWiFiScanResult
     * @constructor
     * @param {IWiFiScanResult=} [properties] Properties to set
     */
    function WiFiScanResult(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WiFiScanResult ssid.
     * @member {Uint8Array} ssid
     * @memberof WiFiScanResult
     * @instance
     */
    WiFiScanResult.prototype.ssid = $util.newBuffer([]);

    /**
     * WiFiScanResult channel.
     * @member {number} channel
     * @memberof WiFiScanResult
     * @instance
     */
    WiFiScanResult.prototype.channel = 0;

    /**
     * WiFiScanResult rssi.
     * @member {number} rssi
     * @memberof WiFiScanResult
     * @instance
     */
    WiFiScanResult.prototype.rssi = 0;

    /**
     * WiFiScanResult bssid.
     * @member {Uint8Array} bssid
     * @memberof WiFiScanResult
     * @instance
     */
    WiFiScanResult.prototype.bssid = $util.newBuffer([]);

    /**
     * WiFiScanResult auth.
     * @member {WifiAuthMode} auth
     * @memberof WiFiScanResult
     * @instance
     */
    WiFiScanResult.prototype.auth = 0;

    /**
     * Creates a new WiFiScanResult instance using the specified properties.
     * @function create
     * @memberof WiFiScanResult
     * @static
     * @param {IWiFiScanResult=} [properties] Properties to set
     * @returns {WiFiScanResult} WiFiScanResult instance
     */
    WiFiScanResult.create = function create(properties) {
        return new WiFiScanResult(properties);
    };

    /**
     * Encodes the specified WiFiScanResult message. Does not implicitly {@link WiFiScanResult.verify|verify} messages.
     * @function encode
     * @memberof WiFiScanResult
     * @static
     * @param {IWiFiScanResult} message WiFiScanResult message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WiFiScanResult.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.ssid != null && Object.hasOwnProperty.call(message, "ssid"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ssid);
        if (message.channel != null && Object.hasOwnProperty.call(message, "channel"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.channel);
        if (message.rssi != null && Object.hasOwnProperty.call(message, "rssi"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.rssi);
        if (message.bssid != null && Object.hasOwnProperty.call(message, "bssid"))
            writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.bssid);
        if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.auth);
        return writer;
    };

    /**
     * Encodes the specified WiFiScanResult message, length delimited. Does not implicitly {@link WiFiScanResult.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WiFiScanResult
     * @static
     * @param {IWiFiScanResult} message WiFiScanResult message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WiFiScanResult.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WiFiScanResult message from the specified reader or buffer.
     * @function decode
     * @memberof WiFiScanResult
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WiFiScanResult} WiFiScanResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WiFiScanResult.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WiFiScanResult();
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
                    message.channel = reader.uint32();
                    break;
                }
            case 3: {
                    message.rssi = reader.int32();
                    break;
                }
            case 4: {
                    message.bssid = reader.bytes();
                    break;
                }
            case 5: {
                    message.auth = reader.int32();
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
     * Decodes a WiFiScanResult message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WiFiScanResult
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WiFiScanResult} WiFiScanResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WiFiScanResult.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WiFiScanResult message.
     * @function verify
     * @memberof WiFiScanResult
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WiFiScanResult.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.ssid != null && message.hasOwnProperty("ssid"))
            if (!(message.ssid && typeof message.ssid.length === "number" || $util.isString(message.ssid)))
                return "ssid: buffer expected";
        if (message.channel != null && message.hasOwnProperty("channel"))
            if (!$util.isInteger(message.channel))
                return "channel: integer expected";
        if (message.rssi != null && message.hasOwnProperty("rssi"))
            if (!$util.isInteger(message.rssi))
                return "rssi: integer expected";
        if (message.bssid != null && message.hasOwnProperty("bssid"))
            if (!(message.bssid && typeof message.bssid.length === "number" || $util.isString(message.bssid)))
                return "bssid: buffer expected";
        if (message.auth != null && message.hasOwnProperty("auth"))
            switch (message.auth) {
            default:
                return "auth: enum value expected";
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
     * Creates a WiFiScanResult message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WiFiScanResult
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WiFiScanResult} WiFiScanResult
     */
    WiFiScanResult.fromObject = function fromObject(object) {
        if (object instanceof $root.WiFiScanResult)
            return object;
        var message = new $root.WiFiScanResult();
        if (object.ssid != null)
            if (typeof object.ssid === "string")
                $util.base64.decode(object.ssid, message.ssid = $util.newBuffer($util.base64.length(object.ssid)), 0);
            else if (object.ssid.length >= 0)
                message.ssid = object.ssid;
        if (object.channel != null)
            message.channel = object.channel >>> 0;
        if (object.rssi != null)
            message.rssi = object.rssi | 0;
        if (object.bssid != null)
            if (typeof object.bssid === "string")
                $util.base64.decode(object.bssid, message.bssid = $util.newBuffer($util.base64.length(object.bssid)), 0);
            else if (object.bssid.length >= 0)
                message.bssid = object.bssid;
        switch (object.auth) {
        default:
            if (typeof object.auth === "number") {
                message.auth = object.auth;
                break;
            }
            break;
        case "Open":
        case 0:
            message.auth = 0;
            break;
        case "WEP":
        case 1:
            message.auth = 1;
            break;
        case "WPA_PSK":
        case 2:
            message.auth = 2;
            break;
        case "WPA2_PSK":
        case 3:
            message.auth = 3;
            break;
        case "WPA_WPA2_PSK":
        case 4:
            message.auth = 4;
            break;
        case "WPA2_ENTERPRISE":
        case 5:
            message.auth = 5;
            break;
        case "WPA3_PSK":
        case 6:
            message.auth = 6;
            break;
        case "WPA2_WPA3_PSK":
        case 7:
            message.auth = 7;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from a WiFiScanResult message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WiFiScanResult
     * @static
     * @param {WiFiScanResult} message WiFiScanResult
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WiFiScanResult.toObject = function toObject(message, options) {
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
            object.channel = 0;
            object.rssi = 0;
            if (options.bytes === String)
                object.bssid = "";
            else {
                object.bssid = [];
                if (options.bytes !== Array)
                    object.bssid = $util.newBuffer(object.bssid);
            }
            object.auth = options.enums === String ? "Open" : 0;
        }
        if (message.ssid != null && message.hasOwnProperty("ssid"))
            object.ssid = options.bytes === String ? $util.base64.encode(message.ssid, 0, message.ssid.length) : options.bytes === Array ? Array.prototype.slice.call(message.ssid) : message.ssid;
        if (message.channel != null && message.hasOwnProperty("channel"))
            object.channel = message.channel;
        if (message.rssi != null && message.hasOwnProperty("rssi"))
            object.rssi = message.rssi;
        if (message.bssid != null && message.hasOwnProperty("bssid"))
            object.bssid = options.bytes === String ? $util.base64.encode(message.bssid, 0, message.bssid.length) : options.bytes === Array ? Array.prototype.slice.call(message.bssid) : message.bssid;
        if (message.auth != null && message.hasOwnProperty("auth"))
            object.auth = options.enums === String ? $root.WifiAuthMode[message.auth] === undefined ? message.auth : $root.WifiAuthMode[message.auth] : message.auth;
        return object;
    };

    /**
     * Converts this WiFiScanResult to JSON.
     * @function toJSON
     * @memberof WiFiScanResult
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WiFiScanResult.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for WiFiScanResult
     * @function getTypeUrl
     * @memberof WiFiScanResult
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    WiFiScanResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/WiFiScanResult";
    };

    return WiFiScanResult;
})();

$root.RespScanResult = (function() {

    /**
     * Properties of a RespScanResult.
     * @exports IRespScanResult
     * @interface IRespScanResult
     * @property {Array.<IWiFiScanResult>|null} [entries] RespScanResult entries
     */

    /**
     * Constructs a new RespScanResult.
     * @exports RespScanResult
     * @classdesc Represents a RespScanResult.
     * @implements IRespScanResult
     * @constructor
     * @param {IRespScanResult=} [properties] Properties to set
     */
    function RespScanResult(properties) {
        this.entries = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RespScanResult entries.
     * @member {Array.<IWiFiScanResult>} entries
     * @memberof RespScanResult
     * @instance
     */
    RespScanResult.prototype.entries = $util.emptyArray;

    /**
     * Creates a new RespScanResult instance using the specified properties.
     * @function create
     * @memberof RespScanResult
     * @static
     * @param {IRespScanResult=} [properties] Properties to set
     * @returns {RespScanResult} RespScanResult instance
     */
    RespScanResult.create = function create(properties) {
        return new RespScanResult(properties);
    };

    /**
     * Encodes the specified RespScanResult message. Does not implicitly {@link RespScanResult.verify|verify} messages.
     * @function encode
     * @memberof RespScanResult
     * @static
     * @param {IRespScanResult} message RespScanResult message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RespScanResult.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.entries != null && message.entries.length)
            for (var i = 0; i < message.entries.length; ++i)
                $root.WiFiScanResult.encode(message.entries[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified RespScanResult message, length delimited. Does not implicitly {@link RespScanResult.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RespScanResult
     * @static
     * @param {IRespScanResult} message RespScanResult message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RespScanResult.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RespScanResult message from the specified reader or buffer.
     * @function decode
     * @memberof RespScanResult
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RespScanResult} RespScanResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RespScanResult.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RespScanResult();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    if (!(message.entries && message.entries.length))
                        message.entries = [];
                    message.entries.push($root.WiFiScanResult.decode(reader, reader.uint32()));
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
     * Decodes a RespScanResult message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RespScanResult
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RespScanResult} RespScanResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RespScanResult.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RespScanResult message.
     * @function verify
     * @memberof RespScanResult
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RespScanResult.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.entries != null && message.hasOwnProperty("entries")) {
            if (!Array.isArray(message.entries))
                return "entries: array expected";
            for (var i = 0; i < message.entries.length; ++i) {
                var error = $root.WiFiScanResult.verify(message.entries[i]);
                if (error)
                    return "entries." + error;
            }
        }
        return null;
    };

    /**
     * Creates a RespScanResult message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RespScanResult
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RespScanResult} RespScanResult
     */
    RespScanResult.fromObject = function fromObject(object) {
        if (object instanceof $root.RespScanResult)
            return object;
        var message = new $root.RespScanResult();
        if (object.entries) {
            if (!Array.isArray(object.entries))
                throw TypeError(".RespScanResult.entries: array expected");
            message.entries = [];
            for (var i = 0; i < object.entries.length; ++i) {
                if (typeof object.entries[i] !== "object")
                    throw TypeError(".RespScanResult.entries: object expected");
                message.entries[i] = $root.WiFiScanResult.fromObject(object.entries[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a RespScanResult message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RespScanResult
     * @static
     * @param {RespScanResult} message RespScanResult
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RespScanResult.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.entries = [];
        if (message.entries && message.entries.length) {
            object.entries = [];
            for (var j = 0; j < message.entries.length; ++j)
                object.entries[j] = $root.WiFiScanResult.toObject(message.entries[j], options);
        }
        return object;
    };

    /**
     * Converts this RespScanResult to JSON.
     * @function toJSON
     * @memberof RespScanResult
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RespScanResult.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RespScanResult
     * @function getTypeUrl
     * @memberof RespScanResult
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RespScanResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RespScanResult";
    };

    return RespScanResult;
})();

/**
 * WiFiScanMsgType enum.
 * @exports WiFiScanMsgType
 * @enum {number}
 * @property {number} TypeCmdScanStart=0 TypeCmdScanStart value
 * @property {number} TypeRespScanStart=1 TypeRespScanStart value
 * @property {number} TypeCmdScanStatus=2 TypeCmdScanStatus value
 * @property {number} TypeRespScanStatus=3 TypeRespScanStatus value
 * @property {number} TypeCmdScanResult=4 TypeCmdScanResult value
 * @property {number} TypeRespScanResult=5 TypeRespScanResult value
 */
$root.WiFiScanMsgType = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "TypeCmdScanStart"] = 0;
    values[valuesById[1] = "TypeRespScanStart"] = 1;
    values[valuesById[2] = "TypeCmdScanStatus"] = 2;
    values[valuesById[3] = "TypeRespScanStatus"] = 3;
    values[valuesById[4] = "TypeCmdScanResult"] = 4;
    values[valuesById[5] = "TypeRespScanResult"] = 5;
    return values;
})();

$root.WiFiScanPayload = (function() {

    /**
     * Properties of a WiFiScanPayload.
     * @exports IWiFiScanPayload
     * @interface IWiFiScanPayload
     * @property {WiFiScanMsgType|null} [msg] WiFiScanPayload msg
     * @property {Status|null} [status] WiFiScanPayload status
     * @property {ICmdScanStart|null} [cmdScanStart] WiFiScanPayload cmdScanStart
     * @property {IRespScanStart|null} [respScanStart] WiFiScanPayload respScanStart
     * @property {ICmdScanStatus|null} [cmdScanStatus] WiFiScanPayload cmdScanStatus
     * @property {IRespScanStatus|null} [respScanStatus] WiFiScanPayload respScanStatus
     * @property {ICmdScanResult|null} [cmdScanResult] WiFiScanPayload cmdScanResult
     * @property {IRespScanResult|null} [respScanResult] WiFiScanPayload respScanResult
     */

    /**
     * Constructs a new WiFiScanPayload.
     * @exports WiFiScanPayload
     * @classdesc Represents a WiFiScanPayload.
     * @implements IWiFiScanPayload
     * @constructor
     * @param {IWiFiScanPayload=} [properties] Properties to set
     */
    function WiFiScanPayload(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WiFiScanPayload msg.
     * @member {WiFiScanMsgType} msg
     * @memberof WiFiScanPayload
     * @instance
     */
    WiFiScanPayload.prototype.msg = 0;

    /**
     * WiFiScanPayload status.
     * @member {Status} status
     * @memberof WiFiScanPayload
     * @instance
     */
    WiFiScanPayload.prototype.status = 0;

    /**
     * WiFiScanPayload cmdScanStart.
     * @member {ICmdScanStart|null|undefined} cmdScanStart
     * @memberof WiFiScanPayload
     * @instance
     */
    WiFiScanPayload.prototype.cmdScanStart = null;

    /**
     * WiFiScanPayload respScanStart.
     * @member {IRespScanStart|null|undefined} respScanStart
     * @memberof WiFiScanPayload
     * @instance
     */
    WiFiScanPayload.prototype.respScanStart = null;

    /**
     * WiFiScanPayload cmdScanStatus.
     * @member {ICmdScanStatus|null|undefined} cmdScanStatus
     * @memberof WiFiScanPayload
     * @instance
     */
    WiFiScanPayload.prototype.cmdScanStatus = null;

    /**
     * WiFiScanPayload respScanStatus.
     * @member {IRespScanStatus|null|undefined} respScanStatus
     * @memberof WiFiScanPayload
     * @instance
     */
    WiFiScanPayload.prototype.respScanStatus = null;

    /**
     * WiFiScanPayload cmdScanResult.
     * @member {ICmdScanResult|null|undefined} cmdScanResult
     * @memberof WiFiScanPayload
     * @instance
     */
    WiFiScanPayload.prototype.cmdScanResult = null;

    /**
     * WiFiScanPayload respScanResult.
     * @member {IRespScanResult|null|undefined} respScanResult
     * @memberof WiFiScanPayload
     * @instance
     */
    WiFiScanPayload.prototype.respScanResult = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * WiFiScanPayload payload.
     * @member {"cmdScanStart"|"respScanStart"|"cmdScanStatus"|"respScanStatus"|"cmdScanResult"|"respScanResult"|undefined} payload
     * @memberof WiFiScanPayload
     * @instance
     */
    Object.defineProperty(WiFiScanPayload.prototype, "payload", {
        get: $util.oneOfGetter($oneOfFields = ["cmdScanStart", "respScanStart", "cmdScanStatus", "respScanStatus", "cmdScanResult", "respScanResult"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new WiFiScanPayload instance using the specified properties.
     * @function create
     * @memberof WiFiScanPayload
     * @static
     * @param {IWiFiScanPayload=} [properties] Properties to set
     * @returns {WiFiScanPayload} WiFiScanPayload instance
     */
    WiFiScanPayload.create = function create(properties) {
        return new WiFiScanPayload(properties);
    };

    /**
     * Encodes the specified WiFiScanPayload message. Does not implicitly {@link WiFiScanPayload.verify|verify} messages.
     * @function encode
     * @memberof WiFiScanPayload
     * @static
     * @param {IWiFiScanPayload} message WiFiScanPayload message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WiFiScanPayload.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.msg);
        if (message.status != null && Object.hasOwnProperty.call(message, "status"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.status);
        if (message.cmdScanStart != null && Object.hasOwnProperty.call(message, "cmdScanStart"))
            $root.CmdScanStart.encode(message.cmdScanStart, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
        if (message.respScanStart != null && Object.hasOwnProperty.call(message, "respScanStart"))
            $root.RespScanStart.encode(message.respScanStart, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
        if (message.cmdScanStatus != null && Object.hasOwnProperty.call(message, "cmdScanStatus"))
            $root.CmdScanStatus.encode(message.cmdScanStatus, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
        if (message.respScanStatus != null && Object.hasOwnProperty.call(message, "respScanStatus"))
            $root.RespScanStatus.encode(message.respScanStatus, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
        if (message.cmdScanResult != null && Object.hasOwnProperty.call(message, "cmdScanResult"))
            $root.CmdScanResult.encode(message.cmdScanResult, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
        if (message.respScanResult != null && Object.hasOwnProperty.call(message, "respScanResult"))
            $root.RespScanResult.encode(message.respScanResult, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified WiFiScanPayload message, length delimited. Does not implicitly {@link WiFiScanPayload.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WiFiScanPayload
     * @static
     * @param {IWiFiScanPayload} message WiFiScanPayload message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WiFiScanPayload.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WiFiScanPayload message from the specified reader or buffer.
     * @function decode
     * @memberof WiFiScanPayload
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WiFiScanPayload} WiFiScanPayload
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WiFiScanPayload.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WiFiScanPayload();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.msg = reader.int32();
                    break;
                }
            case 2: {
                    message.status = reader.int32();
                    break;
                }
            case 10: {
                    message.cmdScanStart = $root.CmdScanStart.decode(reader, reader.uint32());
                    break;
                }
            case 11: {
                    message.respScanStart = $root.RespScanStart.decode(reader, reader.uint32());
                    break;
                }
            case 12: {
                    message.cmdScanStatus = $root.CmdScanStatus.decode(reader, reader.uint32());
                    break;
                }
            case 13: {
                    message.respScanStatus = $root.RespScanStatus.decode(reader, reader.uint32());
                    break;
                }
            case 14: {
                    message.cmdScanResult = $root.CmdScanResult.decode(reader, reader.uint32());
                    break;
                }
            case 15: {
                    message.respScanResult = $root.RespScanResult.decode(reader, reader.uint32());
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
     * Decodes a WiFiScanPayload message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WiFiScanPayload
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WiFiScanPayload} WiFiScanPayload
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WiFiScanPayload.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WiFiScanPayload message.
     * @function verify
     * @memberof WiFiScanPayload
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WiFiScanPayload.verify = function verify(message) {
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
        if (message.cmdScanStart != null && message.hasOwnProperty("cmdScanStart")) {
            properties.payload = 1;
            {
                var error = $root.CmdScanStart.verify(message.cmdScanStart);
                if (error)
                    return "cmdScanStart." + error;
            }
        }
        if (message.respScanStart != null && message.hasOwnProperty("respScanStart")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                var error = $root.RespScanStart.verify(message.respScanStart);
                if (error)
                    return "respScanStart." + error;
            }
        }
        if (message.cmdScanStatus != null && message.hasOwnProperty("cmdScanStatus")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                var error = $root.CmdScanStatus.verify(message.cmdScanStatus);
                if (error)
                    return "cmdScanStatus." + error;
            }
        }
        if (message.respScanStatus != null && message.hasOwnProperty("respScanStatus")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                var error = $root.RespScanStatus.verify(message.respScanStatus);
                if (error)
                    return "respScanStatus." + error;
            }
        }
        if (message.cmdScanResult != null && message.hasOwnProperty("cmdScanResult")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                var error = $root.CmdScanResult.verify(message.cmdScanResult);
                if (error)
                    return "cmdScanResult." + error;
            }
        }
        if (message.respScanResult != null && message.hasOwnProperty("respScanResult")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                var error = $root.RespScanResult.verify(message.respScanResult);
                if (error)
                    return "respScanResult." + error;
            }
        }
        return null;
    };

    /**
     * Creates a WiFiScanPayload message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WiFiScanPayload
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WiFiScanPayload} WiFiScanPayload
     */
    WiFiScanPayload.fromObject = function fromObject(object) {
        if (object instanceof $root.WiFiScanPayload)
            return object;
        var message = new $root.WiFiScanPayload();
        switch (object.msg) {
        default:
            if (typeof object.msg === "number") {
                message.msg = object.msg;
                break;
            }
            break;
        case "TypeCmdScanStart":
        case 0:
            message.msg = 0;
            break;
        case "TypeRespScanStart":
        case 1:
            message.msg = 1;
            break;
        case "TypeCmdScanStatus":
        case 2:
            message.msg = 2;
            break;
        case "TypeRespScanStatus":
        case 3:
            message.msg = 3;
            break;
        case "TypeCmdScanResult":
        case 4:
            message.msg = 4;
            break;
        case "TypeRespScanResult":
        case 5:
            message.msg = 5;
            break;
        }
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
        if (object.cmdScanStart != null) {
            if (typeof object.cmdScanStart !== "object")
                throw TypeError(".WiFiScanPayload.cmdScanStart: object expected");
            message.cmdScanStart = $root.CmdScanStart.fromObject(object.cmdScanStart);
        }
        if (object.respScanStart != null) {
            if (typeof object.respScanStart !== "object")
                throw TypeError(".WiFiScanPayload.respScanStart: object expected");
            message.respScanStart = $root.RespScanStart.fromObject(object.respScanStart);
        }
        if (object.cmdScanStatus != null) {
            if (typeof object.cmdScanStatus !== "object")
                throw TypeError(".WiFiScanPayload.cmdScanStatus: object expected");
            message.cmdScanStatus = $root.CmdScanStatus.fromObject(object.cmdScanStatus);
        }
        if (object.respScanStatus != null) {
            if (typeof object.respScanStatus !== "object")
                throw TypeError(".WiFiScanPayload.respScanStatus: object expected");
            message.respScanStatus = $root.RespScanStatus.fromObject(object.respScanStatus);
        }
        if (object.cmdScanResult != null) {
            if (typeof object.cmdScanResult !== "object")
                throw TypeError(".WiFiScanPayload.cmdScanResult: object expected");
            message.cmdScanResult = $root.CmdScanResult.fromObject(object.cmdScanResult);
        }
        if (object.respScanResult != null) {
            if (typeof object.respScanResult !== "object")
                throw TypeError(".WiFiScanPayload.respScanResult: object expected");
            message.respScanResult = $root.RespScanResult.fromObject(object.respScanResult);
        }
        return message;
    };

    /**
     * Creates a plain object from a WiFiScanPayload message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WiFiScanPayload
     * @static
     * @param {WiFiScanPayload} message WiFiScanPayload
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WiFiScanPayload.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.msg = options.enums === String ? "TypeCmdScanStart" : 0;
            object.status = options.enums === String ? "Success" : 0;
        }
        if (message.msg != null && message.hasOwnProperty("msg"))
            object.msg = options.enums === String ? $root.WiFiScanMsgType[message.msg] === undefined ? message.msg : $root.WiFiScanMsgType[message.msg] : message.msg;
        if (message.status != null && message.hasOwnProperty("status"))
            object.status = options.enums === String ? $root.Status[message.status] === undefined ? message.status : $root.Status[message.status] : message.status;
        if (message.cmdScanStart != null && message.hasOwnProperty("cmdScanStart")) {
            object.cmdScanStart = $root.CmdScanStart.toObject(message.cmdScanStart, options);
            if (options.oneofs)
                object.payload = "cmdScanStart";
        }
        if (message.respScanStart != null && message.hasOwnProperty("respScanStart")) {
            object.respScanStart = $root.RespScanStart.toObject(message.respScanStart, options);
            if (options.oneofs)
                object.payload = "respScanStart";
        }
        if (message.cmdScanStatus != null && message.hasOwnProperty("cmdScanStatus")) {
            object.cmdScanStatus = $root.CmdScanStatus.toObject(message.cmdScanStatus, options);
            if (options.oneofs)
                object.payload = "cmdScanStatus";
        }
        if (message.respScanStatus != null && message.hasOwnProperty("respScanStatus")) {
            object.respScanStatus = $root.RespScanStatus.toObject(message.respScanStatus, options);
            if (options.oneofs)
                object.payload = "respScanStatus";
        }
        if (message.cmdScanResult != null && message.hasOwnProperty("cmdScanResult")) {
            object.cmdScanResult = $root.CmdScanResult.toObject(message.cmdScanResult, options);
            if (options.oneofs)
                object.payload = "cmdScanResult";
        }
        if (message.respScanResult != null && message.hasOwnProperty("respScanResult")) {
            object.respScanResult = $root.RespScanResult.toObject(message.respScanResult, options);
            if (options.oneofs)
                object.payload = "respScanResult";
        }
        return object;
    };

    /**
     * Converts this WiFiScanPayload to JSON.
     * @function toJSON
     * @memberof WiFiScanPayload
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WiFiScanPayload.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for WiFiScanPayload
     * @function getTypeUrl
     * @memberof WiFiScanPayload
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    WiFiScanPayload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/WiFiScanPayload";
    };

    return WiFiScanPayload;
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
