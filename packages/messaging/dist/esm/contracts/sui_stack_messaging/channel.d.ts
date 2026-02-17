import { MoveStruct, MoveTuple } from '../utils/index.js';
import type { RawTransactionArgument } from '../utils/index.js';
import type { Transaction } from '@mysten/sui/transactions';
export declare const Channel: MoveStruct<{
    id: MoveStruct<{
        id: import("@mysten/bcs").BcsType<string, string | Uint8Array<ArrayBufferLike>, "bytes[32]">;
    }, "0x2::object::UID">;
    /** The version of this object, for handling updgrades. */
    version: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
    /**
     * The Authorization struct, gating actions to member permissions. Note: It also,
     * practically, keeps tracks of the members (MemberCap ID -> Permissions)
     */
    auth: MoveStruct<{
        member_permissions: MoveStruct<{
            contents: import("@mysten/bcs").BcsType<{
                key: string;
                value: {
                    contents: {
                        name: string;
                    }[];
                };
            }[], Iterable<{
                key: string | Uint8Array<ArrayBufferLike>;
                value: {
                    contents: Iterable<{
                        name: string;
                    }> & {
                        length: number;
                    };
                };
            }> & {
                length: number;
            }, string>;
        }, "0x2::vec_map::VecMap<bytes[32], 0x2::vec_set::VecSet<std::type_name::TypeName>>">;
        config: MoveStruct<{
            id: MoveStruct<{
                id: import("@mysten/bcs").BcsType<string, string | Uint8Array<ArrayBufferLike>, "bytes[32]">;
            }, "0x2::object::UID">;
            version: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
        }, "0x2::versioned::Versioned">;
    }, "@local-pkg/sui-stack-messaging::auth::Auth">;
    /**
     * The message history of the channel.
     *
     * Using `TableVec` to avoid the object size limit.
     */
    messages: MoveStruct<{
        contents: MoveStruct<{
            id: MoveStruct<{
                id: import("@mysten/bcs").BcsType<string, string | Uint8Array<ArrayBufferLike>, "bytes[32]">;
            }, "0x2::object::UID">;
            size: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
        }, "0x2::table::Table">;
    }, "0x2::table_vec::TableVec">;
    /**
     * The total number of messages, for efficiency, so that we don't have to make a
     * call to messages.length() (Maybe I am overthinking this, need to measure)
     */
    messages_count: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
    /**
     * A duplicate of the last entry of the messages TableVec,
     *
     * Utilize this for efficient fetching e.g. list of conversations showing the
     * latest message and the user who sent it
     */
    last_message: import("@mysten/bcs").BcsType<{
        sender: string;
        ciphertext: number[];
        nonce: number[];
        key_version: number;
        attachments: {
            blob_ref: string;
            encrypted_metadata: number[];
            data_nonce: number[];
            metadata_nonce: number[];
            key_version: number;
        }[];
        created_at_ms: string;
    } | null, {
        sender: string | Uint8Array<ArrayBufferLike>;
        ciphertext: Iterable<number> & {
            length: number;
        };
        nonce: Iterable<number> & {
            length: number;
        };
        key_version: number;
        attachments: Iterable<{
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
        };
        created_at_ms: string | number | bigint;
    } | null | undefined, "Option<@local-pkg/sui-stack-messaging::message::Message>">;
    /** The timestamp (in milliseconds) when the channel was created. */
    created_at_ms: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
    /**
     * The timestamp (in milliseconds) when the channel was last updated. (e.g. change
     * in metadata, members, admins, keys)
     */
    updated_at_ms: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
    /**
     * History of Encryption keys
     *
     * Holds the latest key, the latest_version, and a TableVec of the historical keys
     */
    encryption_key_history: MoveStruct<{
        latest: import("@mysten/bcs").BcsType<number[], Iterable<number> & {
            length: number;
        }, string>;
        latest_version: import("@mysten/bcs").BcsType<number, number, "u32">;
        history: MoveStruct<{
            contents: MoveStruct<{
                id: MoveStruct<{
                    id: import("@mysten/bcs").BcsType<string, string | Uint8Array<ArrayBufferLike>, "bytes[32]">;
                }, "0x2::object::UID">;
                size: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
            }, "0x2::table::Table">;
        }, "0x2::table_vec::TableVec">;
    }, "@local-pkg/sui-stack-messaging::encryption_key_history::EncryptionKeyHistory">;
}, "@local-pkg/sui-stack-messaging::channel::Channel">;
export declare const SimpleMessenger: MoveTuple<import("@mysten/bcs").BcsType<boolean, boolean, "bool">[], "@local-pkg/sui-stack-messaging::channel::SimpleMessenger">;
export interface NewArguments {
    config: RawTransactionArgument<string | null>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [config: RawTransactionArgument<string | null>];
}
/**
 * Create a new `Channel` object with empty Config, Roles, messages. Adds the
 * creator as a member.
 *
 * The flow is: new() -> (optionally set initial config) -> (optionally set initial
 * members) -> share() -> client generate a DEK and encrypt it with Seal using the
 * ChannelID as identity bytes -> add_encrypted_key(CreatorCap)
 */
