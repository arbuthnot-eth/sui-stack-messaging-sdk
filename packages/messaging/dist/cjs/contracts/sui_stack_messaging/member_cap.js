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
var member_cap_exports = {};
__export(member_cap_exports, {
  MemberCap: () => MemberCap,
  channelId: () => channelId,
  transferMemberCaps: () => transferMemberCaps,
  transferToRecipient: () => transferToRecipient
});
module.exports = __toCommonJS(member_cap_exports);
var import_utils = require("../utils/index.js");
var import_bcs = require("@mysten/sui/bcs");
var object = __toESM(require("./deps/sui/object.js"));
const $moduleName = "@local-pkg/sui-stack-messaging::member_cap";
const MemberCap = new import_utils.MoveStruct({
  name: `${$moduleName}::MemberCap`,
  fields: {
    id: object.UID,
    channel_id: import_bcs.bcs.Address
  }
});
function transferToRecipient(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `${packageAddress}::member_cap::MemberCap`,
    `${packageAddress}::creator_cap::CreatorCap`,
    "address"
  ];
  const parameterNames = ["cap", "creatorCap", "recipient"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "member_cap",
    function: "transfer_to_recipient",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
function transferMemberCaps(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    "vector<address>",
    `vector<${packageAddress}::member_cap::MemberCap>`,
    `${packageAddress}::creator_cap::CreatorCap`
  ];
  const parameterNames = ["memberAddresses", "memberCaps", "creatorCap"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "member_cap",
    function: "transfer_member_caps",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
function channelId(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::member_cap::MemberCap`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "member_cap",
    function: "channel_id",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
//# sourceMappingURL=member_cap.js.map
