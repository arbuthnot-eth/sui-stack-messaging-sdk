import type { SessionKey } from '@mysten/seal';
import type { DecryptAttachmentDataOpts, DecryptAttachmentDataResult, DecryptAttachmentMetadataOpts, DecryptAttachmentMetadataResult, DecryptAttachmentOpts, DecryptAttachmentResult, DecryptChannelDEKOpts, DecryptMessageOpts, DecryptTextOpts, EncryptAttachmentOpts, EncryptedAttachmentPayload, EncryptedMessagePayload, EncryptedPayload, EncryptMessageOpts, EncryptTextOpts, EnvelopeEncryptionConfig, GenerateEncryptedChannelDEKopts, SymmetricKey } from './types.js';
/**
 * Core envelope encryption service that utilizes Seal
 */
export declare class EnvelopeEncryption {
    #private;
    constructor(config: EnvelopeEncryptionConfig);
    /**
     * Update the external SessionKey instance (useful for React context updates)
     */
    updateSessionKey(newSessionKey: SessionKey): void;
    /**
     * Force refresh the managed SessionKey (useful for testing or manual refresh)
     */
    refreshSessionKey(): Promise<SessionKey>;
    /**
     * Generate encrypted channel data encryption key
     * @param channelId - The channel ID
     * @returns Encrypted DEK bytes
     */
    generateEncryptedChannelDEK({ channelId, }: GenerateEncryptedChannelDEKopts): Promise<Uint8Array<ArrayBuffer>>;
    /**
     * Generate a random nonce
     * @returns Random nonce bytes
     */
    generateNonce(): Uint8Array<ArrayBuffer>;
    /**
     * Encrypt text message
     * @param text - The text to encrypt
     * @param channelId - The channel ID
     * @param sender - The sender address
     * @param encryptedKey - The encrypted symmetric key
     * @param memberCapId - The member cap ID
     * @returns Encrypted payload with ciphertext and nonce
     */
    encryptText({ text, channelId, sender, encryptedKey, memberCapId, }: EncryptTextOpts): Promise<EncryptedPayload>;
    /**
     * Decrypt text message
     * @param encryptedBytes - The encrypted text bytes
     * @param nonce - The encryption nonce
     * @param channelId - The channel ID
     * @param encryptedKey - The encrypted symmetric key
     * @param sender - The sender address
     * @param memberCapId - The member cap ID
     * @returns Decrypted text string
     */
    decryptText({ encryptedBytes: ciphertext, nonce, channelId, encryptedKey, sender, memberCapId, }: DecryptTextOpts): Promise<string>;
    /**
     * Encrypt attachment file and metadata
     * @param file - The file to encrypt
     * @param channelId - The channel ID
     * @param sender - The sender address
     * @param encryptedKey - The encrypted symmetric key
     * @param memberCapId - The member cap ID
     * @returns Encrypted attachment payload with data and metadata
     */
    encryptAttachment({ file, channelId, sender, encryptedKey, memberCapId, }: EncryptAttachmentOpts): Promise<EncryptedAttachmentPayload>;
    /**
     * Encrypt attachment file data
     * @param file - The file to encrypt
     * @param channelId - The channel ID
     * @param sender - The sender address
     * @param encryptedKey - The encrypted symmetric key
     * @param memberCapId - The member cap ID
     * @returns Encrypted payload with data and nonce
     */
    encryptAttachmentData({ file, channelId, sender, encryptedKey, memberCapId, }: EncryptAttachmentOpts): Promise<EncryptedPayload>;
    /**
     * Encrypt attachment metadata
     * @param file - The file to get metadata from
     * @param channelId - The channel ID
     * @param sender - The sender address
     * @param encryptedKey - The encrypted symmetric key
     * @param memberCapId - The member cap ID
     * @returns Encrypted payload with metadata and nonce
     */
    encryptAttachmentMetadata({ channelId, sender, encryptedKey, memberCapId, file, }: EncryptAttachmentOpts): Promise<EncryptedPayload>;
    /**
     * Decrypt attachment metadata
     * @param encryptedBytes - The encrypted metadata bytes
     * @param nonce - The encryption nonce
     * @param channelId - The channel ID
     * @param sender - The sender address
     * @param encryptedKey - The encrypted symmetric key
     * @param memberCapId - The member cap ID
     * @returns Decrypted attachment metadata
     */
    decryptAttachmentMetadata({ channelId, sender, encryptedKey, memberCapId, encryptedBytes, nonce, }: DecryptAttachmentMetadataOpts): Promise<DecryptAttachmentMetadataResult>;
    /**
     * Decrypt attachment file data
     * @param encryptedBytes - The encrypted data bytes
     * @param nonce - The encryption nonce
     * @param channelId - The channel ID
     * @param sender - The sender address
     * @param encryptedKey - The encrypted symmetric key
     * @param memberCapId - The member cap ID
     * @returns Decrypted attachment data
     */
    decryptAttachmentData({ channelId, sender, encryptedKey, memberCapId, encryptedBytes, nonce, }: DecryptAttachmentDataOpts): Promise<DecryptAttachmentDataResult>;
    /**
     * Decrypt attachment file and metadata
     * @param data - The encrypted data payload
     * @param metadata - The encrypted metadata payload
     * @param channelId - The channel ID
     * @param sender - The sender address
     * @param encryptedKey - The encrypted symmetric key
     * @param memberCapId - The member cap ID
     * @returns Decrypted attachment with data and metadata
     */
    decryptAttachment({ channelId, sender, encryptedKey, memberCapId, data, metadata, }: DecryptAttachmentOpts): Promise<DecryptAttachmentResult>;
    /**
     * Encrypt message text and attachments
     * @param text - The message text
     * @param attachments - Optional file attachments
     * @param channelId - The channel ID
     * @param sender - The sender address
     * @param encryptedKey - The encrypted symmetric key
     * @param memberCapId - The member cap ID
     * @returns Encrypted message payload
     */
    encryptMessage({ text, attachments, channelId, sender, encryptedKey, memberCapId, }: EncryptMessageOpts): Promise<EncryptedMessagePayload>;
    /**
     * Decrypt message text and attachments
     * @param ciphertext - The encrypted text bytes
     * @param nonce - The encryption nonce
     * @param attachments - Optional encrypted attachments
     * @param channelId - The channel ID
     * @param sender - The sender address
     * @param encryptedKey - The encrypted symmetric key
     * @param memberCapId - The member cap ID
     * @returns Decrypted message with text and attachments
     */
    decryptMessage({ ciphertext, nonce, attachments, channelId, sender, encryptedKey, memberCapId, }: DecryptMessageOpts): Promise<{
        text: string;
        attachments?: DecryptAttachmentResult[];
    }>;
    /**
     * Decrypt encrypted channel data encryption key using Seal
     * @param encryptedKey - The encrypted symmetric key
     * @param channelId - The channel ID
     * @param memberCapId - The member cap ID
     * @returns Decrypted symmetric key
     */
    decryptChannelDEK({ encryptedKey, channelId, memberCapId, }: DecryptChannelDEKOpts): Promise<SymmetricKey>;
    /**
     * Get Additional Authenticated Data for encryption/decryption
     * @param channelId - The channel ID
     * @param keyVersion - The key version
     * @param sender - The sender address
     * @returns AAD bytes
     */
    private encryptionAAD;
}