export declare function _new(options: NewOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface ShareArguments {
    self: RawTransactionArgument<string>;
    creatorCap: RawTransactionArgument<string>;
}
export interface ShareOptions {
    package?: string;
    arguments: ShareArguments | [self: RawTransactionArgument<string>, creatorCap: RawTransactionArgument<string>];
}
/**
 * Share the Channel object Note: at this point the client needs to attach an
 * encrypted DEK Otherwise, it is considered in an invalid state, and cannot be
 * interacted with.
 */
export declare function share(options: ShareOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface AddEncryptedKeyArguments {
    self: RawTransactionArgument<string>;
    memberCap: RawTransactionArgument<string>;
    newEncryptionKeyBytes: RawTransactionArgument<number[]>;
}
export interface AddEncryptedKeyOptions {
    package?: string;
    arguments: AddEncryptedKeyArguments | [
        self: RawTransactionArgument<string>,
        memberCap: RawTransactionArgument<string>,
        newEncryptionKeyBytes: RawTransactionArgument<number[]>
    ];
}
/** Add the encrypted Channel Key (a key encrypted with Seal) to the Channel. */
export declare function addEncryptedKey(options: AddEncryptedKeyOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface AddMembersArguments {
    self: RawTransactionArgument<string>;
    memberCap: RawTransactionArgument<string>;
    n: RawTransactionArgument<number | bigint>;
}
export interface AddMembersOptions {
    package?: string;
    arguments: AddMembersArguments | [
        self: RawTransactionArgument<string>,
        memberCap: RawTransactionArgument<string>,
        n: RawTransactionArgument<number | bigint>
    ];
}
/** Add new members to the Channel with the default SimpleMessenger permission */
export declare function addMembers(options: AddMembersOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface RemoveMembersArguments {
    self: RawTransactionArgument<string>;
    memberCap: RawTransactionArgument<string>;
    membersToRemove: RawTransactionArgument<string[]>;
}
export interface RemoveMembersOptions {
    package?: string;
    arguments: RemoveMembersArguments | [
        self: RawTransactionArgument<string>,
        memberCap: RawTransactionArgument<string>,
        membersToRemove: RawTransactionArgument<string[]>
    ];
}
/**
 * Remove members from the Channel TODO: should we enforce a key rotation here, by
 * asking for a new_encryption_key arg?
 */
export declare function removeMembers(options: RemoveMembersOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface SendMessageArguments {
    self: RawTransactionArgument<string>;
    memberCap: RawTransactionArgument<string>;
    ciphertext: RawTransactionArgument<number[]>;
    nonce: RawTransactionArgument<number[]>;
    attachments: RawTransactionArgument<string[]>;
}
export interface SendMessageOptions {
    package?: string;
    arguments: SendMessageArguments | [
        self: RawTransactionArgument<string>,
        memberCap: RawTransactionArgument<string>,
        ciphertext: RawTransactionArgument<number[]>,
        nonce: RawTransactionArgument<number[]>,
        attachments: RawTransactionArgument<string[]>
    ];
}
/** Send a new message to the Channel */
export declare function sendMessage(options: SendMessageOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface NamespaceArguments {
    self: RawTransactionArgument<string>;
}
export interface NamespaceOptions {
    package?: string;
    arguments: NamespaceArguments | [self: RawTransactionArgument<string>];
}
/**
 * Returns a namespace for the channel to be utilized by seal_policies In this case
 * we use the Channel's UID bytes
 */
export declare function namespace(options: NamespaceOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
