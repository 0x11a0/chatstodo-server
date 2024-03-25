// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var chatstodo_ml_service_pb = require('./chatstodo_ml_service_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_chatstodo_ml_service_ChatAnalysisResponse(arg) {
  if (!(arg instanceof chatstodo_ml_service_pb.ChatAnalysisResponse)) {
    throw new Error('Expected argument of type chatstodo_ml_service.ChatAnalysisResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chatstodo_ml_service_ChatAnalysisResponse(buffer_arg) {
  return chatstodo_ml_service_pb.ChatAnalysisResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chatstodo_ml_service_UserChatRequest(arg) {
  if (!(arg instanceof chatstodo_ml_service_pb.UserChatRequest)) {
    throw new Error('Expected argument of type chatstodo_ml_service.UserChatRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chatstodo_ml_service_UserChatRequest(buffer_arg) {
  return chatstodo_ml_service_pb.UserChatRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// Define the service
var ChatAnalysisServiceService = exports.ChatAnalysisServiceService = {
  analyzeChat: {
    path: '/chatstodo_ml_service.ChatAnalysisService/AnalyzeChat',
    requestStream: false,
    responseStream: false,
    requestType: chatstodo_ml_service_pb.UserChatRequest,
    responseType: chatstodo_ml_service_pb.ChatAnalysisResponse,
    requestSerialize: serialize_chatstodo_ml_service_UserChatRequest,
    requestDeserialize: deserialize_chatstodo_ml_service_UserChatRequest,
    responseSerialize: serialize_chatstodo_ml_service_ChatAnalysisResponse,
    responseDeserialize: deserialize_chatstodo_ml_service_ChatAnalysisResponse,
  },
};

exports.ChatAnalysisServiceClient = grpc.makeGenericClientConstructor(ChatAnalysisServiceService);
