import { SessionKey } from "@mysten/seal";
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
  static normalizeNonZeroSuiAddress(value) {
    if (typeof value !== "string") return null;
    let raw = value.trim().toLowerCase();
    if (!raw) return null;
    if (raw.startsWith("0x")) raw = raw.slice(2);
    if (!raw || raw.length > 64 || /[^0-9a-f]/.test(raw)) return null;
    raw = raw.replace(/^0+/, "");
    if (!raw) return null;
    const normalized = `0x${raw.padStart(64, "0")}`;
    return normalized === `0x${"0".repeat(64)}` ? null : normalized;
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
      this.managedSessionKey = await SessionKey.create({
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
  resolveSessionAddress(activeSessionKey) {
    const fromConfig = SessionKeyManager.normalizeNonZeroSuiAddress(this.sessionKeyConfig?.address);
    if (fromConfig) return fromConfig;
    const key = activeSessionKey ?? this.sessionKey ?? this.managedSessionKey;
    if (!key) return null;
    try {
      const keyWithAddress = key;
      if (typeof keyWithAddress.getAddress === "function") {
        const fromMethod = SessionKeyManager.normalizeNonZeroSuiAddress(keyWithAddress.getAddress());
        if (fromMethod) return fromMethod;
      }
      const fromField = SessionKeyManager.normalizeNonZeroSuiAddress(keyWithAddress.address);
      if (fromField) return fromField;
    } catch (_error) {
    }
    return null;
  }
}
export {
  SessionKeyManager
};
//# sourceMappingURL=sessionKeyManager.js.map
