"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var message_exports = {};
__export(message_exports, {
  Message: () => Message,
  MessageAddedEvent: () => MessageAddedEvent,
  _new: () => _new
});
module.exports = __toCommonJS(message_exports);
var import_utils = require("../utils/index.js");
var import_bcs = require("@mysten/sui/bcs");
var attachment = __toESM(require("./attachment.js"));
const $moduleName = "@local-pkg/sui-stack-messaging::message";
const Message = new import_utils.MoveStruct({
  name: `${$moduleName}::Message`,
  fields: {
    /** The address of the sender of this message. TODO: should we encrypt this as well? */
    sender: import_bcs.bcs.Address,
    /** The message content, encrypted with a DEK(Data Encryption Key) */
    ciphertext: import_bcs.bcs.vector(import_bcs.bcs.u8()),
    /** The nonce used for the encryption of the content. */
    nonce: import_bcs.bcs.vector(import_bcs.bcs.u8()),
    /**
     * The version of the DEK(Data Encryption Key) that was used to encrypt this
     * Message
     */
    key_version: import_bcs.bcs.u32(),
    /** A vector of attachments associated with this message. */
    attachments: import_bcs.bcs.vector(attachment.Attachment),
    /** Timestamp in milliseconds when the message was created. */
    created_at_ms: import_bcs.bcs.u64()
  }
});
const MessageAddedEvent = new import_utils.MoveStruct({
  name: `${$moduleName}::MessageAddedEvent`,
  fields: {
    channel_id: import_bcs.bcs.Address,
    message_index: import_bcs.bcs.u64(),
    sender: import_bcs.bcs.Address,
    ciphertext: import_bcs.bcs.vector(import_bcs.bcs.u8()),
    nonce: import_bcs.bcs.vector(import_bcs.bcs.u8()),
    key_version: import_bcs.bcs.u32(),
    attachment_refs: import_bcs.bcs.vector(import_bcs.bcs.string()),
    attachment_nonces: import_bcs.bcs.vector(import_bcs.bcs.vector(import_bcs.bcs.u8())),
    created_at_ms: import_bcs.bcs.u64()
  }
});
function _new(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    "address",
    "vector<u8>",
    "vector<u8>",
    "u32",
    `vector<${packageAddress}::attachment::Attachment>`,
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock"
  ];
  const parameterNames = ["sender", "ciphertext", "nonce", "keyVersion", "attachments", "clock"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "message",
    function: "new",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
//# sourceMappingURL=message.js.map
