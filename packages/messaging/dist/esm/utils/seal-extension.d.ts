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
export declare function sealClientExtension(options: SealClientExtensionOptions): {
    name: "seal";
    register: (client: SealCompatibleClient) => SealClient;
};
export {};
