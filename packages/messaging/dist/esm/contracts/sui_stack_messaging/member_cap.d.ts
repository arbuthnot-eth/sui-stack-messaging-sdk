import { MoveStruct } from '../utils/index.js';
import type { RawTransactionArgument } from '../utils/index.js';
import type { Transaction } from '@mysten/sui/transactions';
export declare const MemberCap: MoveStruct<{
    id: MoveStruct<{
        id: import("@mysten/bcs").BcsType<string, string | Uint8Array<ArrayBufferLike>, "bytes[32]">;
    }, "0x2::object::UID">;
    channel_id: import("@mysten/bcs").BcsType<string, string | Uint8Array<ArrayBufferLike>, "bytes[32]">;
}, "@local-pkg/sui-stack-messaging::member_cap::MemberCap">;
export interface TransferToRecipientArguments {
    cap: RawTransactionArgument<string>;
    creatorCap: RawTransactionArgument<string>;
    recipient: RawTransactionArgument<string>;
}
export interface TransferToRecipientOptions {
    package?: string;
    arguments: TransferToRecipientArguments | [
        cap: RawTransactionArgument<string>,
        creatorCap: RawTransactionArgument<string>,
        recipient: RawTransactionArgument<string>
    ];
}
/**
 * Transfer a MemberCap to the specified address. Should only be called by a
 * Channel Creator, after a Channel is created and shared.
 */
export declare function transferToRecipient(options: TransferToRecipientOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface TransferMemberCapsArguments {
    memberAddresses: RawTransactionArgument<string[]>;
    memberCaps: RawTransactionArgument<string[]>;
    creatorCap: RawTransactionArgument<string>;
}
export interface TransferMemberCapsOptions {
    package?: string;
    arguments: TransferMemberCapsArguments | [
        memberAddresses: RawTransactionArgument<string[]>,
        memberCaps: RawTransactionArgument<string[]>,
        creatorCap: RawTransactionArgument<string>
    ];
}
/**
 * Transfer MemberCaps to the associated addresses Should only be called by a
 * Channel Creator, after a Channel is created and shared.
 */
export declare function transferMemberCaps(options: TransferMemberCapsOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface ChannelIdArguments {
    self: RawTransactionArgument<string>;
}
export interface ChannelIdOptions {
    package?: string;
    arguments: ChannelIdArguments | [self: RawTransactionArgument<string>];
}
export declare function channelId(options: ChannelIdOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
