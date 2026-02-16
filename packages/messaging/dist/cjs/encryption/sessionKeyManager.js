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
var sessionKeyManager_exports = {};
__export(sessionKeyManager_exports, {
  SessionKeyManager: () => SessionKeyManager
});
module.exports = __toCommonJS(sessionKeyManager_exports);
var import_seal = require("@mysten/seal");
class SessionKeyManager {
  constructor(sessionKey, sessionKeyConfig, suiClient, sealApproveContract) {
    this.sessionKey = sessionKey;
    this.sessionKeyConfig = sessionKeyConfig;
    this.suiClient = suiClient;
    this.sealApproveContract = sealApproveContract;
    if (!sessionKey && !sessionKeyConfig) {
      throw new Error("Either sessionKey or sessionKeyConfig must be provided");
    }
    if (sessionKey && sessionKeyConfig) {
      throw new Error("Cannot provide both sessionKey and sessionKeyConfig. Choose one.");
    }
  }
  /**
   * Get a valid SessionKey instance
   */
  async getSessionKey() {
    if (this.sessionKey) {
      if (this.sessionKey.isExpired()) {
        throw new Error(
          "The provided SessionKey has expired. Please provide a new SessionKey instance. When using an external SessionKey, lifecycle management is your responsibility."
        );
      }
      return this.sessionKey;
    }
    if (this.sessionKeyConfig) {
      if (this.managedSessionKey && !this.managedSessionKey.isExpired()) {
        return this.managedSessionKey;
      }
      this.managedSessionKey = await import_seal.SessionKey.create({
        address: this.sessionKeyConfig.address,
        signer: this.sessionKeyConfig.signer,
        ttlMin: this.sessionKeyConfig.ttlMin,
        mvrName: this.sessionKeyConfig.mvrName,
        packageId: this.sealApproveContract.packageId,
        suiClient: this.suiClient
      });
      return this.managedSessionKey;
    }
    throw new Error("Invalid SessionKeyManager state");
  }
  /**
   * Update the external SessionKey instance
   */
  updateExternalSessionKey(newSessionKey) {
    if (!this.sessionKey) {
      throw new Error("Cannot update external SessionKey when using managed SessionKey");
    }
    this.sessionKey = newSessionKey;
  }
  /**
   * Force refresh the managed SessionKey
   */
  async refreshManagedSessionKey() {
    if (!this.sessionKeyConfig) {
      throw new Error("Cannot refresh managed SessionKey when using external SessionKey");
    }
    this.managedSessionKey = void 0;
    return this.getSessionKey();
  }
}
//# sourceMappingURL=sessionKeyManager.js.map
