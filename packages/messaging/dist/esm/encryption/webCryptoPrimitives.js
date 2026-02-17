import { MessagingClientError } from "../error.js";
import { ENCRYPTION_PRIMITIVES_CONFIG } from "./constants.js";
class WebCryptoPrimitives {
  constructor(config) {
    this.config = config;
  }
  static getInstance(config) {
    if (!WebCryptoPrimitives.instance) {
      WebCryptoPrimitives.instance = new WebCryptoPrimitives(
        config ?? ENCRYPTION_PRIMITIVES_CONFIG
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
        throw new MessagingClientError("Unsupported Data Encryption Key algorithm");
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
        throw new MessagingClientError("Unsupported encryption algorithm");
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
        throw new MessagingClientError("Unsupported encryption algorithm");
    }
  }
}
export {
  WebCryptoPrimitives
};
//# sourceMappingURL=webCryptoPrimitives.js.map
