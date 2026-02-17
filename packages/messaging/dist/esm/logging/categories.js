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
export {
  LOG_CATEGORIES
};
//# sourceMappingURL=categories.js.map
