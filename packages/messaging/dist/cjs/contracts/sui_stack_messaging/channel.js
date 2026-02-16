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
var channel_exports = {};
__export(channel_exports, {
  Channel: () => Channel,
  SimpleMessenger: () => SimpleMessenger,
  _new: () => _new,
  addEncryptedKey: () => addEncryptedKey,
  addMembers: () => addMembers,
  namespace: () => namespace,
  removeMembers: () => removeMembers,
  sendMessage: () => sendMessage,
  share: () => share
});
module.exports = __toCommonJS(channel_exports);
var import_utils = require("../utils/index.js");
var import_bcs = require("@mysten/sui/bcs");
var object = __toESM(require("./deps/sui/object.js"));
var auth = __toESM(require("./auth.js"));
var table_vec = __toESM(require("./deps/sui/table_vec.js"));
var message = __toESM(require("./message.js"));
var encryption_key_history = __toESM(require("./encryption_key_history.js"));
const $moduleName = "@local-pkg/sui-stack-messaging::channel";
const Channel = new import_utils.MoveStruct({
  name: `${$moduleName}::Channel`,
  fields: {
    id: object.UID,
    /** The version of this object, for handling updgrades. */
    version: import_bcs.bcs.u64(),
    /**
     * The Authorization struct, gating actions to member permissions. Note: It also,
     * practically, keeps tracks of the members (MemberCap ID -> Permissions)
     */
    auth: auth.Auth,
    /**
     * The message history of the channel.
     *
     * Using `TableVec` to avoid the object size limit.
     */
    messages: table_vec.TableVec,
    /**
     * The total number of messages, for efficiency, so that we don't have to make a
     * call to messages.length() (Maybe I am overthinking this, need to measure)
     */
    messages_count: import_bcs.bcs.u64(),
    /**
     * A duplicate of the last entry of the messages TableVec,
     *
     * Utilize this for efficient fetching e.g. list of conversations showing the
     * latest message and the user who sent it
     */
    last_message: import_bcs.bcs.option(message.Message),
    /** The timestamp (in milliseconds) when the channel was created. */
    created_at_ms: import_bcs.bcs.u64(),
    /**
     * The timestamp (in milliseconds) when the channel was last updated. (e.g. change
     * in metadata, members, admins, keys)
     */
    updated_at_ms: import_bcs.bcs.u64(),
    /**
     * History of Encryption keys
     *
     * Holds the latest key, the latest_version, and a TableVec of the historical keys
     */
    encryption_key_history: encryption_key_history.EncryptionKeyHistory
  }
});
const SimpleMessenger = new import_utils.MoveTuple({
  name: `${$moduleName}::SimpleMessenger`,
  fields: [import_bcs.bcs.bool()]
});
function _new(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<${packageAddress}::config::Config>`,
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock"
  ];
  const parameterNames = ["config", "clock"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "new",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
function share(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `${packageAddress}::channel::Channel`,
    `${packageAddress}::creator_cap::CreatorCap`
  ];
  const parameterNames = ["self", "creatorCap"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "share",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
function addEncryptedKey(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `${packageAddress}::channel::Channel`,
    `${packageAddress}::member_cap::MemberCap`,
    "vector<u8>"
  ];
  const parameterNames = ["self", "memberCap", "newEncryptionKeyBytes"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "add_encrypted_key",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
function addMembers(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `${packageAddress}::channel::Channel`,
    `${packageAddress}::member_cap::MemberCap`,
    "u64",
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock"
  ];
  const parameterNames = ["self", "memberCap", "n", "clock"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "add_members",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
function removeMembers(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `${packageAddress}::channel::Channel`,
    `${packageAddress}::member_cap::MemberCap`,
    "vector<0x0000000000000000000000000000000000000000000000000000000000000002::object::ID>",
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock"
  ];
  const parameterNames = ["self", "memberCap", "membersToRemove", "clock"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "remove_members",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
function sendMessage(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `${packageAddress}::channel::Channel`,
    `${packageAddress}::member_cap::MemberCap`,
    "vector<u8>",
    "vector<u8>",
    `vector<${packageAddress}::attachment::Attachment>`,
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock"
  ];
  const parameterNames = ["self", "memberCap", "ciphertext", "nonce", "attachments", "clock"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "send_message",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
function namespace(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::channel::Channel`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "namespace",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
//# sourceMappingURL=channel.js.map
