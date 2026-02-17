import { Transaction } from '@mysten/sui/transactions';
import type { Signer } from '@mysten/sui/cryptography';
import type { SessionKey } from '@mysten/seal';
import type { AddedMemberCap, AddMembersOptions, AddMembersTransactionOptions, ChannelMembershipsRequest, ChannelMembershipsResponse, ChannelMembersResponse, CreateChannelFlow, CreateChannelFlowOpts, DecryptedChannelObject, DecryptedChannelObjectsByAddressResponse, DecryptedMessagesResponse, ExecuteAddMembersTransactionOptions, GetChannelMessagesRequest, GetChannelObjectsByChannelIdsRequest, GetLatestMessagesRequest, MessagingClientExtensionOptions, MessagingClientOptions, MessagingCompatibleClient } from './types.js';
import type { EncryptedSymmetricKey } from './encryption/types.js';
import { CreatorCap } from './contracts/sui_stack_messaging/creator_cap.js';
import { MemberCap } from './contracts/sui_stack_messaging/member_cap.js';
export declare class SuiStackMessagingClient {
    #private;
    options: MessagingClientOptions;
    constructor(options: MessagingClientOptions);
    /** @deprecated use `messaging()` instead */
    static experimental_asClientExtension(options: MessagingClientExtensionOptions): {
        name: "messaging";
        register: (client: MessagingCompatibleClient) => SuiStackMessagingClient;
    };
    /**
     * Get channel memberships for a user
     * @param request - Pagination and filter options
     * @returns Channel memberships with pagination info
     */
    getChannelMemberships(request: ChannelMembershipsRequest): Promise<ChannelMembershipsResponse>;
    /**
     * Get channel objects for a user (returns decrypted data)
     * @param request - Pagination and filter options
     * @returns Decrypted channel objects with pagination info
     */
    getChannelObjectsByAddress(request: ChannelMembershipsRequest): Promise<DecryptedChannelObjectsByAddressResponse>;
    /**
     * Get channel objects by channel IDs (returns decrypted data)
     * @param request - Request with channel IDs and user address, and optionally memberCapIds
     * @returns Decrypted channel objects
     */
    getChannelObjectsByChannelIds(request: GetChannelObjectsByChannelIdsRequest): Promise<DecryptedChannelObject[]>;
    /**
     * Get the CreatorCap for a specific user and channel.
     * Returns the CreatorCap if the user owns one for the specified channel, null otherwise.
     *
     * @param userAddress - The user's address
     * @param channelId - The channel ID
     * @returns CreatorCap object or null if not found
     */
    getCreatorCap(userAddress: string, channelId: string): Promise<(typeof CreatorCap)['$inferType'] | null>;
    /**
     * Get the MemberCap for a specific user and channel.
     * Returns the MemberCap if the user owns one for the specified channel, null otherwise.
     *
     * @param userAddress - The user's address
     * @param channelId - The channel ID
     * @returns MemberCap object or null if not found
     */
    getUserMemberCap(userAddress: string, channelId: string): Promise<(typeof MemberCap)['$inferType'] | null>;
    /**
     * Get all members of a channel
     * @param channelNameOrId - The channel ID or name (e.g., "#general" if channelResolver is configured)
     * @returns Channel members with addresses and member cap IDs
     */
    getChannelMembers(channelNameOrId: string): Promise<ChannelMembersResponse>;
    /**
     * Get messages from a channel with pagination (returns decrypted messages)
     * @param request - Request parameters including channelId (or channel name), userAddress, cursor, limit, and direction
     * @returns Decrypted messages with pagination info
     */
    getChannelMessages({ channelId: channelNameOrId, userAddress, cursor, limit, direction, }: GetChannelMessagesRequest): Promise<DecryptedMessagesResponse>;
    /**
     * Get new messages since last polling state (returns decrypted messages)
     * @param request - Request with channelId (or channel name), userAddress, pollingState, and limit
     * @returns New decrypted messages since last poll
     */
    getLatestMessages({ channelId: channelNameOrId, userAddress, pollingState, limit, }: GetLatestMessagesRequest): Promise<DecryptedMessagesResponse>;
    /**
     * Create a channel creation flow
     *
     * @usage
     * ```
     * const flow = await client.createChannelFlow();
     *
     * // Step-by-step execution
     * // 1. build
     * const tx = flow.build();
     * // 2. getGeneratedCaps
     * const { creatorCap, creatorMemberCap, additionalMemberCaps } = await flow.getGeneratedCaps({ digest });
     * // 3. generateAndAttachEncryptionKey
     * const { transaction, creatorCap, encryptedKeyBytes } = await flow.generateAndAttachEncryptionKey({ creatorCap, creatorMemberCap });
     * // 4. getGeneratedEncryptionKey
     * const { channelId, encryptedKeyBytes } = await flow.getGeneratedEncryptionKey({ creatorCap, encryptedKeyBytes });
     * ```
     *
     * @param opts - Options including creator address and initial members (can include SuiNS names if addressResolver is configured)
     * @returns Channel creation flow with step-by-step methods
     */
    createChannelFlow({ creatorAddress, initialMemberAddresses, }: CreateChannelFlowOpts): Promise<CreateChannelFlow>;
    /**
     * Create a send message transaction builder
     * @param channelId - The channel ID
     * @param memberCapId - The member cap ID
     * @param sender - The sender address
     * @param message - The message text
     * @param encryptedKey - The encrypted symmetric key
     * @param attachments - Optional file attachments
     * @returns Transaction builder function
     */
    sendMessage(channelId: string, memberCapId: string, sender: string, message: string, encryptedKey: EncryptedSymmetricKey, attachments?: File[]): Promise<(tx: Transaction) => Promise<void>>;
    /**
     * Execute a send message transaction
     * @param params - Transaction parameters including signer, channelId (or channel name), memberCapId, message, and encryptedKey
     * @returns Transaction digest and message ID
     */
    executeSendMessageTransaction({ signer, channelId: channelNameOrId, memberCapId, message, attachments, encryptedKey, }: {
        channelId: string;
        memberCapId: string;
        message: string;
        encryptedKey: EncryptedSymmetricKey;
        attachments?: File[];
    } & {
        signer: Signer;
    }): Promise<{
        digest: string;
        messageId: string;
    }>;
    /**
     * Append a Thunder action message to an existing transaction.
     * The action is serialized, encrypted, and added as a send_message MoveCall.
     * This allows atomic journaling: the action and its log entry succeed or fail together.
     */
    appendThunderAction(tx: Transaction, channelId: string, memberCapId: string, action: import('./thunder.js').ThunderAction, encryptedKey: EncryptedSymmetricKey, sender: string): Promise<void>;
    /**
     * Add members to a channel
     *
     * @example
     * ```ts
     * // With creatorCapId
     * tx.add(client.addMembers({
     *   channelId,
     *   memberCapId,
     *   newMemberAddresses: ['0xabc...', '0xdef...', 'alice.sui'],
     *   creatorCapId
     * }));
     *
     * // With address (auto-fetches CreatorCap)
     * tx.add(client.addMembers({
     *   channelId,
     *   memberCapId,
     *   newMemberAddresses: ['0xabc...', '0xdef...', 'bob.sui'],
     *   address: signer.toSuiAddress()
     * }));
     * ```
     */
    addMembers(options: AddMembersOptions): (tx: Transaction) => Promise<void>;
    /**
     * Create a transaction that adds members to a channel
     *
     * @example
     * ```ts
     * // With creatorCapId
     * const tx = await client.addMembersTransaction({
     *   channelId,
     *   memberCapId,
     *   newMemberAddresses: ['0xabc...', '0xdef...'],
     *   creatorCapId
     * });
     *
     * // With address (auto-fetches CreatorCap)
     * const tx = await client.addMembersTransaction({
     *   channelId,
     *   memberCapId,
     *   newMemberAddresses: ['0xabc...', '0xdef...'],
     *   address: '0x...'
     * });
     * ```
     */
    addMembersTransaction({ transaction, ...options }: AddMembersTransactionOptions): Promise<Transaction>;
    /**
     * Execute a transaction that adds members to a channel.
     * If `creatorCapId` is not provided, it will be auto-fetched using the signer's address.
     *
     * @example
     * ```ts
     * // With creatorCapId
     * const { digest, addedMembers } = await client.executeAddMembersTransaction({
     *   channelId,
     *   memberCapId,
     *   newMemberAddresses: ['0xabc...', '0xdef...'],
     *   creatorCapId,
     *   signer
     * });
     *
     * // Without creatorCapId (auto-fetches using signer's address)
     * const { digest, addedMembers } = await client.executeAddMembersTransaction({
     *   channelId,
     *   memberCapId,
     *   newMemberAddresses: ['0xabc...', '0xdef...'],
     *   signer
     * });
     * // addedMembers contains { memberCap, ownerAddress } for each added member
     * ```
     */
    executeAddMembersTransaction({ signer, transaction, ...options }: ExecuteAddMembersTransactionOptions): Promise<{
        digest: string;
        addedMembers: AddedMemberCap[];
    }>;
    /**
     * Update the external SessionKey instance (useful for React context updates)
     * Only works when the client was configured with an external SessionKey
     */
    updateSessionKey(newSessionKey: SessionKey): void;
    /**
     * Force refresh the managed SessionKey (useful for testing or manual refresh)
     * Only works when the client was configured with SessionKeyConfig
     */
    refreshSessionKey(): Promise<SessionKey>;
    /**
     * Execute a create channel transaction
     * @param params - Transaction parameters including signer and optional initial members
     * @returns Transaction digest, channel ID, creator cap ID, and encrypted key
     */
    executeCreateChannelTransaction({ signer, initialMembers, }: {
        initialMembers?: string[];
    } & {
        signer: Signer;
    }): Promise<{
        digest: string;
        channelId: string;
        creatorCapId: string;
        encryptedKeyBytes: Uint8Array<ArrayBuffer>;
    }>;
}
/**
 * Creates a client extension for Sui Stack Messaging.
 *
 * @example
 * ```typescript
 * const client = new SuiClient({ url: '...' })
 *   .$extend(SealClient.asClientExtension({ serverConfigs: [...] }))
 *   .$extend(messaging({
 *     walrusStorageConfig: { publisher: '...', aggregator: '...', epochs: 1 },
 *     sessionKeyConfig: { address: '...', ttlMin: 30 },
 *   }));
 *
 * // Access messaging functionality
 * const { channelId } = await client.messaging.executeCreateChannelTransaction({ signer });
 * ```
 */
export declare function messaging(options: MessagingClientExtensionOptions): {
    name: "messaging";
    register: (client: MessagingCompatibleClient) => SuiStackMessagingClient;
};
