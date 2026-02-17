import type { EncryptionPrimitives, EncryptionPrimitivesConfig } from './types.js';
/**
 * Default implementation of the KeyProvider interface using Web Crypto API
 */
export declare class WebCryptoPrimitives implements EncryptionPrimitives {
    private static instance;
    private config;
    private constructor();
    static getInstance(config?: EncryptionPrimitivesConfig): WebCryptoPrimitives;
    /**
     * Generate a cryptographically secure random Data Encryption Key
     * @param length - Optional key length
     * @returns Random DEK bytes
     */
    generateDEK(length?: number): Promise<Uint8Array<ArrayBuffer>>;
    /**
     * Generate a cryptographically secure nonce
     * @param length - Optional nonce length
     * @returns Random nonce bytes
     */
    generateNonce(length?: number): Uint8Array<ArrayBuffer>;
    /**
     * Encrypt bytes using a Data Encryption Key and nonce
     * @param key - The encryption key
     * @param nonce - The encryption nonce
     * @param aad - Additional authenticated data
     * @param bytesToEncrypt - The bytes to encrypt
     * @returns Encrypted bytes
     */
    encryptBytes(key: Uint8Array<ArrayBuffer>, nonce: Uint8Array<ArrayBuffer>, aad: Uint8Array<ArrayBuffer>, bytesToEncrypt: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>>;
    /**
     * Decrypt bytes using a Data Encryption Key and nonce
     * @param key - The decryption key
     * @param nonce - The decryption nonce
     * @param aad - Additional authenticated data
     * @param encryptedBytes - The bytes to decrypt
     * @returns Decrypted bytes
     */
    decryptBytes(key: Uint8Array<ArrayBuffer>, nonce: Uint8Array<ArrayBuffer>, aad: Uint8Array<ArrayBuffer>, encryptedBytes: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>>;
}
