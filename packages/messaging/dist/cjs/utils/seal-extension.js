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
var seal_extension_exports = {};
__export(seal_extension_exports, {
  sealClientExtension: () => sealClientExtension
});
module.exports = __toCommonJS(seal_extension_exports);
var import_seal = require("@mysten/seal");
function sealClientExtension(options) {
  return {
    name: "seal",
    register: (client) => {
      return new import_seal.SealClient({
        suiClient: client,
        serverConfigs: options.serverConfigs,
        verifyKeyServers: options.verifyKeyServers ?? true,
        timeout: options.timeout
      });
    }
  };
}
//# sourceMappingURL=seal-extension.js.map
