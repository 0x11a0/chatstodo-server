// source: chatstodo_ml_service.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = (function() {
  if (this) { return this; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  if (typeof self !== 'undefined') { return self; }
  return Function('return this')();
}.call(null));

var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
goog.object.extend(proto, google_protobuf_timestamp_pb);
goog.exportSymbol('proto.chatstodo_ml_service.Chat', null, global);
goog.exportSymbol('proto.chatstodo_ml_service.ChatAnalysisResponse', null, global);
goog.exportSymbol('proto.chatstodo_ml_service.EventDetail', null, global);
goog.exportSymbol('proto.chatstodo_ml_service.UserChatRequest', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.chatstodo_ml_service.Chat = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.chatstodo_ml_service.Chat, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.chatstodo_ml_service.Chat.displayName = 'proto.chatstodo_ml_service.Chat';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.chatstodo_ml_service.UserChatRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.chatstodo_ml_service.UserChatRequest.repeatedFields_, null);
};
goog.inherits(proto.chatstodo_ml_service.UserChatRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.chatstodo_ml_service.UserChatRequest.displayName = 'proto.chatstodo_ml_service.UserChatRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.chatstodo_ml_service.EventDetail = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.chatstodo_ml_service.EventDetail, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.chatstodo_ml_service.EventDetail.displayName = 'proto.chatstodo_ml_service.EventDetail';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.chatstodo_ml_service.ChatAnalysisResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.chatstodo_ml_service.ChatAnalysisResponse.repeatedFields_, null);
};
goog.inherits(proto.chatstodo_ml_service.ChatAnalysisResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.chatstodo_ml_service.ChatAnalysisResponse.displayName = 'proto.chatstodo_ml_service.ChatAnalysisResponse';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.chatstodo_ml_service.Chat.prototype.toObject = function(opt_includeInstance) {
  return proto.chatstodo_ml_service.Chat.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.chatstodo_ml_service.Chat} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.chatstodo_ml_service.Chat.toObject = function(includeInstance, msg) {
  var f, obj = {
    userId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    chatMessage: jspb.Message.getFieldWithDefault(msg, 2, ""),
    timestamp: (f = msg.getTimestamp()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.chatstodo_ml_service.Chat}
 */
proto.chatstodo_ml_service.Chat.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.chatstodo_ml_service.Chat;
  return proto.chatstodo_ml_service.Chat.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.chatstodo_ml_service.Chat} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.chatstodo_ml_service.Chat}
 */
proto.chatstodo_ml_service.Chat.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setUserId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setChatMessage(value);
      break;
    case 3:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setTimestamp(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.chatstodo_ml_service.Chat.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.chatstodo_ml_service.Chat.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.chatstodo_ml_service.Chat} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.chatstodo_ml_service.Chat.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUserId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getChatMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getTimestamp();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional string user_id = 1;
 * @return {string}
 */
proto.chatstodo_ml_service.Chat.prototype.getUserId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.chatstodo_ml_service.Chat} returns this
 */
proto.chatstodo_ml_service.Chat.prototype.setUserId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string chat_message = 2;
 * @return {string}
 */
proto.chatstodo_ml_service.Chat.prototype.getChatMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.chatstodo_ml_service.Chat} returns this
 */
proto.chatstodo_ml_service.Chat.prototype.setChatMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.Timestamp timestamp = 3;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.chatstodo_ml_service.Chat.prototype.getTimestamp = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 3));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.chatstodo_ml_service.Chat} returns this
*/
proto.chatstodo_ml_service.Chat.prototype.setTimestamp = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.chatstodo_ml_service.Chat} returns this
 */
