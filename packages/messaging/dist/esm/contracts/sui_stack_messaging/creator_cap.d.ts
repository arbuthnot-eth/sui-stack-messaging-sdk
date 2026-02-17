import { MoveStruct } from '../utils/index.js';
import type { RawTransactionArgument } from '../utils/index.js';
import type { Transaction } from '@mysten/sui/transactions';
export declare const CreatorCap: MoveStruct<{
    id: MoveStruct<{
        id: import("@mysten/bcs").BcsType<string, string | Uint8Array<ArrayBufferLike>, "bytes[32]">;
    }, "0x2::object::UID">;
    channel_id: import("@mysten/bcs").BcsType<string, string | Uint8Array<ArrayBufferLike>, "bytes[32]">;
}, "@local-pkg/sui-stack-messaging::creator_cap::CreatorCap">;
export interface TransferToSenderArguments {
    self: RawTransactionArgument<string>;
}
export interface TransferToSenderOptions {
    package?: string;
    arguments: TransferToSenderArguments | [self: RawTransactionArgument<string>];
}
/** Transfer a CreatorCap to the transaction sender. */
export declare function transferToSender(options: TransferToSenderOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
