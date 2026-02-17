import type { Transaction } from '@mysten/sui/transactions';
import type { EncryptedSymmetricKey } from './encryption/types.js';
import { EnvelopeEncryption } from './encryption/envelopeEncryption.js';
import type { ThunderAction } from './thunder.js';
export interface AppendThunderMessageOptions {
    packageId: string;
    channelId: string;
    memberCapId: string;
    action: ThunderAction;
    encryptedKey: EncryptedSymmetricKey;
    sender: string;
}
export declare function appendThunderMessage(tx: Transaction, options: AppendThunderMessageOptions, envelopeEncryption: EnvelopeEncryption): Promise<void>;
