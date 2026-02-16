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
var webCryptoPrimitives_exports = {};
__export(webCryptoPrimitives_exports, {
  WebCryptoPrimitives: () => WebCryptoPrimitives
});
module.exports = __toCommonJS(webCryptoPrimitives_exports);
var import_error = require("../error.js");
var import_constants = require("./constants.js");
class WebCryptoPrimitives {
  constructor(config) {
    this.config = config;
  }
  static getInstance(config) {
    if (!WebCryptoPrimitives.instance) {
      WebCryptoPrimitives.instance = new WebCryptoPrimitives(
        config ?? import_constants.ENCRYPTION_PRIMITIVES_CONFIG
      );
    }
    return WebCryptoPrimitives.instance;
  }
  // ===== Key methods =====
  /**
   * Generate a cryptographically secure random Data Encryption Key
   * @param length - Optional key length
   * @returns Random DEK bytes
   */
  async generateDEK(length) {
    switch (this.config.dekAlgorithm) {
      case "AES-GCM": {
        const dek = await crypto.subtle.generateKey(
          { name: this.config.dekAlgorithm, length: length ?? this.config.keySize },
          true,
          ["encrypt", "decrypt"]
        );
        return await crypto.subtle.exportKey("raw", dek).then((dekData) => new Uint8Array(dekData));
      }
      default:
        throw new import_error.MessagingClientError("Unsupported Data Encryption Key algorithm");
    }
  }
  /**
   * Generate a cryptographically secure nonce
   * @param length - Optional nonce length
   * @returns Random nonce bytes
   */
  generateNonce(length) {
    return crypto.getRandomValues(new Uint8Array(length ?? this.config.nonceSize));
  }
  // ===== Encryption methods =====
  /**
   * Encrypt bytes using a Data Encryption Key and nonce
   * @param key - The encryption key
   * @param nonce - The encryption nonce
   * @param aad - Additional authenticated data
   * @param bytesToEncrypt - The bytes to encrypt
   * @returns Encrypted bytes
   */
  async encryptBytes(key, nonce, aad, bytesToEncrypt) {
    switch (this.config.dekAlgorithm) {
      case "AES-GCM": {
        const importedDEK = await crypto.subtle.importKey(
          "raw",
          key,
          { name: this.config.dekAlgorithm },
          false,
          ["encrypt"]
        );
        return await crypto.subtle.encrypt(
          {
            name: this.config.dekAlgorithm,
            iv: nonce,
            additionalData: aad
          },
          importedDEK,
          bytesToEncrypt
        ).then((encryptedData) => new Uint8Array(encryptedData));
      }
      default:
        throw new import_error.MessagingClientError("Unsupported encryption algorithm");
    }
  }
  /**
   * Decrypt bytes using a Data Encryption Key and nonce
   * @param key - The decryption key
   * @param nonce - The decryption nonce
   * @param aad - Additional authenticated data
   * @param encryptedBytes - The bytes to decrypt
   * @returns Decrypted bytes
   */
  async decryptBytes(key, nonce, aad, encryptedBytes) {
    switch (this.config.dekAlgorithm) {
      case "AES-GCM": {
        const importedDEK = await crypto.subtle.importKey(
          "raw",
          key,
          { name: this.config.dekAlgorithm },
          false,
          ["decrypt"]
        );
        return await crypto.subtle.decrypt(
          {
            name: this.config.dekAlgorithm,
            iv: nonce,
            additionalData: aad
          },
          importedDEK,
          encryptedBytes
        ).then((decryptedData) => new Uint8Array(decryptedData));
      }
      default:
        throw new import_error.MessagingClientError("Unsupported encryption algorithm");
    }
  }
}
//# sourceMappingURL=webCryptoPrimitives.js.map
