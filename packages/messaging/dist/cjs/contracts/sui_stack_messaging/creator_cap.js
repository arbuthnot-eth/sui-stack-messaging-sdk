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
var creator_cap_exports = {};
__export(creator_cap_exports, {
  CreatorCap: () => CreatorCap,
  transferToSender: () => transferToSender
});
module.exports = __toCommonJS(creator_cap_exports);
var import_utils = require("../utils/index.js");
var import_bcs = require("@mysten/sui/bcs");
var object = __toESM(require("./deps/sui/object.js"));
const $moduleName = "@local-pkg/sui-stack-messaging::creator_cap";
const CreatorCap = new import_utils.MoveStruct({
  name: `${$moduleName}::CreatorCap`,
  fields: {
    id: object.UID,
    channel_id: import_bcs.bcs.Address
  }
});
function transferToSender(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::creator_cap::CreatorCap`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "creator_cap",
    function: "transfer_to_sender",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
//# sourceMappingURL=creator_cap.js.map
