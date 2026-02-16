import { SessionKey } from '@mysten/seal';
import type { MessagingCompatibleClient } from '../types.js';
import type { SealApproveContract, SessionKeyConfig } from './types.js';
/**
 * Internal utility for managing SessionKey lifecycle.
 * Handles both external SessionKey instances and internal SessionKeyConfig management.
 *
 * @internal - Not exposed in public API
 */
export declare class SessionKeyManager {
    private sessionKey;
    private readonly sessionKeyConfig;
    private readonly suiClient;
    private readonly sealApproveContract;
    private managedSessionKey?;
    constructor(sessionKey: SessionKey | undefined, sessionKeyConfig: SessionKeyConfig | undefined, suiClient: MessagingCompatibleClient, sealApproveContract: SealApproveContract);
    /**
     * Get a valid SessionKey instance
     */
    getSessionKey(): Promise<SessionKey>;
    /**
     * Update the external SessionKey instance
     */
    updateExternalSessionKey(newSessionKey: SessionKey): void;
    /**
     * Force refresh the managed SessionKey
     */
    refreshManagedSessionKey(): Promise<SessionKey>;
}
