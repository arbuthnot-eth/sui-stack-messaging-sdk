// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Main client class
export { messaging, SuiStackMessagingClient } from './client.js';
// Constants
export {
	DEFAULT_SEAL_APPROVE_CONTRACT,
	MAINNET_MESSAGING_PACKAGE_CONFIG,
	TESTNET_MESSAGING_PACKAGE_CONFIG,
} from './constants.js';
// Encryption types
export type {
	AttachmentMetadata,
	EncryptedSymmetricKey,
	SealApproveContract,
	SealConfig,
	SessionKeyConfig,
} from './encryption/types.js';

// Errors
export * from './error.js';
// Logging utilities (optional - requires @logtape/logtape peer dependency)
export { getLogger, LOG_CATEGORIES } from './logging/index.js';

// Storage types
export type { StorageAdapter, StorageConfig, StorageOptions } from './storage/adapters/storage.js';
export type * from './storage/adapters/walrus/types.js';
// Walrus types
export { WalrusStorageAdapter } from './storage/adapters/walrus/walrus.js';
// Types
export type * from './types.js';
export type { AddressResolver } from './utils/addressResolution.js';
// Address resolution utilities (for SuiNS name resolution)
export { isSuiNSName, SuiNSResolver } from './utils/addressResolution.js';
export type { ChannelNameResolver } from './utils/channelResolution.js';
// Channel name resolution utilities
export {
	formatChannelName,
	isChannelName,
	LocalChannelRegistry,
	normalizeChannelName,
	PersistentChannelRegistry,
} from './utils/channelResolution.js';
export type { SealClientExtensionOptions } from './utils/seal-extension.js';
// Seal client extension helper
export { sealClientExtension } from './utils/seal-extension.js';
// Thunder action journal
export {
	createThunderAction,
	serializeThunderAction,
	deserializeThunderAction,
	THUNDER_TOOLS,
	THUNDER_VERSION,
} from './thunder.js';
export type { ThunderAction, ThunderTool } from './thunder.js';
export { appendThunderMessage } from './compose.js';
export type { AppendThunderMessageOptions } from './compose.js';
