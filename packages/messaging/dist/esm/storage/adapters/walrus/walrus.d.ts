import type { ClientWithExtensions } from '@mysten/sui/client';
import type { StorageAdapter, StorageConfig, StorageOptions } from '../storage.js';
import type { WalrusClient } from '@mysten/walrus';
export declare class WalrusStorageAdapter implements StorageAdapter {
    #private;
    private readonly _client;
    private readonly config;
    constructor(_client: ClientWithExtensions<{
        walrus?: WalrusClient;
    }>, config: StorageConfig);
    /**
     * Upload data to Walrus storage
     * @param data - Array of data to upload
     * @param _options - Storage options (currently unused)
     * @returns Upload result with blob IDs
     */
    upload(data: Uint8Array[], _options: StorageOptions): Promise<{
        ids: string[];
    }>;
    /**
     * Download data from Walrus storage
     * @param ids - Array of blob IDs to download
     * @returns Array of downloaded data
     */
    download(ids: string[]): Promise<Uint8Array[]>;
}
