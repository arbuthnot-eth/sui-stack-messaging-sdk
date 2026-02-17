import { MoveTuple, MoveStruct } from '../utils/index.js';
import type { RawTransactionArgument } from '../utils/index.js';
import type { Transaction } from '@mysten/sui/transactions';
export declare const EditConfig: MoveTuple<import("@mysten/bcs").BcsType<boolean, boolean, "bool">[], "@local-pkg/sui-stack-messaging::config::EditConfig">;
export declare const Config: MoveStruct<{
    max_channel_members: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
    max_channel_roles: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
    max_message_text_chars: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
    max_message_attachments: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
    require_invitation: import("@mysten/bcs").BcsType<boolean, boolean, "bool">;
    require_request: import("@mysten/bcs").BcsType<boolean, boolean, "bool">;
    emit_events: import("@mysten/bcs").BcsType<boolean, boolean, "bool">;
}, "@local-pkg/sui-stack-messaging::config::Config">;
export interface DefaultOptions {
    package?: string;
    arguments?: [];
}
export declare function _default(options?: DefaultOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface NewArguments {
    maxChannelMembers: RawTransactionArgument<number | bigint>;
    maxChannelRoles: RawTransactionArgument<number | bigint>;
    maxMessageTextChars: RawTransactionArgument<number | bigint>;
    maxMessageAttachments: RawTransactionArgument<number | bigint>;
    requireInvitation: RawTransactionArgument<boolean>;
    requireRequest: RawTransactionArgument<boolean>;
    emitEvents: RawTransactionArgument<boolean>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        maxChannelMembers: RawTransactionArgument<number | bigint>,
        maxChannelRoles: RawTransactionArgument<number | bigint>,
        maxMessageTextChars: RawTransactionArgument<number | bigint>,
        maxMessageAttachments: RawTransactionArgument<number | bigint>,
        requireInvitation: RawTransactionArgument<boolean>,
        requireRequest: RawTransactionArgument<boolean>,
        emitEvents: RawTransactionArgument<boolean>
    ];
}
export declare function _new(options: NewOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface NoneOptions {
    package?: string;
    arguments?: [];
}
export declare function none(options?: NoneOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface IsValidConfigArguments {
    config: RawTransactionArgument<string>;
}
export interface IsValidConfigOptions {
    package?: string;
    arguments: IsValidConfigArguments | [config: RawTransactionArgument<string>];
}
export declare function isValidConfig(options: IsValidConfigOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface ConfigMaxChannelMembersArguments {
    self: RawTransactionArgument<string>;
}
export interface ConfigMaxChannelMembersOptions {
    package?: string;
    arguments: ConfigMaxChannelMembersArguments | [self: RawTransactionArgument<string>];
}
export declare function configMaxChannelMembers(options: ConfigMaxChannelMembersOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface ConfigMaxChannelRolesArguments {
    self: RawTransactionArgument<string>;
}
export interface ConfigMaxChannelRolesOptions {
    package?: string;
    arguments: ConfigMaxChannelRolesArguments | [self: RawTransactionArgument<string>];
}
export declare function configMaxChannelRoles(options: ConfigMaxChannelRolesOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface ConfigMaxMessageTextCharsArguments {
    self: RawTransactionArgument<string>;
}
export interface ConfigMaxMessageTextCharsOptions {
    package?: string;
    arguments: ConfigMaxMessageTextCharsArguments | [self: RawTransactionArgument<string>];
}
export declare function configMaxMessageTextChars(options: ConfigMaxMessageTextCharsOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface ConfigMaxMessageAttachmentsArguments {
    self: RawTransactionArgument<string>;
}
export interface ConfigMaxMessageAttachmentsOptions {
    package?: string;
    arguments: ConfigMaxMessageAttachmentsArguments | [self: RawTransactionArgument<string>];
}
export declare function configMaxMessageAttachments(options: ConfigMaxMessageAttachmentsOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface ConfigRequireInvitationArguments {
    self: RawTransactionArgument<string>;
}
export interface ConfigRequireInvitationOptions {
    package?: string;
    arguments: ConfigRequireInvitationArguments | [self: RawTransactionArgument<string>];
}
export declare function configRequireInvitation(options: ConfigRequireInvitationOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface ConfigRequireRequestArguments {
    self: RawTransactionArgument<string>;
}
export interface ConfigRequireRequestOptions {
    package?: string;
    arguments: ConfigRequireRequestArguments | [self: RawTransactionArgument<string>];
}
export declare function configRequireRequest(options: ConfigRequireRequestOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
export interface ConfigEmitEventsArguments {
    self: RawTransactionArgument<string>;
}
export interface ConfigEmitEventsOptions {
    package?: string;
    arguments: ConfigEmitEventsArguments | [self: RawTransactionArgument<string>];
}
export declare function configEmitEvents(options: ConfigEmitEventsOptions): (tx: Transaction) => import("@mysten/sui/transactions").TransactionResult;
