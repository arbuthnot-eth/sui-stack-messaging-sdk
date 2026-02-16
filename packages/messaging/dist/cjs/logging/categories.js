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
var categories_exports = {};
__export(categories_exports, {
  LOG_CATEGORIES: () => LOG_CATEGORIES
});
module.exports = __toCommonJS(categories_exports);
const LOG_CATEGORIES = {
  /**
   * Root category for all Messaging SDK logs.
   * Configure this to enable/disable all SDK logging.
   */
  ROOT: ["@mysten/messaging"],
  /**
   * Client read operations: fetching channels, messages, members, etc.
   */
  CLIENT_READS: ["@mysten/messaging", "client", "reads"],
  /**
   * Client write operations: creating channels, sending messages, adding members, etc.
   */
  CLIENT_WRITES: ["@mysten/messaging", "client", "writes"],
  /**
   * Encryption operations: envelope encryption, key generation, decryption.
   */
  ENCRYPTION: ["@mysten/messaging", "encryption"],
  /**
   * All storage adapter operations.
   */
  STORAGE: ["@mysten/messaging", "storage"],
  /**
   * Walrus-specific storage operations.
   */
  STORAGE_WALRUS: ["@mysten/messaging", "storage", "walrus"]
};
//# sourceMappingURL=categories.js.map
