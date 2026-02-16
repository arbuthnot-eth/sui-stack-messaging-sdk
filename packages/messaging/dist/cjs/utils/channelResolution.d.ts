/**
 * Interface for channel name resolution.
 * Implementations can resolve human-readable channel names (e.g., "#general")
 * to channel object IDs and perform reverse lookups.
 */
export interface ChannelNameResolver {
    /**
     * Resolve a channel name or ID to a channel object ID.
     * If the input is already a valid channel ID (0x...), return it unchanged.
     * If the input is a channel name (e.g., "#general"), resolve it to a channel ID.
     * @param nameOrId - A channel name (with or without #) or channel object ID
     * @returns The resolved channel object ID
     * @throws Error if the name cannot be resolved
     */
    resolve(nameOrId: string): Promise<string>;
    /**
     * Resolve multiple channel names or IDs to channel object IDs.
     * @param namesOrIds - Array of channel names or channel object IDs
     * @returns Array of resolved channel object IDs in the same order
     * @throws Error if any name cannot be resolved
     */
    resolveMany(namesOrIds: string[]): Promise<string[]>;
    /**
     * Perform a reverse lookup to get the channel name for a channel ID.
     * @param channelId - A channel object ID
     * @returns The channel name or null if not found/registered
     */
    reverseLookup(channelId: string): Promise<string | null>;
    /**
     * Register a channel name mapping.
     * @param name - The human-readable channel name (with or without #)
     * @param channelId - The channel object ID
     */
    register(name: string, channelId: string): Promise<void>;
    /**
     * Unregister a channel name mapping.
     * @param name - The channel name to unregister
     */
    unregister(name: string): Promise<void>;
    /**
     * List all registered channel name mappings.
     * @returns Map of channel names to channel IDs
     */
    list(): Promise<Map<string, string>>;
}
/**
 * Check if a string is a channel name (starts with # or doesn't start with 0x).
 * @param input - The string to check
 * @returns True if the input appears to be a channel name
 */
export declare function isChannelName(input: string): boolean;
/**
 * Normalize a channel name by removing the # prefix if present and converting to lowercase.
 * @param name - The channel name to normalize
 * @returns The normalized channel name
 */
export declare function normalizeChannelName(name: string): string;
/**
 * Format a channel name with the # prefix.
 * @param name - The channel name (with or without #)
 * @returns The formatted channel name with # prefix
 */
export declare function formatChannelName(name: string): string;
/**
 * In-memory channel name registry implementation.
 * Useful for local development, testing, and single-session usage.
 * Names are stored in memory and lost when the process exits.
 */
export declare class LocalChannelRegistry implements ChannelNameResolver {
    #private;
    /**
     * Create a new LocalChannelRegistry with optional initial mappings.
     * @param initialMappings - Optional initial name-to-ID mappings
     */
    constructor(initialMappings?: Record<string, string> | Map<string, string>);
    resolve(nameOrId: string): Promise<string>;
    resolveMany(namesOrIds: string[]): Promise<string[]>;
    reverseLookup(channelId: string): Promise<string | null>;
    register(name: string, channelId: string): Promise<void>;
    unregister(name: string): Promise<void>;
    list(): Promise<Map<string, string>>;
    /**
     * Export the registry data for persistence.
     * @returns JSON-serializable object of name-to-ID mappings
     */
    export(): Record<string, string>;
    /**
     * Import registry data from a previously exported object.
     * @param data - The exported registry data
     * @param merge - If true, merge with existing data; if false, replace
     */
    import(data: Record<string, string>, merge?: boolean): void;
    /**
     * Clear all registered channel names.
     */
    clear(): void;
    /**
     * Get the number of registered channel names.
     */
    get size(): number;
}
/**
 * Persistent channel name registry that stores mappings in localStorage (browser)
 * or a file (Node.js). Extends LocalChannelRegistry with persistence.
 */
export declare class PersistentChannelRegistry extends LocalChannelRegistry {
    #private;
    /**
     * Create a new PersistentChannelRegistry.
     * @param storageKey - The key to use for storage (default: 'sui-messaging-channels')
     */
    constructor(storageKey?: string);
    register(name: string, channelId: string): Promise<void>;
    unregister(name: string): Promise<void>;
    /**
     * Force a save to storage.
     */
    save(): void;
    /**
     * Reload data from storage, discarding any unsaved changes.
     */
    reload(): void;
}
