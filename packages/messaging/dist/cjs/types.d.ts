import type { ClientWithExtensions, CoreClient, SuiClientTypes } from '@mysten/sui/client';
import type { SealClient, SessionKey } from '@mysten/seal';
import type { WalrusClient } from '@mysten/walrus';
import type { Transaction } from '@mysten/sui/transactions';
import type { Signer } from '@mysten/sui/cryptography';
import type { AttachmentMetadata, EncryptedSymmetricKey, SealApproveContract, SealConfig, SessionKeyConfig } from './encryption/types.js';
import type { MemberCap } from './contracts/sui_stack_messaging/member_cap.js';
import type { CreatorCap } from './contracts/sui_stack_messaging/creator_cap.js';
import type { StorageAdapter, StorageConfig } from './storage/adapters/storage.js';
import type { AddressResolver } from './utils/addressResolution.js';
import type { ChannelNameResolver } from './utils/channelResolution.js';
import type { Channel } from './contracts/sui_stack_messaging/channel.js';
import type { Message } from './contracts/sui_stack_messaging/message.js';
interface BaseMessagingClientExtensionOptions {
    packageConfig?: MessagingPackageConfig;
    /**
     * Seal operation configuration (optional)
     * Note: This configures Seal operation parameters, not key servers
     * Key servers are configured separately via SealClient.asClientExtension()
     */
    sealConfig?: SealConfig;
    /**
     * Optional address resolver for resolving SuiNS names to addresses.
     * When provided, methods like createChannelFlow() and addMembers() will automatically
     * resolve SuiNS names (e.g., "alice.sui") to their corresponding addresses.
     */
    addressResolver?: AddressResolver;
    /**
     * Optional channel name resolver for resolving human-readable channel names to IDs.
     * When provided, methods can accept channel names (e.g., "#general") instead of
     * raw channel object IDs.
     */
    channelResolver?: ChannelNameResolver;
}
type StorageOptions = {
    storage: (client: MessagingCompatibleClient) => StorageAdapter;
} | {
    walrusStorageConfig: StorageConfig;
};
type SealSessionKeyOptions = {
    sessionKey: SessionKey;
} | {
    sessionKeyConfig: SessionKeyConfig;
};
export type MessagingClientExtensionOptions = BaseMessagingClientExtensionOptions & StorageOptions & SealSessionKeyOptions;
export interface MessagingClientOptions {
    suiClient: MessagingCompatibleClient;
    storage: (client: MessagingCompatibleClient) => StorageAdapter;
    packageConfig?: MessagingPackageConfig;
    sessionKeyConfig?: SessionKeyConfig;
    sessionKey?: SessionKey;
    sealConfig?: SealConfig;
    addressResolver?: AddressResolver;
    channelResolver?: ChannelNameResolver;
}
export interface CreateChannelFlowOpts {
    creatorAddress: string;
    initialMemberAddresses?: string[];
}
export interface CreateChannelFlowGenerateAndAttachEncryptionKeyOpts {
    creatorMemberCap: (typeof MemberCap)['$inferType'];
}
export interface CreateChannelFlowGetGeneratedCapsOpts {
    digest: string;
}
export interface CreateChannelFlow {
    build: () => Transaction;
    getGeneratedCaps: (opts: CreateChannelFlowGetGeneratedCapsOpts) => Promise<{
        creatorCap: (typeof CreatorCap)['$inferType'];
        creatorMemberCap: (typeof MemberCap)['$inferType'];
        additionalMemberCaps: (typeof MemberCap)['$inferType'][];
    }>;
    generateAndAttachEncryptionKey: (opts: CreateChannelFlowGenerateAndAttachEncryptionKeyOpts) => Promise<Transaction>;
    getGeneratedEncryptionKey: () => {
        channelId: string;
        encryptedKeyBytes: Uint8Array<ArrayBuffer>;
    };
}
interface AddMembersBaseOptions {
    channelId: string;
    memberCapId: string;
    newMemberAddresses: string[];
}
export interface AddMembersWithCreatorCapId extends AddMembersBaseOptions {
    creatorCapId: string;
    address?: never;
}
export interface AddMembersWithAddress extends AddMembersBaseOptions {
    creatorCapId?: never;
    /**
     * The address to use for fetching the CreatorCap.
     * Required when creatorCapId is not provided.
     */
    address: string;
}
/**
 * Options for adding members to a channel.
 * Either provide `creatorCapId` directly, or provide `address` to auto-fetch the CreatorCap.
 */
