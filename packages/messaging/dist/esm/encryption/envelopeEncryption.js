var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _suiClient, _encryptionPrimitives, _sessionKeyManager, _sealApproveContract, _sealConfig;
import { EncryptedObject } from "@mysten/seal";
import { fromHex, isValidSuiObjectId, toHex } from "@mysten/sui/utils";
import { getLogger, LOG_CATEGORIES } from "../logging/index.js";
import { WebCryptoPrimitives } from "./webCryptoPrimitives.js";
import { Transaction } from "@mysten/sui/transactions";
import { SessionKeyManager } from "./sessionKeyManager.js";
class EnvelopeEncryption {
  constructor(config) {
    __privateAdd(this, _suiClient);
    __privateAdd(this, _encryptionPrimitives);
    __privateAdd(this, _sessionKeyManager);
    __privateAdd(this, _sealApproveContract);
    __privateAdd(this, _sealConfig);
    __privateSet(this, _suiClient, config.suiClient);
    __privateSet(this, _sealApproveContract, config.sealApproveContract);
    __privateSet(this, _sealConfig, {
      threshold: config.sealConfig?.threshold ?? 2
    });
    __privateSet(this, _encryptionPrimitives, config.encryptionPrimitives ?? WebCryptoPrimitives.getInstance());
    __privateSet(this, _sessionKeyManager, new SessionKeyManager(
      config.sessionKey,
      config.sessionKeyConfig,
      __privateGet(this, _suiClient),
      __privateGet(this, _sealApproveContract)
    ));
  }
  /**
   * Update the external SessionKey instance (useful for React context updates)
   */
  updateSessionKey(newSessionKey) {
    __privateGet(this, _sessionKeyManager).updateExternalSessionKey(newSessionKey);
  }
  /**
   * Force refresh the managed SessionKey (useful for testing or manual refresh)
   */
  async refreshSessionKey() {
    return __privateGet(this, _sessionKeyManager).refreshManagedSessionKey();
  }
  // ===== Encryption methods =====
  /**
   * Generate encrypted channel data encryption key
   * @param channelId - The channel ID
   * @returns Encrypted DEK bytes
   */
  async generateEncryptedChannelDEK({
    channelId
  }) {
    const logger = getLogger(LOG_CATEGORIES.ENCRYPTION);
    logger.debug("Generating encrypted channel DEK", { channelId });
    if (!isValidSuiObjectId(channelId)) {
      throw new Error("The channelId provided is not a valid Sui Object ID");
    }
    const dek = await __privateGet(this, _encryptionPrimitives).generateDEK();
    const nonce = __privateGet(this, _encryptionPrimitives).generateNonce();
    const sealPolicyBytes = fromHex(channelId);
    const id = toHex(new Uint8Array([...sealPolicyBytes, ...nonce]));
    const { encryptedObject: encryptedDekBytes } = await __privateGet(this, _suiClient).seal.encrypt({
      threshold: __privateGet(this, _sealConfig).threshold,
      packageId: __privateGet(this, _sealApproveContract).packageId,
      id,
      data: dek
    });
    logger.debug("Channel DEK generated and encrypted", {
      channelId,
      encryptedKeyLength: encryptedDekBytes.length
    });
    return new Uint8Array(encryptedDekBytes);
  }
  /**
   * Generate a random nonce
   * @returns Random nonce bytes
   */
  generateNonce() {
    return __privateGet(this, _encryptionPrimitives).generateNonce();
  }
  /**
   * Encrypt text message
   * @param text - The text to encrypt
   * @param channelId - The channel ID
   * @param sender - The sender address
   * @param encryptedKey - The encrypted symmetric key
   * @param memberCapId - The member cap ID
   * @returns Encrypted payload with ciphertext and nonce
   */
  async encryptText({
    text,
    channelId,
    sender,
    encryptedKey,
    memberCapId
  }) {
    const logger = getLogger(LOG_CATEGORIES.ENCRYPTION);
    logger.debug("Encrypting text message", {
      channelId,
      textLength: text.length,
      sender
    });
    const nonce = __privateGet(this, _encryptionPrimitives).generateNonce();
    const dek = await this.decryptChannelDEK({
      encryptedKey,
      channelId,
      memberCapId
    });
    const ciphertext = await __privateGet(this, _encryptionPrimitives).encryptBytes(
      dek.bytes,
      nonce,
      this.encryptionAAD(channelId, dek.version, sender),
      new Uint8Array(new TextEncoder().encode(text))
    );
    return {
      encryptedBytes: ciphertext,
      nonce
    };
  }
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
  async decryptText({
    encryptedBytes: ciphertext,
    nonce,
    channelId,
    encryptedKey,
    sender,
    memberCapId
  }) {
    const logger = getLogger(LOG_CATEGORIES.ENCRYPTION);
    logger.debug("Decrypting text message", {
      channelId,
      ciphertextLength: ciphertext.length,
      sender
    });
    const dek = await this.decryptChannelDEK({
      encryptedKey,
      channelId,
      memberCapId
    });
    const decryptedBytes = await __privateGet(this, _encryptionPrimitives).decryptBytes(
      dek.bytes,
      nonce,
      this.encryptionAAD(channelId, encryptedKey.version, sender),
      ciphertext
    );
    return new TextDecoder().decode(decryptedBytes);
  }
  /**
   * Encrypt attachment file and metadata
   * @param file - The file to encrypt
   * @param channelId - The channel ID
   * @param sender - The sender address
   * @param encryptedKey - The encrypted symmetric key
   * @param memberCapId - The member cap ID
   * @returns Encrypted attachment payload with data and metadata
   */
  async encryptAttachment({
    file,
    channelId,
    sender,
    encryptedKey,
    memberCapId
  }) {
    const { encryptedBytes: encryptedData, nonce: dataNonce } = await this.encryptAttachmentData({
      file,
      channelId,
      sender,
      encryptedKey,
      memberCapId
    });
    const { encryptedBytes: encryptedMetadata, nonce: metadataNonce } = await this.encryptAttachmentMetadata({
      file,
      channelId,
      sender,
      encryptedKey,
      memberCapId
    });
    return {
      data: { encryptedBytes: encryptedData, nonce: dataNonce },
      metadata: { encryptedBytes: encryptedMetadata, nonce: metadataNonce }
    };
  }
  /**
   * Encrypt attachment file data
   * @param file - The file to encrypt
   * @param channelId - The channel ID
   * @param sender - The sender address
   * @param encryptedKey - The encrypted symmetric key
   * @param memberCapId - The member cap ID
   * @returns Encrypted payload with data and nonce
   */
  async encryptAttachmentData({
    file,
    channelId,
    sender,
    encryptedKey,
    memberCapId
  }) {
    const dek = await this.decryptChannelDEK({
      encryptedKey,
      channelId,
      memberCapId
    });
    const nonce = this.generateNonce();
    const fileData = await file.arrayBuffer();
    const encryptedData = await __privateGet(this, _encryptionPrimitives).encryptBytes(
      dek.bytes,
      nonce,
      this.encryptionAAD(channelId, dek.version, sender),
      new Uint8Array(fileData)
    );
    return { encryptedBytes: encryptedData, nonce };
  }
  /**
   * Encrypt attachment metadata
   * @param file - The file to get metadata from
   * @param channelId - The channel ID
   * @param sender - The sender address
   * @param encryptedKey - The encrypted symmetric key
   * @param memberCapId - The member cap ID
   * @returns Encrypted payload with metadata and nonce
   */
  async encryptAttachmentMetadata({
    channelId,
    sender,
    encryptedKey,
    memberCapId,
    file
  }) {
    const dek = await this.decryptChannelDEK({
      encryptedKey,
      channelId,
      memberCapId
    });
    const nonce = this.generateNonce();
    const metadata = {
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size
    };
    const metadataStr = JSON.stringify(metadata);
    const encryptedMetadata = await __privateGet(this, _encryptionPrimitives).encryptBytes(
      dek.bytes,
      nonce,
      this.encryptionAAD(channelId, dek.version, sender),
      new Uint8Array(new TextEncoder().encode(metadataStr))
    );
    return {
      encryptedBytes: encryptedMetadata,
      nonce
    };
  }
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
  async decryptAttachmentMetadata({
    channelId,
    sender,
    encryptedKey,
    memberCapId,
    encryptedBytes,
    nonce
  }) {
    const dek = await this.decryptChannelDEK({
      encryptedKey,
      channelId,
      memberCapId
    });
    const decryptedMetadataBytes = await __privateGet(this, _encryptionPrimitives).decryptBytes(
      dek.bytes,
      nonce,
      this.encryptionAAD(channelId, dek.version, sender),
      encryptedBytes
    );
    const metadataStr = new TextDecoder().decode(decryptedMetadataBytes);
    const { fileName, mimeType, fileSize } = JSON.parse(metadataStr);
    return {
      fileName,
      mimeType,
      fileSize
    };
  }
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
  async decryptAttachmentData({
    channelId,
    sender,
    encryptedKey,
    memberCapId,
    encryptedBytes,
    nonce
  }) {
    const dek = await this.decryptChannelDEK({
      encryptedKey,
      channelId,
      memberCapId
    });
    const decryptedData = await __privateGet(this, _encryptionPrimitives).decryptBytes(
      dek.bytes,
      nonce,
      this.encryptionAAD(channelId, dek.version, sender),
      encryptedBytes
    );
    return { data: decryptedData };
  }
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
  async decryptAttachment({
    channelId,
    sender,
    encryptedKey,
    memberCapId,
    data,
    metadata
  }) {
    const decryptedData = await this.decryptAttachmentData({
      channelId,
      sender,
      encryptedKey,
      memberCapId,
      encryptedBytes: data.encryptedBytes,
      nonce: data.nonce
    });
    const { fileName, mimeType, fileSize } = await this.decryptAttachmentMetadata({
      channelId,
      sender,
      encryptedKey,
      memberCapId,
      encryptedBytes: metadata.encryptedBytes,
      nonce: metadata.nonce
    });
    return {
      data: decryptedData.data,
      fileName,
      mimeType,
      fileSize
    };
  }
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
  async encryptMessage({
    text,
    attachments,
    channelId,
    sender,
    encryptedKey,
    memberCapId
  }) {
    const { encryptedBytes: ciphertext, nonce } = await this.encryptText({
      text,
      channelId,
      sender,
      encryptedKey,
      memberCapId
    });
    if (!attachments || attachments.length === 0) {
      return { text: { encryptedBytes: ciphertext, nonce } };
    }
    const encryptedAttachments = await Promise.all(
      attachments.map(
        (file) => this.encryptAttachment({
          file,
          channelId,
          sender,
          encryptedKey,
          memberCapId
        })
      )
    );
    return {
      text: { encryptedBytes: ciphertext, nonce },
      attachments: encryptedAttachments
    };
  }
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
  async decryptMessage({
    ciphertext,
    nonce,
    attachments,
    channelId,
    sender,
    encryptedKey,
    memberCapId
  }) {
    const text = await this.decryptText({
      encryptedBytes: ciphertext,
      nonce,
      channelId,
      sender,
      encryptedKey,
      memberCapId
    });
    if (!attachments || attachments.length === 0) {
      return { text };
    }
    const decryptedAttachments = await Promise.all(
      attachments.map(
        (attachment) => this.decryptAttachment({
          ...attachment,
          channelId,
          sender,
          encryptedKey,
          memberCapId
        })
      )
    );
    return {
      text,
      attachments: decryptedAttachments
    };
  }
  /**
   * Decrypt encrypted channel data encryption key using Seal
   * @param encryptedKey - The encrypted symmetric key
   * @param channelId - The channel ID
   * @param memberCapId - The member cap ID
   * @returns Decrypted symmetric key
   */
  async decryptChannelDEK({
    encryptedKey,
    channelId,
    memberCapId
  }) {
    const logger = getLogger(LOG_CATEGORIES.ENCRYPTION);
    if (!isValidSuiObjectId(channelId)) {
      throw new Error("The channelId provided is not a valid Sui Object ID");
    }
    if (!isValidSuiObjectId(memberCapId)) {
      throw new Error("The memberCapId provided is not a valid Sui Object ID");
    }
    const channelIdBytes = EncryptedObject.parse(encryptedKey.encryptedBytes).id;
    const tx = new Transaction();
    tx.moveCall({
      target: `${__privateGet(this, _sealApproveContract).packageId}::${__privateGet(this, _sealApproveContract).module}::${__privateGet(this, _sealApproveContract).functionName}`,
      arguments: [
        // Seal Identity Bytes: Channel object ID
        // key form: [packageId][channelId][random nonce]
        tx.pure.vector("u8", fromHex(channelIdBytes)),
        // Channel Object
        tx.object(channelId),
        // Member Cap Object
        tx.object(memberCapId)
      ]
    });
    const sessionKey = await __privateGet(this, _sessionKeyManager).getSessionKey();
    const sessionAddress = __privateGet(this, _sessionKeyManager).resolveSessionAddress(sessionKey);
    if (sessionAddress) {
      tx.setSenderIfNotSet(sessionAddress);
    }
    const txBytes = await tx.build({ client: __privateGet(this, _suiClient), onlyTransactionKind: true });
    let dekBytes;
    try {
      dekBytes = await __privateGet(this, _suiClient).seal.decrypt({
        data: encryptedKey.encryptedBytes,
        sessionKey,
        txBytes,
        checkLEEncoding: true
        // Support legacy LE-encoded ciphertexts
      });
    } catch (error) {
      logger.error("Error decrypting channel DEK", { channelId, memberCapId, error });
      throw error;
    }
    return {
      $kind: "Unencrypted",
      bytes: new Uint8Array(dekBytes || new Uint8Array()),
      version: encryptedKey.version
    };
  }
  // ===== Private methods =====
  /**
   * Get Additional Authenticated Data for encryption/decryption
   * @param channelId - The channel ID
   * @param keyVersion - The key version
   * @param sender - The sender address
   * @returns AAD bytes
   */
  encryptionAAD(channelId, keyVersion, sender) {
    return new Uint8Array(new TextEncoder().encode(channelId + keyVersion.toString() + sender));
  }
}
_suiClient = new WeakMap();
_encryptionPrimitives = new WeakMap();
_sessionKeyManager = new WeakMap();
_sealApproveContract = new WeakMap();
_sealConfig = new WeakMap();
export {
  EnvelopeEncryption
};
//# sourceMappingURL=envelopeEncryption.js.map
