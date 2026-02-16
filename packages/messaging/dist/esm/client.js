var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _suiClient, _packageConfig, _storage, _envelopeEncryption, _sealConfig, _addressResolver, _channelResolver, _SuiStackMessagingClient_instances, resolveAddresses_fn, resolveChannelId_fn, getUserMemberCapId_fn, getEncryptionKeyFromChannel_fn, decryptMessage_fn, createAttachmentsVec_fn, resolveCreatorCapId_fn, executeTransaction_fn, getGeneratedCaps_fn, getCreatedObjectsByType_fn, deduplicateAddresses_fn, deriveMessageIDsFromRange_fn, parseMessageObjects_fn, createLazyAttachmentDataPromise_fn, calculateFetchRange_fn, fetchMessagesInRange_fn, determineNextPagination_fn, createEmptyMessagesResponse_fn, findOwnedObjectByChannelId_fn, getObjectContents_fn;
import { Transaction } from "@mysten/sui/transactions";
import { deriveDynamicFieldID } from "@mysten/sui/utils";
import { bcs } from "@mysten/sui/bcs";
import { getLogger, LOG_CATEGORIES } from "./logging/index.js";
import {
  _new as newChannel,
  addEncryptedKey,
  share as shareChannel,
  sendMessage,
  addMembers,
  Channel
} from "./contracts/sui_stack_messaging/channel.js";
import { _new as newAttachment, Attachment } from "./contracts/sui_stack_messaging/attachment.js";
import {
  MAINNET_MESSAGING_PACKAGE_CONFIG,
  TESTNET_MESSAGING_PACKAGE_CONFIG,
  DEFAULT_SEAL_APPROVE_CONTRACT
} from "./constants.js";
import { MessagingClientError } from "./error.js";
import { WalrusStorageAdapter } from "./storage/adapters/walrus/walrus.js";
import { EnvelopeEncryption } from "./encryption/envelopeEncryption.js";
import {
  CreatorCap,
  transferToSender as transferCreatorCap
} from "./contracts/sui_stack_messaging/creator_cap.js";
import {
  MemberCap,
  transferMemberCaps,
  transferToRecipient as transferMemberCap
} from "./contracts/sui_stack_messaging/member_cap.js";
import { none as noneConfig } from "./contracts/sui_stack_messaging/config.js";
import { Message } from "./contracts/sui_stack_messaging/message.js";
const _SuiStackMessagingClient = class _SuiStackMessagingClient {
  // TODO: Leave the responsibility of caching to the caller
  // #encryptedChannelDEKCache: Map<string, EncryptedSymmetricKey> = new Map(); // channelId --> EncryptedSymmetricKey
  // #channelMessagesTableIdCache: Map<string, string> = new Map<string, string>(); // channelId --> messagesTableId
  constructor(options) {
    this.options = options;
    __privateAdd(this, _SuiStackMessagingClient_instances);
    __privateAdd(this, _suiClient);
    __privateAdd(this, _packageConfig);
    __privateAdd(this, _storage);
    __privateAdd(this, _envelopeEncryption);
    __privateAdd(this, _sealConfig);
    __privateAdd(this, _addressResolver);
    __privateAdd(this, _channelResolver);
    __privateSet(this, _suiClient, options.suiClient);
    __privateSet(this, _storage, options.storage);
    __privateSet(this, _sealConfig, {
      threshold: options.sealConfig?.threshold ?? 2
      // Default threshold of 2
    });
    if (!options.packageConfig) {
      const network = __privateGet(this, _suiClient).network;
      switch (network) {
        case "testnet":
          __privateSet(this, _packageConfig, TESTNET_MESSAGING_PACKAGE_CONFIG);
          break;
        case "mainnet":
          __privateSet(this, _packageConfig, MAINNET_MESSAGING_PACKAGE_CONFIG);
          break;
        default:
          __privateSet(this, _packageConfig, TESTNET_MESSAGING_PACKAGE_CONFIG);
          break;
      }
    } else {
      __privateSet(this, _packageConfig, options.packageConfig);
    }
    const sealApproveContract = __privateGet(this, _packageConfig).sealApproveContract ?? {
      packageId: __privateGet(this, _packageConfig).packageId,
      ...DEFAULT_SEAL_APPROVE_CONTRACT
    };
    __privateSet(this, _envelopeEncryption, new EnvelopeEncryption({
      suiClient: __privateGet(this, _suiClient),
      sealApproveContract,
      sessionKey: options.sessionKey,
      sessionKeyConfig: options.sessionKeyConfig,
      sealConfig: __privateGet(this, _sealConfig)
    }));
    __privateSet(this, _addressResolver, options.addressResolver);
    __privateSet(this, _channelResolver, options.channelResolver);
  }
  /** @deprecated use `messaging()` instead */
  static experimental_asClientExtension(options) {
    return {
      name: "messaging",
      register: (client) => {
        const sealClient = client.seal;
        if (!sealClient) {
          throw new MessagingClientError("SealClient extension is required for MessagingClient");
        }
        if (!("storage" in options) && !("walrusStorageConfig" in options)) {
          throw new MessagingClientError(
            'Either a custom storage adapter via "storage" option or explicit Walrus storage configuration via "walrusStorageConfig" option must be provided. Fallback to default Walrus endpoints is not supported.'
          );
        }
        let packageConfig = options.packageConfig;
        if (!packageConfig) {
          const network = client.network;
          switch (network) {
            case "testnet":
              packageConfig = TESTNET_MESSAGING_PACKAGE_CONFIG;
              break;
            case "mainnet":
              packageConfig = MAINNET_MESSAGING_PACKAGE_CONFIG;
              break;
            default:
              packageConfig = TESTNET_MESSAGING_PACKAGE_CONFIG;
              break;
          }
        }
        const storage = "storage" in options ? (c) => options.storage(c) : (c) => {
          return new WalrusStorageAdapter(c, options.walrusStorageConfig);
        };
        return new _SuiStackMessagingClient({
          suiClient: client,
          storage,
          packageConfig,
          sessionKey: "sessionKey" in options ? options.sessionKey : void 0,
          sessionKeyConfig: "sessionKeyConfig" in options ? options.sessionKeyConfig : void 0,
          sealConfig: options.sealConfig,
          addressResolver: options.addressResolver,
          channelResolver: options.channelResolver
        });
      }
    };
  }
  // ===== Read Path =====
  /**
   * Get channel memberships for a user
   * @param request - Pagination and filter options
   * @returns Channel memberships with pagination info
   */
  async getChannelMemberships(request) {
    const memberCapsRes = await __privateGet(this, _suiClient).core.listOwnedObjects({
      ...request,
      type: MemberCap.name.replace("@local-pkg/sui-stack-messaging", __privateGet(this, _packageConfig).packageId),
      include: { content: true }
    });
    const validObjects = memberCapsRes.objects;
    if (validObjects.length === 0) {
      return {
        hasNextPage: memberCapsRes.hasNextPage,
        cursor: memberCapsRes.cursor,
        memberships: []
      };
    }
    const contents = await __privateMethod(this, _SuiStackMessagingClient_instances, getObjectContents_fn).call(this, validObjects);
    const memberships = await Promise.all(
      contents.map(async (content) => {
        const parsedMemberCap = MemberCap.parse(content);
        return { member_cap_id: parsedMemberCap.id.id, channel_id: parsedMemberCap.channel_id };
      })
    );
    return {
      hasNextPage: memberCapsRes.hasNextPage,
      cursor: memberCapsRes.cursor,
      memberships
    };
  }
  /**
   * Get channel objects for a user (returns decrypted data)
   * @param request - Pagination and filter options
   * @returns Decrypted channel objects with pagination info
   */
  async getChannelObjectsByAddress(request) {
    const membershipsPaginated = await this.getChannelMemberships(request);
    const seenChannelIds = /* @__PURE__ */ new Set();
    const deduplicatedMemberships = membershipsPaginated.memberships.filter((m) => {
      if (seenChannelIds.has(m.channel_id)) {
        return false;
      }
      seenChannelIds.add(m.channel_id);
      return true;
    });
    const channelObjects = await this.getChannelObjectsByChannelIds({
      channelIds: deduplicatedMemberships.map((m) => m.channel_id),
      userAddress: request.owner,
      memberCapIds: deduplicatedMemberships.map((m) => m.member_cap_id)
    });
    return {
      hasNextPage: membershipsPaginated.hasNextPage,
      cursor: membershipsPaginated.cursor,
      channelObjects
    };
  }
  /**
   * Get channel objects by channel IDs (returns decrypted data)
   * @param request - Request with channel IDs and user address, and optionally memberCapIds
   * @returns Decrypted channel objects
   */
  async getChannelObjectsByChannelIds(request) {
    const logger = getLogger(LOG_CATEGORIES.CLIENT_READS);
    const { channelIds, userAddress, memberCapIds } = request;
    logger.debug("Fetching channel objects by IDs", {
      channelCount: channelIds.length,
      userAddress
    });
    const channelObjectsRes = await __privateGet(this, _suiClient).core.getObjects({
      objectIds: channelIds,
      include: { content: true }
    });
    const parsedChannels = await Promise.all(
      channelObjectsRes.objects.map(async (object) => {
        if (object instanceof Error || !object.content) {
          throw new MessagingClientError(`Failed to parse Channel object: ${object}`);
        }
        return Channel.parse(await object.content);
      })
    );
    const decryptedChannels = await Promise.all(
      parsedChannels.map(async (channel, index) => {
        const decryptedChannel = {
          ...channel,
          last_message: null
        };
        if (channel.last_message) {
          try {
            const memberCapId = memberCapIds?.[index] || await __privateMethod(this, _SuiStackMessagingClient_instances, getUserMemberCapId_fn).call(this, userAddress, channel.id.id);
            const encryptedKey = await __privateMethod(this, _SuiStackMessagingClient_instances, getEncryptionKeyFromChannel_fn).call(this, channel);
            const decryptedMessage = await __privateMethod(this, _SuiStackMessagingClient_instances, decryptMessage_fn).call(this, channel.last_message, channel.id.id, memberCapId, encryptedKey);
            decryptedChannel.last_message = decryptedMessage;
          } catch (error) {
            logger.warn("Failed to decrypt last message for channel", {
              channelId: channel.id.id,
              error: error instanceof Error ? error.message : String(error)
            });
            decryptedChannel.last_message = null;
          }
        }
        return decryptedChannel;
      })
    );
    logger.info("Retrieved channel objects", {
      channelCount: decryptedChannels.length,
      channelIds: decryptedChannels.map((c) => c.id.id),
      userAddress
    });
    return decryptedChannels;
  }
  /**
   * Get the CreatorCap for a specific user and channel.
   * Returns the CreatorCap if the user owns one for the specified channel, null otherwise.
   *
   * @param userAddress - The user's address
   * @param channelId - The channel ID
   * @returns CreatorCap object or null if not found
   */
  async getCreatorCap(userAddress, channelId) {
    const logger = getLogger(LOG_CATEGORIES.CLIENT_READS);
    logger.debug("Fetching CreatorCap", { userAddress, channelId });
    const creatorCap = await __privateMethod(this, _SuiStackMessagingClient_instances, findOwnedObjectByChannelId_fn).call(this, CreatorCap, userAddress, channelId);
    if (creatorCap) {
      logger.info("Found CreatorCap", {
        userAddress,
        channelId,
        creatorCapId: creatorCap.id.id
      });
    } else {
      logger.debug("CreatorCap not found", { userAddress, channelId });
    }
    return creatorCap;
  }
  /**
   * Get the MemberCap for a specific user and channel.
   * Returns the MemberCap if the user owns one for the specified channel, null otherwise.
   *
   * @param userAddress - The user's address
   * @param channelId - The channel ID
   * @returns MemberCap object or null if not found
   */
  async getUserMemberCap(userAddress, channelId) {
    const logger = getLogger(LOG_CATEGORIES.CLIENT_READS);
    logger.debug("Fetching MemberCap", { userAddress, channelId });
    const memberCap = await __privateMethod(this, _SuiStackMessagingClient_instances, findOwnedObjectByChannelId_fn).call(this, MemberCap, userAddress, channelId);
    if (memberCap) {
      logger.info("Found MemberCap", {
        userAddress,
        channelId,
        memberCapId: memberCap.id.id
      });
    } else {
      logger.debug("MemberCap not found", { userAddress, channelId });
    }
    return memberCap;
  }
  /**
   * Get all members of a channel
   * @param channelNameOrId - The channel ID or name (e.g., "#general" if channelResolver is configured)
   * @returns Channel members with addresses and member cap IDs
   */
  async getChannelMembers(channelNameOrId) {
    const channelId = await __privateMethod(this, _SuiStackMessagingClient_instances, resolveChannelId_fn).call(this, channelNameOrId);
    const logger = getLogger(LOG_CATEGORIES.CLIENT_READS);
    logger.debug("Fetching channel members", { channelId, originalInput: channelNameOrId });
    const channelObjectsRes = await __privateGet(this, _suiClient).core.getObjects({
      objectIds: [channelId],
      include: { content: true }
    });
    const channelObject = channelObjectsRes.objects[0];
    if (channelObject instanceof Error || !channelObject.content) {
      throw new MessagingClientError(`Failed to parse Channel object: ${channelObject}`);
    }
    const channel = Channel.parse(await channelObject.content);
    const memberCapIds = channel.auth.member_permissions.contents.map((entry) => entry.key);
    if (memberCapIds.length === 0) {
      return { members: [] };
    }
    const memberCapObjects = await __privateGet(this, _suiClient).core.getObjects({
      objectIds: memberCapIds,
      include: { content: true }
    });
    const members = [];
    for (const obj of memberCapObjects.objects) {
      if (obj instanceof Error || !obj.content) {
        logger.warn("Failed to fetch MemberCap object", {
          channelId,
          error: obj instanceof Error ? obj.message : "No content in object"
        });
        continue;
      }
      try {
        const memberCap = MemberCap.parse(await obj.content);
        if (obj.owner) {
          let memberAddress;
          if (obj.owner.$kind === "AddressOwner") {
            memberAddress = obj.owner.AddressOwner;
          } else if (obj.owner.$kind === "ObjectOwner") {
            logger.warn("MemberCap is object-owned, skipping", {
              channelId,
              memberCapId: memberCap.id.id
            });
            continue;
          } else {
            logger.warn("MemberCap has unknown ownership type", {
              channelId,
              ownerKind: obj.owner.$kind
            });
            continue;
          }
          members.push({
            memberAddress,
            memberCapId: memberCap.id.id
          });
        }
      } catch (error) {
        logger.warn("Failed to parse MemberCap object", {
          channelId,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    logger.info("Retrieved channel members", {
      channelId,
      memberCount: members.length,
      memberCapIds: members.map((m) => m.memberCapId)
    });
    return { members };
  }
  /**
   * Get messages from a channel with pagination (returns decrypted messages)
   * @param request - Request parameters including channelId (or channel name), userAddress, cursor, limit, and direction
   * @returns Decrypted messages with pagination info
   */
  async getChannelMessages({
    channelId: channelNameOrId,
    userAddress,
    cursor = null,
    limit = 50,
    direction = "backward"
  }) {
    const channelId = await __privateMethod(this, _SuiStackMessagingClient_instances, resolveChannelId_fn).call(this, channelNameOrId);
    const logger = getLogger(LOG_CATEGORIES.CLIENT_READS);
    logger.debug("Fetching channel messages", {
      channelId,
      originalInput: channelNameOrId,
      userAddress,
      cursor,
      limit,
      direction
    });
    const channelObjectsRes = await __privateGet(this, _suiClient).core.getObjects({
      objectIds: [channelId],
      include: { content: true }
    });
    const channelObject = channelObjectsRes.objects[0];
    if (channelObject instanceof Error || !channelObject.content) {
      throw new MessagingClientError(`Failed to parse Channel object: ${channelObject}`);
    }
    const channel = Channel.parse(await channelObject.content);
    const messagesTableId = channel.messages.contents.id.id;
    const totalMessagesCount = BigInt(channel.messages_count);
    if (totalMessagesCount === BigInt(0)) {
      return __privateMethod(this, _SuiStackMessagingClient_instances, createEmptyMessagesResponse_fn).call(this, direction);
    }
    if (cursor !== null && cursor >= totalMessagesCount) {
      throw new MessagingClientError(
        `Cursor ${cursor} is out of bounds. Channel has ${totalMessagesCount} messages.`
      );
    }
    const fetchRange = __privateMethod(this, _SuiStackMessagingClient_instances, calculateFetchRange_fn).call(this, {
      cursor,
      limit,
      direction,
      totalMessagesCount
    });
    if (fetchRange.startIndex >= fetchRange.endIndex) {
      return __privateMethod(this, _SuiStackMessagingClient_instances, createEmptyMessagesResponse_fn).call(this, direction);
    }
    const rawMessages = await __privateMethod(this, _SuiStackMessagingClient_instances, fetchMessagesInRange_fn).call(this, messagesTableId, fetchRange);
    const memberCapId = await __privateMethod(this, _SuiStackMessagingClient_instances, getUserMemberCapId_fn).call(this, userAddress, channelId);
    const encryptedKey = await __privateMethod(this, _SuiStackMessagingClient_instances, getEncryptionKeyFromChannel_fn).call(this, channel);
    const decryptedMessages = await Promise.all(
      rawMessages.map(async (message) => {
        try {
          return await __privateMethod(this, _SuiStackMessagingClient_instances, decryptMessage_fn).call(this, message, channelId, memberCapId, encryptedKey);
        } catch (error) {
          logger.warn("Failed to decrypt message in channel", {
            channelId,
            sender: message.sender,
            error: error instanceof Error ? error.message : String(error)
          });
          return {
            text: "[Failed to decrypt message]",
            sender: message.sender,
            createdAtMs: message.created_at_ms,
            attachments: []
          };
        }
      })
    );
    const nextPagination = __privateMethod(this, _SuiStackMessagingClient_instances, determineNextPagination_fn).call(this, {
      fetchRange,
      direction,
      totalMessagesCount
    });
    logger.info("Retrieved channel messages", {
      channelId,
      messagesTableId,
      messageCount: decryptedMessages.length,
      fetchRange: `${fetchRange.startIndex}-${fetchRange.endIndex}`,
      cursor: nextPagination.cursor,
      hasNextPage: nextPagination.hasNextPage,
      direction
    });
    return {
      messages: decryptedMessages,
      cursor: nextPagination.cursor,
      hasNextPage: nextPagination.hasNextPage,
      direction
    };
  }
  /**
   * Get new messages since last polling state (returns decrypted messages)
   * @param request - Request with channelId (or channel name), userAddress, pollingState, and limit
   * @returns New decrypted messages since last poll
   */
  async getLatestMessages({
    channelId: channelNameOrId,
    userAddress,
    pollingState,
    limit = 50
  }) {
    const channelId = await __privateMethod(this, _SuiStackMessagingClient_instances, resolveChannelId_fn).call(this, channelNameOrId);
    const channelObjectsRes = await __privateGet(this, _suiClient).core.getObjects({
      objectIds: [channelId],
      include: { content: true }
    });
    const channelObject = channelObjectsRes.objects[0];
    if (channelObject instanceof Error || !channelObject.content) {
      throw new MessagingClientError(`Failed to parse Channel object: ${channelObject}`);
    }
    const channel = Channel.parse(await channelObject.content);
    const latestMessageCount = BigInt(channel.messages_count);
    const newMessagesCount = latestMessageCount - pollingState.lastMessageCount;
    if (newMessagesCount === BigInt(0)) {
      return {
        messages: [],
        cursor: pollingState.lastCursor,
        hasNextPage: pollingState.lastCursor !== null,
        direction: "backward"
      };
    }
    const fetchLimit = Math.min(Number(newMessagesCount), limit);
    const response = await this.getChannelMessages({
      channelId,
      userAddress,
      cursor: pollingState.lastCursor,
      limit: fetchLimit,
      direction: "backward"
    });
    return response;
  }
  // ===== Write Path =====
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
  async createChannelFlow({
    creatorAddress,
    initialMemberAddresses
  }) {
    const resolvedInitialMemberAddresses = initialMemberAddresses ? await __privateMethod(this, _SuiStackMessagingClient_instances, resolveAddresses_fn).call(this, initialMemberAddresses) : void 0;
    const pkg = __privateGet(this, _packageConfig).packageId;
    const build = () => {
      const logger = getLogger(LOG_CATEGORIES.CLIENT_WRITES);
      const tx = new Transaction();
      const config = tx.add(noneConfig({ package: pkg }));
      const [channel, creatorCap, creatorMemberCap] = tx.add(
        newChannel({ package: pkg, arguments: { config } })
      );
      const uniqueAddresses = resolvedInitialMemberAddresses && resolvedInitialMemberAddresses.length > 0 ? __privateMethod(this, _SuiStackMessagingClient_instances, deduplicateAddresses_fn).call(this, resolvedInitialMemberAddresses, creatorAddress) : [];
      if (resolvedInitialMemberAddresses && uniqueAddresses.length !== resolvedInitialMemberAddresses.length) {
        logger.warn(
          "Duplicate addresses or creator address detected in initialMemberAddresses. Creator automatically receives a MemberCap. Using unique non-creator addresses only.",
          {
            originalCount: resolvedInitialMemberAddresses?.length,
            uniqueCount: uniqueAddresses.length,
            creatorAddress
          }
        );
      }
      let memberCaps = null;
      if (uniqueAddresses.length > 0) {
        memberCaps = tx.add(
          addMembers({
            package: pkg,
            arguments: {
              self: channel,
              memberCap: creatorMemberCap,
              n: uniqueAddresses.length
            }
          })
        );
      }
      tx.add(shareChannel({ package: pkg, arguments: { self: channel, creatorCap } }));
      tx.add(
        transferMemberCap({
          package: pkg,
          arguments: { cap: creatorMemberCap, creatorCap, recipient: creatorAddress }
        })
      );
      if (memberCaps !== null) {
        tx.add(
          transferMemberCaps({
            package: pkg,
            arguments: {
              memberAddresses: tx.pure.vector("address", uniqueAddresses),
              memberCaps,
              creatorCap
            }
          })
        );
      }
      tx.add(transferCreatorCap({ package: pkg, arguments: { self: creatorCap } }));
      tx.setGasBudget(5e7);
      return tx;
    };
    const getGeneratedCaps = async ({ digest }) => {
      return await __privateMethod(this, _SuiStackMessagingClient_instances, getGeneratedCaps_fn).call(this, digest);
    };
    const generateAndAttachEncryptionKey = async ({
      creatorCap,
      creatorMemberCap
    }) => {
      const encryptedKeyBytes = await __privateGet(this, _envelopeEncryption).generateEncryptedChannelDEK({
        channelId: creatorCap.channel_id
      });
      const tx = new Transaction();
      tx.add(
        addEncryptedKey({
          package: pkg,
          arguments: {
            self: tx.object(creatorCap.channel_id),
            memberCap: tx.object(creatorMemberCap.id.id),
            newEncryptionKeyBytes: tx.pure.vector("u8", encryptedKeyBytes)
          }
        })
      );
      tx.setGasBudget(5e7);
      return {
        transaction: tx,
        creatorCap,
        encryptedKeyBytes
      };
    };
    const getGeneratedEncryptionKey = ({
      creatorCap,
      encryptedKeyBytes
    }) => {
      return { channelId: creatorCap.channel_id, encryptedKeyBytes };
    };
    const stepResults = {};
    function getResults(step, current) {
      if (!stepResults[step]) {
        throw new Error(`${String(step)} must be executed before calling ${String(current)}`);
      }
      return stepResults[step];
    }
    return {
      build: () => {
        if (!stepResults.build) {
          stepResults.build = build();
        }
        return stepResults.build;
      },
      getGeneratedCaps: async (opts) => {
        getResults("build", "getGeneratedCaps");
        stepResults.getGeneratedCaps = await getGeneratedCaps(opts);
        return stepResults.getGeneratedCaps;
      },
      generateAndAttachEncryptionKey: async () => {
        stepResults.generateAndAttachEncryptionKey = await generateAndAttachEncryptionKey(
          getResults("getGeneratedCaps", "generateAndAttachEncryptionKey")
        );
        return stepResults.generateAndAttachEncryptionKey.transaction;
      },
      getGeneratedEncryptionKey: () => {
        return getGeneratedEncryptionKey(
          getResults("generateAndAttachEncryptionKey", "getGeneratedEncryptionKey")
        );
      }
    };
  }
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
  async sendMessage(channelId, memberCapId, sender, message, encryptedKey, attachments) {
    return async (tx) => {
      const channel = tx.object(channelId);
      const memberCap = tx.object(memberCapId);
      const { encryptedBytes: ciphertext, nonce: textNonce } = await __privateGet(this, _envelopeEncryption).encryptText({
        text: message,
        channelId,
        sender,
        memberCapId,
        encryptedKey
      });
      const attachmentsVec = await __privateMethod(this, _SuiStackMessagingClient_instances, createAttachmentsVec_fn).call(this, tx, encryptedKey, channelId, memberCapId, sender, attachments);
      tx.add(
        sendMessage({
          package: __privateGet(this, _packageConfig).packageId,
          arguments: {
            self: channel,
            memberCap,
            ciphertext: tx.pure.vector("u8", ciphertext),
            nonce: tx.pure.vector("u8", textNonce),
            attachments: attachmentsVec
          }
        })
      );
    };
  }
  /**
   * Execute a send message transaction
   * @param params - Transaction parameters including signer, channelId (or channel name), memberCapId, message, and encryptedKey
   * @returns Transaction digest and message ID
   */
  async executeSendMessageTransaction({
    signer,
    channelId: channelNameOrId,
    memberCapId,
    message,
    attachments,
    encryptedKey
  }) {
    const channelId = await __privateMethod(this, _SuiStackMessagingClient_instances, resolveChannelId_fn).call(this, channelNameOrId);
    const logger = getLogger(LOG_CATEGORIES.CLIENT_WRITES);
    const senderAddress = signer.toSuiAddress();
    logger.debug("Sending message", {
      channelId,
      originalInput: channelNameOrId,
      memberCapId,
      senderAddress,
      messageLength: message.length,
      attachmentCount: attachments?.length ?? 0
    });
    const tx = new Transaction();
    const sendMessageTxBuilder = await this.sendMessage(
      channelId,
      memberCapId,
      senderAddress,
      message,
      encryptedKey,
      attachments
    );
    await sendMessageTxBuilder(tx);
    const { digest, effects } = await __privateMethod(this, _SuiStackMessagingClient_instances, executeTransaction_fn).call(this, tx, signer, "send message", true);
    const messageId = effects.changedObjects.find(
      (obj) => obj.idOperation === "Created"
    )?.objectId;
    if (messageId === void 0) {
      throw new MessagingClientError("Message id not found on the transaction effects");
    }
    logger.info("Message sent", {
      channelId,
      messageId,
      senderAddress,
      hasAttachments: (attachments?.length ?? 0) > 0,
      digest
    });
    return { digest, messageId };
  }
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
  addMembers(options) {
    return async (tx) => {
      const { memberCapId, newMemberAddresses } = options;
      const channelId = await __privateMethod(this, _SuiStackMessagingClient_instances, resolveChannelId_fn).call(this, options.channelId);
      const logger = getLogger(LOG_CATEGORIES.CLIENT_WRITES);
      const resolvedAddresses = await __privateMethod(this, _SuiStackMessagingClient_instances, resolveAddresses_fn).call(this, newMemberAddresses);
      const uniqueAddresses = __privateMethod(this, _SuiStackMessagingClient_instances, deduplicateAddresses_fn).call(this, resolvedAddresses);
      if (uniqueAddresses.length !== resolvedAddresses.length) {
        logger.warn("Duplicate addresses removed from newMemberAddresses.", {
          channelId,
          originalCount: resolvedAddresses.length,
          uniqueCount: uniqueAddresses.length
        });
      }
      if (uniqueAddresses.length === 0) {
        logger.warn("No members to add after deduplication.", { channelId });
        return;
      }
      const creatorCapId = await __privateMethod(this, _SuiStackMessagingClient_instances, resolveCreatorCapId_fn).call(this, options);
      const memberCaps = tx.add(
        addMembers({
          package: __privateGet(this, _packageConfig).packageId,
          arguments: {
            self: tx.object(channelId),
            memberCap: tx.object(memberCapId),
            n: uniqueAddresses.length
          }
        })
      );
      tx.add(
        transferMemberCaps({
          package: __privateGet(this, _packageConfig).packageId,
          arguments: {
            memberAddresses: tx.pure.vector("address", uniqueAddresses),
            memberCaps,
            creatorCap: tx.object(creatorCapId)
          }
        })
      );
    };
  }
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
  async addMembersTransaction({
    transaction = new Transaction(),
    ...options
  }) {
    const addMembersTxBuilder = this.addMembers(options);
    await addMembersTxBuilder(transaction);
    return transaction;
  }
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
  async executeAddMembersTransaction({
    signer,
    transaction,
    ...options
  }) {
    const channelId = await __privateMethod(this, _SuiStackMessagingClient_instances, resolveChannelId_fn).call(this, options.channelId);
    const logger = getLogger(LOG_CATEGORIES.CLIENT_WRITES);
    logger.debug("Adding members to channel", {
      channelId,
      originalInput: options.channelId,
      newMemberAddresses: options.newMemberAddresses
    });
    const { memberCapId, newMemberAddresses, creatorCapId } = options;
    const addMembersOptions = creatorCapId ? { channelId, memberCapId, newMemberAddresses, creatorCapId } : { channelId, memberCapId, newMemberAddresses, address: signer.toSuiAddress() };
    const tx = transaction ?? new Transaction();
    const addMembersTxBuilder = this.addMembers(addMembersOptions);
    await addMembersTxBuilder(tx);
    const { digest, effects } = await __privateMethod(this, _SuiStackMessagingClient_instances, executeTransaction_fn).call(this, tx, signer, "add members", true);
    const memberCapsWithOwner = await __privateMethod(this, _SuiStackMessagingClient_instances, getCreatedObjectsByType_fn).call(this, {
      effects,
      objectTypeName: MemberCap.name,
      parseFunction: (content) => MemberCap.parse(content),
      errorMessage: `MemberCap objects not found in transaction effects for transaction (${digest})`
    });
    const addedMembers = memberCapsWithOwner.map(({ object, owner }) => {
      let ownerAddress;
      if (owner.$kind === "AddressOwner") {
        ownerAddress = owner.AddressOwner;
      } else if (owner.$kind === "ObjectOwner") {
        ownerAddress = owner.ObjectOwner;
      } else if (owner.$kind === "Shared") {
        ownerAddress = "Shared";
      } else {
        ownerAddress = "Immutable";
      }
      return {
        memberCap: object,
        ownerAddress
      };
    });
    logger.info("Members added to channel", {
      channelId: options.channelId,
      addedMemberCount: addedMembers.length,
      memberCapIds: addedMembers.map((m) => m.memberCap.id.id),
      digest
    });
    return { digest, addedMembers };
  }
  /**
   * Update the external SessionKey instance (useful for React context updates)
   * Only works when the client was configured with an external SessionKey
   */
  updateSessionKey(newSessionKey) {
    __privateGet(this, _envelopeEncryption).updateSessionKey(newSessionKey);
  }
  /**
   * Force refresh the managed SessionKey (useful for testing or manual refresh)
   * Only works when the client was configured with SessionKeyConfig
   */
  async refreshSessionKey() {
    return __privateGet(this, _envelopeEncryption).refreshSessionKey();
  }
  /**
   * Execute a create channel transaction
   * @param params - Transaction parameters including signer and optional initial members
   * @returns Transaction digest, channel ID, creator cap ID, and encrypted key
   */
  async executeCreateChannelTransaction({
    signer,
    initialMembers
  }) {
    const logger = getLogger(LOG_CATEGORIES.CLIENT_WRITES);
    const creatorAddress = signer.toSuiAddress();
    logger.debug("Creating channel", {
      creatorAddress,
      initialMemberCount: initialMembers?.length ?? 0
    });
    const flow = await this.createChannelFlow({
      creatorAddress,
      initialMemberAddresses: initialMembers
    });
    const channelTx = flow.build();
    const { digest: channelDigest } = await __privateMethod(this, _SuiStackMessagingClient_instances, executeTransaction_fn).call(this, channelTx, signer, "create channel");
    const {
      creatorCap,
      creatorMemberCap,
      additionalMemberCaps: _
    } = await flow.getGeneratedCaps({
      digest: channelDigest
    });
    const attachKeyTx = await flow.generateAndAttachEncryptionKey({ creatorMemberCap });
    const { digest: keyDigest } = await __privateMethod(this, _SuiStackMessagingClient_instances, executeTransaction_fn).call(this, attachKeyTx, signer, "attach encryption key");
    const { channelId, encryptedKeyBytes } = flow.getGeneratedEncryptionKey();
    logger.info("Channel created", {
      channelId,
      creatorCapId: creatorCap.id.id,
      creatorAddress,
      memberCount: (initialMembers?.length ?? 0) + 1,
      // Including creator
      digest: keyDigest
    });
    return { digest: keyDigest, creatorCapId: creatorCap.id.id, channelId, encryptedKeyBytes };
  }
};
_suiClient = new WeakMap();
_packageConfig = new WeakMap();
_storage = new WeakMap();
_envelopeEncryption = new WeakMap();
_sealConfig = new WeakMap();
_addressResolver = new WeakMap();
_channelResolver = new WeakMap();
_SuiStackMessagingClient_instances = new WeakSet();
resolveAddresses_fn = async function(addresses) {
  if (!__privateGet(this, _addressResolver) || addresses.length === 0) {
    return addresses;
  }
  return __privateGet(this, _addressResolver).resolveMany(addresses);
};
resolveChannelId_fn = async function(channelNameOrId) {
  if (!__privateGet(this, _channelResolver)) {
    return channelNameOrId;
  }
  return __privateGet(this, _channelResolver).resolve(channelNameOrId);
};
getUserMemberCapId_fn = async function(userAddress, channelId) {
  const memberCap = await this.getUserMemberCap(userAddress, channelId);
  if (!memberCap) {
    throw new MessagingClientError(`User ${userAddress} is not a member of channel ${channelId}`);
  }
  return memberCap.id.id;
};
getEncryptionKeyFromChannel_fn = async function(channel) {
  const encryptedKeyBytes = channel.encryption_key_history.latest;
  const keyVersion = channel.encryption_key_history.latest_version;
  return {
    $kind: "Encrypted",
    encryptedBytes: new Uint8Array(encryptedKeyBytes),
    version: keyVersion
  };
};
decryptMessage_fn = async function(message, channelId, memberCapId, encryptedKey) {
  const text = await __privateGet(this, _envelopeEncryption).decryptText({
    encryptedBytes: new Uint8Array(message.ciphertext),
    nonce: new Uint8Array(message.nonce),
    sender: message.sender,
    channelId,
    memberCapId,
    encryptedKey
  });
  if (!message.attachments || message.attachments.length === 0) {
    return { text, attachments: [], sender: message.sender, createdAtMs: message.created_at_ms };
  }
  const attachmentsMetadata = await Promise.all(
    message.attachments.map(async (attachment) => {
      const metadata = await __privateGet(this, _envelopeEncryption).decryptAttachmentMetadata({
        encryptedBytes: new Uint8Array(attachment.encrypted_metadata),
        nonce: new Uint8Array(attachment.metadata_nonce),
        channelId,
        sender: message.sender,
        encryptedKey,
        memberCapId
      });
      return {
        metadata,
        attachment
        // Keep reference to original attachment
      };
    })
  );
  const lazyAttachmentsDataPromises = attachmentsMetadata.map(
    ({ metadata, attachment }) => ({
      ...metadata,
      data: __privateMethod(this, _SuiStackMessagingClient_instances, createLazyAttachmentDataPromise_fn).call(this, {
        blobRef: attachment.blob_ref,
        nonce: new Uint8Array(attachment.data_nonce),
        channelId,
        sender: message.sender,
        encryptedKey,
        memberCapId
      })
    })
  );
  return {
    text,
    sender: message.sender,
    createdAtMs: message.created_at_ms,
    attachments: lazyAttachmentsDataPromises
  };
};
createAttachmentsVec_fn = async function(tx, encryptedKey, channelId, memberCapId, sender, attachments) {
  const attachmentType = __privateGet(this, _packageConfig).packageId ? (
    // todo: this needs better handling - it's needed for the integration tests
    Attachment.name.replace("@local-pkg/sui-stack-messaging", __privateGet(this, _packageConfig).packageId)
  ) : Attachment.name;
  if (!attachments || attachments.length === 0) {
    return tx.moveCall({
      package: "0x1",
      module: "vector",
      function: "empty",
      arguments: [],
      typeArguments: [attachmentType]
    });
  }
  const encryptedDataPayloads = await Promise.all(
    attachments.map(async (file) => {
      return __privateGet(this, _envelopeEncryption).encryptAttachmentData({
        file,
        channelId,
        memberCapId,
        encryptedKey,
        sender
      });
    })
  );
  const attachmentRefs = await __privateGet(this, _storage).call(this, __privateGet(this, _suiClient)).upload(
    encryptedDataPayloads.map((p) => p.encryptedBytes),
    { storageType: "quilts" }
  );
  const encryptedMetadataPayloads = await Promise.all(
    attachments.map((file) => {
      return __privateGet(this, _envelopeEncryption).encryptAttachmentMetadata({
        file,
        channelId,
        memberCapId,
        encryptedKey,
        sender
      });
    })
  );
  return tx.makeMoveVec({
    type: attachmentType,
    elements: attachmentRefs.ids.map((blobRef, i) => {
      const dataNonce = encryptedDataPayloads[i].nonce;
      const metadata = encryptedMetadataPayloads[i];
      const metadataNonce = metadata.nonce;
      return tx.add(
        newAttachment({
          package: __privateGet(this, _packageConfig).packageId,
          arguments: {
            blobRef: tx.pure.string(blobRef),
            encryptedMetadata: tx.pure.vector("u8", metadata.encryptedBytes),
            dataNonce: tx.pure.vector("u8", dataNonce),
            metadataNonce: tx.pure.vector("u8", metadataNonce),
            keyVersion: tx.pure("u32", encryptedKey.version)
          }
        })
      );
    })
  });
};
resolveCreatorCapId_fn = async function(options) {
  if (options.creatorCapId) {
    return options.creatorCapId;
  }
  const { address, channelId } = options;
  const creatorCap = await this.getCreatorCap(address, channelId);
  if (!creatorCap) {
    const logger = getLogger(LOG_CATEGORIES.CLIENT_WRITES);
    logger.warn("CreatorCap not found for user", { address, channelId });
    throw new MessagingClientError(
      `User ${address} does not own a CreatorCap for channel ${channelId}`
    );
  }
  return creatorCap.id.id;
};
executeTransaction_fn = async function(transaction, signer, action, waitForTransaction = true) {
  transaction.setSenderIfNotSet(signer.toSuiAddress());
  const result = await signer.signAndExecuteTransaction({
    transaction,
    client: __privateGet(this, _suiClient)
  });
  const txn = result.$kind === "Transaction" ? result.Transaction : result.FailedTransaction;
  if (!txn) {
    throw new MessagingClientError(`Failed to ${action}: no transaction in result`);
  }
  const { digest, effects } = txn;
  if (effects?.status.error) {
    throw new MessagingClientError(`Failed to ${action} (${digest}): ${effects?.status.error}`);
  }
  if (waitForTransaction) {
    await __privateGet(this, _suiClient).core.waitForTransaction({
      digest
    });
  }
  return { digest, effects };
};
getGeneratedCaps_fn = async function(digest) {
  const waitResult = await __privateGet(this, _suiClient).core.waitForTransaction({
    digest,
    include: { effects: true }
  });
  const txn = waitResult.$kind === "Transaction" ? waitResult.Transaction : waitResult.FailedTransaction;
  if (!txn) {
    throw new MessagingClientError(
      `Failed to get generated caps: no transaction for digest ${digest}`
    );
  }
  const effects = txn.effects;
  const creatorCapsWithOwner = await __privateMethod(this, _SuiStackMessagingClient_instances, getCreatedObjectsByType_fn).call(this, {
    effects,
    objectTypeName: CreatorCap.name,
    parseFunction: (content) => CreatorCap.parse(content),
    errorMessage: `CreatorCap object not found in transaction effects for transaction (${digest})`
  });
  if (creatorCapsWithOwner.length === 0) {
    throw new MessagingClientError(
      `CreatorCap object not found in transaction effects for transaction (${digest})`
    );
  }
  const { object: creatorCap, owner: creatorCapOwner } = creatorCapsWithOwner[0];
  const allMemberCapsWithOwner = await __privateMethod(this, _SuiStackMessagingClient_instances, getCreatedObjectsByType_fn).call(this, {
    effects,
    objectTypeName: MemberCap.name,
    parseFunction: (content) => MemberCap.parse(content),
    errorMessage: `MemberCap objects not found in transaction effects for transaction (${digest})`
  });
  const creatorMemberCapWithOwner = allMemberCapsWithOwner.find(
    ({ owner }) => owner.$kind === "AddressOwner" && creatorCapOwner.$kind === "AddressOwner" && owner.AddressOwner === creatorCapOwner.AddressOwner
  );
  if (!creatorMemberCapWithOwner) {
    throw new MessagingClientError(
      `CreatorMemberCap object not found in transaction effects for transaction (${digest})`
    );
  }
  const creatorMemberCap = creatorMemberCapWithOwner.object;
  const additionalMemberCaps = allMemberCapsWithOwner.filter((item) => item.object.id.id !== creatorMemberCap.id.id).map((item) => item.object);
  return {
    creatorCap,
    creatorMemberCap,
    additionalMemberCaps
  };
};
getCreatedObjectsByType_fn = async function({
  effects,
  objectTypeName,
  parseFunction,
  errorMessage
}) {
  const objectType = objectTypeName.replace(
    "@local-pkg/sui-stack-messaging",
    __privateGet(this, _packageConfig).packageId
  );
  const createdObjectIds = effects.changedObjects.filter((object) => object.idOperation === "Created" && object.outputState !== "DoesNotExist").map((object) => object.objectId);
  const createdObjects = await __privateGet(this, _suiClient).core.getObjects({
    objectIds: createdObjectIds,
    include: { content: true }
  });
  const matchingObjects = createdObjects.objects.filter(
    (object) => !(object instanceof Error) && object.type === objectType
  );
  const parsedObjectsWithOwner = await Promise.all(
    matchingObjects.map(async (objectResponse) => {
      if (objectResponse instanceof Error || !objectResponse.content) {
        throw new MessagingClientError(errorMessage);
      }
      const parsedObject = parseFunction(await objectResponse.content);
      return { object: parsedObject, owner: objectResponse.owner };
    })
  );
  return parsedObjectsWithOwner;
};
/**
 * Deduplicate addresses and optionally filter out an excluded address
 * @param addresses - Array of addresses to deduplicate
 * @param excludeAddress - Optional address to filter out
 * @returns Array of unique addresses, excluding the excluded address if provided
 */
deduplicateAddresses_fn = function(addresses, excludeAddress) {
  const uniqueAddresses = [...new Set(addresses)];
  return excludeAddress ? uniqueAddresses.filter((addr) => addr !== excludeAddress) : uniqueAddresses;
};
// Derive the message IDs from the given range
// Note: messages = TableVec<Message>
// --> TableVec{contents: Table<u64, Message>}
deriveMessageIDsFromRange_fn = function(messagesTableId, startIndex, endIndex) {
  const messageIDs = [];
  for (let i = startIndex; i < endIndex; i++) {
    messageIDs.push(deriveDynamicFieldID(messagesTableId, "u64", bcs.U64.serialize(i).toBytes()));
  }
  return messageIDs;
};
parseMessageObjects_fn = async function(messageObjects) {
  const DynamicFieldMessage = bcs.struct("DynamicFieldMessage", {
    id: bcs.Address,
    // UID is represented as an address
    name: bcs.U64,
    // the key (message index)
    value: Message
    // the actual Message
  });
  const parsedMessageObjects = await Promise.all(
    messageObjects.objects.map(async (object) => {
      if (object instanceof Error || !object.content) {
        throw new MessagingClientError(`Failed to parse message object: ${object}`);
      }
      const content = await object.content;
      const dynamicField = DynamicFieldMessage.parse(content);
      return dynamicField.value;
    })
  );
  return parsedMessageObjects;
};
createLazyAttachmentDataPromise_fn = async function({
  channelId,
  memberCapId,
  sender,
  encryptedKey,
  blobRef,
  nonce
}) {
  const downloadAndDecrypt = async () => {
    const [encryptedData] = await __privateGet(this, _storage).call(this, __privateGet(this, _suiClient)).download([blobRef]);
    const decryptedData = await __privateGet(this, _envelopeEncryption).decryptAttachmentData({
      encryptedBytes: new Uint8Array(encryptedData),
      nonce: new Uint8Array(nonce),
      channelId,
      memberCapId,
      sender,
      encryptedKey
    });
    return decryptedData.data;
  };
  return new Promise((resolve, reject) => {
    downloadAndDecrypt().then(resolve).catch(reject);
  });
};
/**
 * Calculate the range of message indices to fetch
 */
calculateFetchRange_fn = function({
  cursor,
  limit,
  direction,
  totalMessagesCount
}) {
  const limitBigInt = BigInt(limit);
  if (direction === "backward") {
    if (cursor === null) {
      const startIndex3 = totalMessagesCount > limitBigInt ? totalMessagesCount - limitBigInt : BigInt(0);
      return {
        startIndex: startIndex3,
        endIndex: totalMessagesCount
      };
    }
    const endIndex2 = cursor;
    const startIndex2 = endIndex2 > limitBigInt ? endIndex2 - limitBigInt : BigInt(0);
    return {
      startIndex: startIndex2,
      endIndex: endIndex2
    };
  }
  if (cursor === null) {
    const endIndex2 = totalMessagesCount > limitBigInt ? limitBigInt : totalMessagesCount;
    return {
      startIndex: BigInt(0),
      endIndex: endIndex2
    };
  }
  const startIndex = cursor + BigInt(1);
  const endIndex = startIndex + limitBigInt > totalMessagesCount ? totalMessagesCount : startIndex + limitBigInt;
  return {
    startIndex,
    endIndex
  };
};
fetchMessagesInRange_fn = async function(messagesTableId, range) {
  const messageIds = __privateMethod(this, _SuiStackMessagingClient_instances, deriveMessageIDsFromRange_fn).call(this, messagesTableId, range.startIndex, range.endIndex);
  if (messageIds.length === 0) {
    return [];
  }
  const messageObjects = await __privateGet(this, _suiClient).core.getObjects({
    objectIds: messageIds,
    include: { content: true }
  });
  return await __privateMethod(this, _SuiStackMessagingClient_instances, parseMessageObjects_fn).call(this, messageObjects);
};
/**
 * Create a messages response with pagination info
 */
determineNextPagination_fn = function({
  fetchRange,
  direction,
  totalMessagesCount
}) {
  let nextCursor = null;
  let hasNextPage = false;
  if (direction === "backward") {
    nextCursor = fetchRange.startIndex > BigInt(0) ? fetchRange.startIndex : null;
    hasNextPage = fetchRange.startIndex > BigInt(0);
  } else {
    nextCursor = fetchRange.endIndex < totalMessagesCount ? fetchRange.endIndex - BigInt(1) : null;
    hasNextPage = fetchRange.endIndex < totalMessagesCount;
  }
  return {
    cursor: nextCursor,
    hasNextPage
  };
};
/**
 * Create an empty messages response
 */
createEmptyMessagesResponse_fn = function(direction) {
  return {
    messages: [],
    cursor: null,
    hasNextPage: false,
    direction
  };
};
findOwnedObjectByChannelId_fn = async function(struct, ownerAddress, channelId) {
  const objectType = struct.name.replace(
    "@local-pkg/sui-stack-messaging",
    __privateGet(this, _packageConfig).packageId
  );
  let cursor = null;
  let hasNextPage = true;
  while (hasNextPage) {
    const response = await __privateGet(this, _suiClient).core.listOwnedObjects({
      owner: ownerAddress,
      cursor,
      type: objectType,
      include: { content: true }
    });
    const validObjects = response.objects;
    if (validObjects.length > 0) {
      const contents = await __privateMethod(this, _SuiStackMessagingClient_instances, getObjectContents_fn).call(this, validObjects);
      for (const content of contents) {
        const parsed = struct.parse(content);
        if (parsed.channel_id === channelId) {
          return parsed;
        }
      }
    }
    cursor = response.cursor;
    hasNextPage = response.hasNextPage;
  }
  return null;
};
getObjectContents_fn = async function(objects) {
  const contentPromises = objects.map(async (object) => {
    try {
      return await object.content;
    } catch (error) {
      if (error instanceof Error && error.message.includes("GRPC does not return object contents")) {
        return null;
      }
      throw error;
    }
  });
  const contents = await Promise.all(contentPromises);
  const needsBatchFetch = contents.some((content) => content === null);
  if (needsBatchFetch) {
    const objectIds = objects.map((obj) => obj.objectId);
    const objectResponses = await __privateGet(this, _suiClient).core.getObjects({
      objectIds,
      include: { content: true }
    });
    const batchContents = await Promise.all(
      objectResponses.objects.map(async (obj) => {
        if (obj instanceof Error || !obj.content) {
          throw new MessagingClientError(`Failed to fetch object content: ${obj}`);
        }
        return await obj.content;
      })
    );
    return batchContents;
  }
  return contents.filter((content) => content !== null);
};
let SuiStackMessagingClient = _SuiStackMessagingClient;
function messaging(options) {
  return {
    name: "messaging",
    register: (client) => {
      const sealClient = client.seal;
      if (!sealClient) {
        throw new MessagingClientError("SealClient extension is required for MessagingClient");
      }
      if (!("storage" in options) && !("walrusStorageConfig" in options)) {
        throw new MessagingClientError(
          'Either a custom storage adapter via "storage" option or explicit Walrus storage configuration via "walrusStorageConfig" option must be provided. Fallback to default Walrus endpoints is not supported.'
        );
      }
      let packageConfig = options.packageConfig;
      if (!packageConfig) {
        const network = client.network;
        switch (network) {
          case "testnet":
            packageConfig = TESTNET_MESSAGING_PACKAGE_CONFIG;
            break;
          case "mainnet":
            packageConfig = MAINNET_MESSAGING_PACKAGE_CONFIG;
            break;
          default:
            packageConfig = TESTNET_MESSAGING_PACKAGE_CONFIG;
            break;
        }
      }
      const storage = "storage" in options ? (c) => options.storage(c) : (c) => {
        return new WalrusStorageAdapter(c, options.walrusStorageConfig);
      };
      return new SuiStackMessagingClient({
        suiClient: client,
        storage,
        packageConfig,
        sessionKey: "sessionKey" in options ? options.sessionKey : void 0,
        sessionKeyConfig: "sessionKeyConfig" in options ? options.sessionKeyConfig : void 0,
        sealConfig: options.sealConfig,
        addressResolver: options.addressResolver,
        channelResolver: options.channelResolver
      });
    }
  };
}
export {
  SuiStackMessagingClient,
  messaging
};
//# sourceMappingURL=client.js.map
