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
var encryption_key_history_exports = {};
__export(encryption_key_history_exports, {
  EditEncryptionKey: () => EditEncryptionKey,
  EncryptionKeyHistory: () => EncryptionKeyHistory
});
module.exports = __toCommonJS(encryption_key_history_exports);
var import_utils = require("../utils/index.js");
var import_bcs = require("@mysten/sui/bcs");
var table_vec = __toESM(require("./deps/sui/table_vec.js"));
const $moduleName = "@local-pkg/sui-stack-messaging::encryption_key_history";
const EncryptionKeyHistory = new import_utils.MoveStruct({
  name: `${$moduleName}::EncryptionKeyHistory`,
  fields: {
    latest: import_bcs.bcs.vector(import_bcs.bcs.u8()),
    latest_version: import_bcs.bcs.u32(),
    history: table_vec.TableVec
  }
});
const EditEncryptionKey = new import_utils.MoveTuple({
  name: `${$moduleName}::EditEncryptionKey`,
  fields: [import_bcs.bcs.bool()]
});
//# sourceMappingURL=encryption_key_history.js.map