proto.chatstodo_ml_service.Chat.prototype.clearTimestamp = function() {
  return this.setTimestamp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.chatstodo_ml_service.Chat.prototype.hasTimestamp = function() {
  return jspb.Message.getField(this, 3) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.chatstodo_ml_service.UserChatRequest.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.chatstodo_ml_service.UserChatRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.chatstodo_ml_service.UserChatRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.chatstodo_ml_service.UserChatRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.chatstodo_ml_service.UserChatRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    userId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    timestamp: (f = msg.getTimestamp()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    messageTextList: jspb.Message.toObjectList(msg.getMessageTextList(),
    proto.chatstodo_ml_service.Chat.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.chatstodo_ml_service.UserChatRequest}
 */
proto.chatstodo_ml_service.UserChatRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.chatstodo_ml_service.UserChatRequest;
  return proto.chatstodo_ml_service.UserChatRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.chatstodo_ml_service.UserChatRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.chatstodo_ml_service.UserChatRequest}
 */
proto.chatstodo_ml_service.UserChatRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setUserId(value);
      break;
    case 2:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setTimestamp(value);
      break;
    case 3:
      var value = new proto.chatstodo_ml_service.Chat;
      reader.readMessage(value,proto.chatstodo_ml_service.Chat.deserializeBinaryFromReader);
      msg.addMessageText(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.chatstodo_ml_service.UserChatRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.chatstodo_ml_service.UserChatRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.chatstodo_ml_service.UserChatRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.chatstodo_ml_service.UserChatRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUserId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTimestamp();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getMessageTextList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.chatstodo_ml_service.Chat.serializeBinaryToWriter
    );
  }
};


/**
 * optional string user_id = 1;
 * @return {string}
 */
proto.chatstodo_ml_service.UserChatRequest.prototype.getUserId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.chatstodo_ml_service.UserChatRequest} returns this
 */
proto.chatstodo_ml_service.UserChatRequest.prototype.setUserId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.Timestamp timestamp = 2;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.chatstodo_ml_service.UserChatRequest.prototype.getTimestamp = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 2));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.chatstodo_ml_service.UserChatRequest} returns this
*/
proto.chatstodo_ml_service.UserChatRequest.prototype.setTimestamp = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.chatstodo_ml_service.UserChatRequest} returns this
 */
proto.chatstodo_ml_service.UserChatRequest.prototype.clearTimestamp = function() {
  return this.setTimestamp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.chatstodo_ml_service.UserChatRequest.prototype.hasTimestamp = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * repeated Chat message_text = 3;
 * @return {!Array<!proto.chatstodo_ml_service.Chat>}
 */
proto.chatstodo_ml_service.UserChatRequest.prototype.getMessageTextList = function() {
  return /** @type{!Array<!proto.chatstodo_ml_service.Chat>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.chatstodo_ml_service.Chat, 3));
};


/**
 * @param {!Array<!proto.chatstodo_ml_service.Chat>} value
 * @return {!proto.chatstodo_ml_service.UserChatRequest} returns this
*/
proto.chatstodo_ml_service.UserChatRequest.prototype.setMessageTextList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.chatstodo_ml_service.Chat=} opt_value
 * @param {number=} opt_index
 * @return {!proto.chatstodo_ml_service.Chat}
 */
proto.chatstodo_ml_service.UserChatRequest.prototype.addMessageText = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.chatstodo_ml_service.Chat, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.chatstodo_ml_service.UserChatRequest} returns this
 */
proto.chatstodo_ml_service.UserChatRequest.prototype.clearMessageTextList = function() {
  return this.setMessageTextList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.chatstodo_ml_service.EventDetail.prototype.toObject = function(opt_includeInstance) {
  return proto.chatstodo_ml_service.EventDetail.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.chatstodo_ml_service.EventDetail} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.chatstodo_ml_service.EventDetail.toObject = function(includeInstance, msg) {
  var f, obj = {
    event: jspb.Message.getFieldWithDefault(msg, 1, ""),
    location: jspb.Message.getFieldWithDefault(msg, 2, ""),
    time: jspb.Message.getFieldWithDefault(msg, 3, ""),
    date: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.chatstodo_ml_service.EventDetail}
 */
proto.chatstodo_ml_service.EventDetail.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.chatstodo_ml_service.EventDetail;
  return proto.chatstodo_ml_service.EventDetail.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.chatstodo_ml_service.EventDetail} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.chatstodo_ml_service.EventDetail}
 */
proto.chatstodo_ml_service.EventDetail.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setEvent(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLocation(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setTime(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setDate(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.chatstodo_ml_service.EventDetail.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.chatstodo_ml_service.EventDetail.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.chatstodo_ml_service.EventDetail} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.chatstodo_ml_service.EventDetail.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEvent();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getLocation();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getTime();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getDate();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string event = 1;
 * @return {string}
 */
proto.chatstodo_ml_service.EventDetail.prototype.getEvent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.chatstodo_ml_service.EventDetail} returns this
 */
proto.chatstodo_ml_service.EventDetail.prototype.setEvent = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string location = 2;
 * @return {string}
 */
proto.chatstodo_ml_service.EventDetail.prototype.getLocation = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.chatstodo_ml_service.EventDetail} returns this
 */
proto.chatstodo_ml_service.EventDetail.prototype.setLocation = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string time = 3;
 * @return {string}
 */
proto.chatstodo_ml_service.EventDetail.prototype.getTime = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.chatstodo_ml_service.EventDetail} returns this
 */
