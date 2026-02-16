// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import type { MessagingPackageConfig } from './types.js';

const TESTNET_PACKAGE_ID = '0x984960ebddd75c15c6d38355ac462621db0ffc7d6647214c802cd3b685e1af3d';
const MAINNET_PACKAGE_ID = '0x74e34e2e4a2ba60d935db245c0ed93070bbbe23bf1558ae5c6a2a8590c8ad470';

export const DEFAULT_SEAL_APPROVE_CONTRACT = {
	module: 'seal_policies',
	functionName: 'seal_approve',
};

export const TESTNET_MESSAGING_PACKAGE_CONFIG = {
	packageId: TESTNET_PACKAGE_ID,
} satisfies MessagingPackageConfig;

export const MAINNET_MESSAGING_PACKAGE_CONFIG = {
	packageId: MAINNET_PACKAGE_ID,
} satisfies MessagingPackageConfig;
