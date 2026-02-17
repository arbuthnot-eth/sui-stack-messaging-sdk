import { MoveStruct } from '../utils/index.js';
import type { RawTransactionArgument } from '../utils/index.js';
import type { Transaction } from '@mysten/sui/transactions';
export declare const Message: MoveStruct<{
    /** The address of the sender of this message. TODO: should we encrypt this as well? */
    sender: import("@mysten/bcs").BcsType<string, string | Uint8Array<ArrayBufferLike>, "bytes[32]">;
    /** The message content, encrypted with a DEK(Data Encryption Key) */
    ciphertext: import("@mysten/bcs").BcsType<number[], Iterable<number> & {
        length: number;
    }, string>;
    /** The nonce used for the encryption of the content. */
    nonce: import("@mysten/bcs").BcsType<number[], Iterable<number> & {
        length: number;
    }, string>;
    /**
     * The version of the DEK(Data Encryption Key) that was used to encrypt this
     * Message
     */
    key_version: import("@mysten/bcs").BcsType<number, number, "u32">;
    /** A vector of attachments associated with this message. */
    attachments: import("@mysten/bcs").BcsType<{
        blob_ref: string;
        encrypted_metadata: number[];
        data_nonce: number[];
        metadata_nonce: number[];
        key_version: number;
    }[], Iterable<{
        blob_ref: string;
        encrypted_metadata: Iterable<number> & {
            length: number;
        };
        data_nonce: Iterable<number> & {
            length: number;
        };
        metadata_nonce: Iterable<number> & {
            length: number;
        };
        key_version: number;
    }> & {
        length: number;
    }, string>;
    /** Timestamp in milliseconds when the message was created. */
    created_at_ms: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
}, "@local-pkg/sui-stack-messaging::message::Message">;
export declare const MessageAddedEvent: MoveStruct<{
    channel_id: import("@mysten/bcs").BcsType<string, string | Uint8Array<ArrayBufferLike>, "bytes[32]">;
    message_index: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
    sender: import("@mysten/bcs").BcsType<string, string | Uint8Array<ArrayBufferLike>, "bytes[32]">;
    ciphertext: import("@mysten/bcs").BcsType<number[], Iterable<number> & {
        length: number;
    }, string>;
    nonce: import("@mysten/bcs").BcsType<number[], Iterable<number> & {
        length: number;
    }, string>;
    key_version: import("@mysten/bcs").BcsType<number, number, "u32">;
    attachment_refs: import("@mysten/bcs").BcsType<string[], Iterable<string> & {
        length: number;
    }, string>;
    attachment_nonces: import("@mysten/bcs").BcsType<number[][], Iterable<Iterable<number> & {
        length: number;
    }> & {
        length: number;
    }, string>;
    created_at_ms: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
}, "@local-pkg/sui-stack-messaging::message::MessageAddedEvent">;
export interface NewArguments {
    sender: RawTransactionArgument<string>;
    ciphertext: RawTransactionArgument<number[]>;
    nonce: RawTransactionArgument<number[]>;
    keyVersion: RawTransactionArgument<number>;
    attachments: RawTransactionArgument<string[]>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        sender: RawTransactionArgument<string>,
        ciphertext: RawTransactionArgument<number[]>,
        nonce: RawTransactionArgument<number[]>,
        keyVersion: RawTransactionArgument<number>,
        attachments: RawTransactionArgument<string[]>
    ];
}
export declare function _new(options: NewOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
