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
var auth_exports = {};
__export(auth_exports, {
  Auth: () => Auth,
  EditPermissions: () => EditPermissions
});
module.exports = __toCommonJS(auth_exports);
var import_utils = require("../utils/index.js");
var import_bcs = require("@mysten/sui/bcs");
var vec_map = __toESM(require("./deps/sui/vec_map.js"));
var vec_set = __toESM(require("./deps/sui/vec_set.js"));
var type_name = __toESM(require("./deps/std/type_name.js"));
var versioned = __toESM(require("./deps/sui/versioned.js"));
const $moduleName = "@local-pkg/sui-stack-messaging::auth";
const Auth = new import_utils.MoveStruct({
  name: `${$moduleName}::Auth`,
  fields: {
    member_permissions: vec_map.VecMap(import_bcs.bcs.Address, vec_set.VecSet(type_name.TypeName)),
    config: versioned.Versioned
  }
});
const EditPermissions = new import_utils.MoveTuple({
  name: `${$moduleName}::EditPermissions`,
  fields: [import_bcs.bcs.bool()]
});
//# sourceMappingURL=auth.js.map
