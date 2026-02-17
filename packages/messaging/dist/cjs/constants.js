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
var constants_exports = {};
__export(constants_exports, {
  DEFAULT_SEAL_APPROVE_CONTRACT: () => DEFAULT_SEAL_APPROVE_CONTRACT,
  MAINNET_MESSAGING_PACKAGE_CONFIG: () => MAINNET_MESSAGING_PACKAGE_CONFIG,
  TESTNET_MESSAGING_PACKAGE_CONFIG: () => TESTNET_MESSAGING_PACKAGE_CONFIG
});
module.exports = __toCommonJS(constants_exports);
const TESTNET_PACKAGE_ID = "0x984960ebddd75c15c6d38355ac462621db0ffc7d6647214c802cd3b685e1af3d";
const MAINNET_PACKAGE_ID = "0x74e34e2e4a2ba60d935db245c0ed93070bbbe23bf1558ae5c6a2a8590c8ad470";
const DEFAULT_SEAL_APPROVE_CONTRACT = {
  module: "seal_policies",
  functionName: "seal_approve"
};
const TESTNET_MESSAGING_PACKAGE_CONFIG = {
  packageId: TESTNET_PACKAGE_ID
};
const MAINNET_MESSAGING_PACKAGE_CONFIG = {
  packageId: MAINNET_PACKAGE_ID
};
//# sourceMappingURL=constants.js.map
