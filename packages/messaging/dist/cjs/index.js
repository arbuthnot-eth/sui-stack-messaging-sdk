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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var index_exports = {};
__export(index_exports, {
  DEFAULT_SEAL_APPROVE_CONTRACT: () => import_constants.DEFAULT_SEAL_APPROVE_CONTRACT,
  LOG_CATEGORIES: () => import_logging.LOG_CATEGORIES,
  LocalChannelRegistry: () => import_channelResolution.LocalChannelRegistry,
  MAINNET_MESSAGING_PACKAGE_CONFIG: () => import_constants.MAINNET_MESSAGING_PACKAGE_CONFIG,
  PersistentChannelRegistry: () => import_channelResolution.PersistentChannelRegistry,
  SuiNSResolver: () => import_addressResolution.SuiNSResolver,
  SuiStackMessagingClient: () => import_client.SuiStackMessagingClient,
  TESTNET_MESSAGING_PACKAGE_CONFIG: () => import_constants.TESTNET_MESSAGING_PACKAGE_CONFIG,
  WalrusStorageAdapter: () => import_walrus.WalrusStorageAdapter,
  formatChannelName: () => import_channelResolution.formatChannelName,
  getLogger: () => import_logging.getLogger,
  isChannelName: () => import_channelResolution.isChannelName,
  isSuiNSName: () => import_addressResolution.isSuiNSName,
  messaging: () => import_client.messaging,
  normalizeChannelName: () => import_channelResolution.normalizeChannelName,
  sealClientExtension: () => import_seal_extension.sealClientExtension
});
module.exports = __toCommonJS(index_exports);
var import_client = require("./client.js");
var import_constants = require("./constants.js");
__reExport(index_exports, require("./error.js"), module.exports);
var import_logging = require("./logging/index.js");
var import_walrus = require("./storage/adapters/walrus/walrus.js");
var import_addressResolution = require("./utils/addressResolution.js");
var import_channelResolution = require("./utils/channelResolution.js");
var import_seal_extension = require("./utils/seal-extension.js");
//# sourceMappingURL=index.js.map
