"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var attachment_exports = {};
__export(attachment_exports, {
  Attachment: () => Attachment,
  _new: () => _new,
  blobRef: () => blobRef,
  dataNonce: () => dataNonce
});
module.exports = __toCommonJS(attachment_exports);
var import_utils = require("../utils/index.js");
var import_bcs = require("@mysten/sui/bcs");
const $moduleName = "@local-pkg/sui-stack-messaging::attachment";
const Attachment = new import_utils.MoveStruct({
  name: `${$moduleName}::Attachment`,
  fields: {
    blob_ref: import_bcs.bcs.string(),
    encrypted_metadata: import_bcs.bcs.vector(import_bcs.bcs.u8()),
    data_nonce: import_bcs.bcs.vector(import_bcs.bcs.u8()),
    metadata_nonce: import_bcs.bcs.vector(import_bcs.bcs.u8()),
    key_version: import_bcs.bcs.u32()
  }
});
function _new(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    "0x0000000000000000000000000000000000000000000000000000000000000001::string::String",
    "vector<u8>",
    "vector<u8>",
    "vector<u8>",
    "u32"
  ];
  const parameterNames = [
    "blobRef",
    "encryptedMetadata",
    "dataNonce",
    "metadataNonce",
    "keyVersion"
  ];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "attachment",
    function: "new",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
function blobRef(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::attachment::Attachment`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "attachment",
    function: "blob_ref",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
function dataNonce(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::attachment::Attachment`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "attachment",
    function: "data_nonce",
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
//# sourceMappingURL=attachment.js.map
