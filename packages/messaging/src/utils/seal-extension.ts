// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SealClient } from '@mysten/seal';
import type { KeyServerConfig } from '@mysten/seal';
import type { ClientWithExtensions, CoreClient } from '@mysten/sui/client';

type SealCompatibleClient = ClientWithExtensions<{
	core: CoreClient;
}>;

export interface SealClientExtensionOptions {
	serverConfigs: KeyServerConfig[];
	verifyKeyServers?: boolean;
	timeout?: number;
}

export function sealClientExtension(options: SealClientExtensionOptions) {
	return {
		name: 'seal' as const,
		register: (client: SealCompatibleClient) => {
			return new SealClient({
				suiClient: client,
				serverConfigs: options.serverConfigs,
				verifyKeyServers: options.verifyKeyServers ?? true,
				timeout: options.timeout,
			});
		},
	};
}