proto.chatstodo_ml_service.EventDetail.prototype.setTime = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string date = 4;
 * @return {string}
 */
proto.chatstodo_ml_service.EventDetail.prototype.getDate = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.chatstodo_ml_service.EventDetail} returns this
 */
proto.chatstodo_ml_service.EventDetail.prototype.setDate = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.repeatedFields_ = [3,4,5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.chatstodo_ml_service.ChatAnalysisResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.chatstodo_ml_service.ChatAnalysisResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    userid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    timestamp: (f = msg.getTimestamp()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    summaryList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
    tasksList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f,
    eventsList: jspb.Message.toObjectList(msg.getEventsList(),
    proto.chatstodo_ml_service.EventDetail.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.chatstodo_ml_service.ChatAnalysisResponse}
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.chatstodo_ml_service.ChatAnalysisResponse;
  return proto.chatstodo_ml_service.ChatAnalysisResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.chatstodo_ml_service.ChatAnalysisResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.chatstodo_ml_service.ChatAnalysisResponse}
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setUserid(value);
      break;
    case 2:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setTimestamp(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.addSummary(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.addTasks(value);
      break;
    case 5:
      var value = new proto.chatstodo_ml_service.EventDetail;
      reader.readMessage(value,proto.chatstodo_ml_service.EventDetail.deserializeBinaryFromReader);
      msg.addEvents(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.chatstodo_ml_service.ChatAnalysisResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.chatstodo_ml_service.ChatAnalysisResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUserid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTimestamp();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getSummaryList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      3,
      f
    );
  }
  f = message.getTasksList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      4,
      f
    );
  }
  f = message.getEventsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      5,
      f,
      proto.chatstodo_ml_service.EventDetail.serializeBinaryToWriter
    );
  }
};


/**
 * optional string userID = 1;
 * @return {string}
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.getUserid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.chatstodo_ml_service.ChatAnalysisResponse} returns this
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.setUserid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.Timestamp timestamp = 2;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.getTimestamp = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 2));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.chatstodo_ml_service.ChatAnalysisResponse} returns this
*/
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.setTimestamp = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.chatstodo_ml_service.ChatAnalysisResponse} returns this
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.clearTimestamp = function() {
  return this.setTimestamp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.hasTimestamp = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * repeated string summary = 3;
 * @return {!Array<string>}
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.getSummaryList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.chatstodo_ml_service.ChatAnalysisResponse} returns this
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.setSummaryList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.chatstodo_ml_service.ChatAnalysisResponse} returns this
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.addSummary = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.chatstodo_ml_service.ChatAnalysisResponse} returns this
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.clearSummaryList = function() {
  return this.setSummaryList([]);
};


/**
 * repeated string tasks = 4;
 * @return {!Array<string>}
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.getTasksList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.chatstodo_ml_service.ChatAnalysisResponse} returns this
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.setTasksList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.chatstodo_ml_service.ChatAnalysisResponse} returns this
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.addTasks = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.chatstodo_ml_service.ChatAnalysisResponse} returns this
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.clearTasksList = function() {
  return this.setTasksList([]);
};


/**
 * repeated EventDetail events = 5;
 * @return {!Array<!proto.chatstodo_ml_service.EventDetail>}
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.getEventsList = function() {
  return /** @type{!Array<!proto.chatstodo_ml_service.EventDetail>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.chatstodo_ml_service.EventDetail, 5));
};


/**
 * @param {!Array<!proto.chatstodo_ml_service.EventDetail>} value
 * @return {!proto.chatstodo_ml_service.ChatAnalysisResponse} returns this
*/
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.setEventsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.chatstodo_ml_service.EventDetail=} opt_value
 * @param {number=} opt_index
 * @return {!proto.chatstodo_ml_service.EventDetail}
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.addEvents = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.chatstodo_ml_service.EventDetail, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.chatstodo_ml_service.ChatAnalysisResponse} returns this
 */
proto.chatstodo_ml_service.ChatAnalysisResponse.prototype.clearEventsList = function() {
  return this.setEventsList([]);
};


goog.object.extend(exports, proto.chatstodo_ml_service);