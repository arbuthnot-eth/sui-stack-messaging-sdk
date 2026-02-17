import { MoveStruct } from '../utils/index.js';
import type { RawTransactionArgument } from '../utils/index.js';
import type { Transaction } from '@mysten/sui/transactions';
export declare const Attachment: MoveStruct<{
    blob_ref: import("@mysten/bcs").BcsType<string, string, "string">;
    encrypted_metadata: import("@mysten/bcs").BcsType<number[], Iterable<number> & {
        length: number;
    }, string>;
    data_nonce: import("@mysten/bcs").BcsType<number[], Iterable<number> & {
        length: number;
    }, string>;
    metadata_nonce: import("@mysten/bcs").BcsType<number[], Iterable<number> & {
        length: number;
    }, string>;
    key_version: import("@mysten/bcs").BcsType<number, number, "u32">;
}, "@local-pkg/sui-stack-messaging::attachment::Attachment">;
export interface NewArguments {
    blobRef: RawTransactionArgument<string>;
    encryptedMetadata: RawTransactionArgument<number[]>;
    dataNonce: RawTransactionArgument<number[]>;
    metadataNonce: RawTransactionArgument<number[]>;
    keyVersion: RawTransactionArgument<number>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        blobRef: RawTransactionArgument<string>,
        encryptedMetadata: RawTransactionArgument<number[]>,
        dataNonce: RawTransactionArgument<number[]>,
        metadataNonce: RawTransactionArgument<number[]>,
        keyVersion: RawTransactionArgument<number>
    ];
}
export declare function _new(options: NewOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface BlobRefArguments {
    self: RawTransactionArgument<string>;
}
export interface BlobRefOptions {
    package?: string;
    arguments: BlobRefArguments | [self: RawTransactionArgument<string>];
}
export declare function blobRef(options: BlobRefOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface DataNonceArguments {
    self: RawTransactionArgument<string>;
}
export interface DataNonceOptions {
    package?: string;
    arguments: DataNonceArguments | [self: RawTransactionArgument<string>];
}
export declare function dataNonce(options: DataNonceOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