export type AddMembersOptions = AddMembersWithCreatorCapId | AddMembersWithAddress;
export interface AddMembersTransactionOptions extends AddMembersBaseOptions {
    transaction?: Transaction;
    creatorCapId?: string;
    address?: string;
}
export interface ExecuteAddMembersTransactionOptions extends AddMembersBaseOptions {
    transaction?: Transaction;
    signer: Signer;
    creatorCapId?: string;
}
export interface AddedMemberCap {
    memberCap: (typeof MemberCap)['$inferType'];
    ownerAddress: string;
}
export interface MessagingPackageConfig {
    packageId: string;
    sealApproveContract?: SealApproveContract;
}
export type MessagingCompatibleClient = ClientWithExtensions<{
    core: CoreClient;
    seal: SealClient;
    walrus?: WalrusClient;
}>;
type MessagingOwnedObjects = Omit<SuiClientTypes.ListOwnedObjectsOptions, 'type'>;
export type PaginatedResponse<T> = T & {
    hasNextPage: boolean;
    cursor: string | null;
};
export type ChannelMembershipsRequest = MessagingOwnedObjects;
export type ParsedChannelObject = (typeof Channel)['$inferType'];
export type ParsedMessageObject = (typeof Message)['$inferType'];
export type Membership = {
    member_cap_id: string;
    channel_id: string;
};
export type ChannelMembershipsResponse = PaginatedResponse<{
    memberships: Membership[];
}>;
export type ChannelObjectsByMembershipsResponse = PaginatedResponse<{
    channelObjects: ParsedChannelObject[];
}>;
export interface GetChannelObjectsByChannelIdsRequest {
    channelIds: string[];
    userAddress: string;
    memberCapIds?: string[];
}
export type ChannelMember = {
    memberAddress: string;
    memberCapId: string;
};
export type ChannelMembersResponse = {
    members: ChannelMember[];
};
export type ChannelMessagesEncryptedRequest = Omit<SuiClientTypes.ListDynamicFieldsOptions, 'parentId'> & {
    channelId: string;
};
export type ChannelMessagesEncryptedResponse = PaginatedResponse<{
    messageObjects: ParsedMessageObject[];
}>;
export type ChannelMessagesDecryptedRequest = ChannelMessagesEncryptedRequest & {
    encryptedKey: EncryptedSymmetricKey;
    memberCapId: string;
};
export interface PollingState {
    lastMessageCount: bigint;
    lastCursor: bigint | null;
    channelId: string;
}
export interface GetLatestMessagesRequest {
    channelId: string;
    userAddress: string;
    pollingState: PollingState;
    limit?: number;
}
export interface GetChannelMessagesRequest {
    channelId: string;
    userAddress: string;
    cursor?: bigint | null;
    limit?: number;
    direction?: 'backward' | 'forward';
}
export interface MessagesResponse {
    messages: ParsedMessageObject[];
    cursor: bigint | null;
    hasNextPage: boolean;
    direction: 'backward' | 'forward';
}
export interface LazyDecryptAttachmentResult extends AttachmentMetadata {
    data: Promise<Uint8Array<ArrayBuffer>>;
}
export interface DecryptMessageResult {
    text: string;
    sender: string;
    createdAtMs: string;
    attachments?: LazyDecryptAttachmentResult[];
}
export interface DecryptedMessage {
    text: string;
    sender: string;
    createdAtMs: string;
    attachments?: LazyDecryptAttachmentResult[];
}
export interface DecryptedChannelObject extends Omit<ParsedChannelObject, 'last_message'> {
    last_message?: DecryptedMessage | null;
}
export interface DecryptedMessagesResponse {
    messages: DecryptedMessage[];
    cursor: bigint | null;
    hasNextPage: boolean;
    direction: 'backward' | 'forward';
}
export interface DecryptedChannelObjectsByAddressResponse extends Omit<ChannelObjectsByMembershipsResponse, 'channelObjects'> {
    channelObjects: DecryptedChannelObject[];
}
export {};
