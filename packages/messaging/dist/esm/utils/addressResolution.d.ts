import type { SuinsClient } from '@mysten/suins';
/**
 * Interface for address resolution.
 * Implementations can resolve SuiNS names to addresses and perform reverse lookups.
 */
export interface AddressResolver {
    /**
     * Resolve a SuiNS name or address to an address.
     * If the input is already a valid address, return it unchanged.
     * If the input is a SuiNS name (e.g., "alice.sui"), resolve it to an address.
     * @param nameOrAddress - A SuiNS name or Sui address
     * @returns The resolved address
     * @throws Error if the name cannot be resolved
     */
    resolve(nameOrAddress: string): Promise<string>;
    /**
     * Resolve multiple SuiNS names or addresses to addresses.
     * @param namesOrAddresses - Array of SuiNS names or Sui addresses
     * @returns Array of resolved addresses in the same order
     * @throws Error if any name cannot be resolved
     */
    resolveMany(namesOrAddresses: string[]): Promise<string[]>;
    /**
     * Perform a reverse lookup to get the default SuiNS name for an address.
     * @param address - A Sui address
     * @returns The default SuiNS name or null if not found
     */
    reverseLookup(address: string): Promise<string | null>;
}
/**
 * Check if a string is a SuiNS name (ends with .sui).
 * @param input - The string to check
 * @returns True if the input is a SuiNS name
 */
export declare function isSuiNSName(input: string): boolean;
/**
 * SuiNS-based address resolver implementation.
 * Uses the @mysten/suins SuinsClient to resolve names to addresses.
 */
export declare class SuiNSResolver implements AddressResolver {
    #private;
    /**
     * Create a new SuiNSResolver.
     * @param suinsClient - An initialized SuinsClient instance
     */
    constructor(suinsClient: SuinsClient);
    /**
     * Resolve a SuiNS name or address to an address.
     * @param nameOrAddress - A SuiNS name or Sui address
     * @returns The resolved address
     * @throws Error if the name cannot be resolved
     */
    resolve(nameOrAddress: string): Promise<string>;
    /**
     * Resolve multiple SuiNS names or addresses to addresses.
     * @param namesOrAddresses - Array of SuiNS names or Sui addresses
     * @returns Array of resolved addresses in the same order
     * @throws Error if any name cannot be resolved
     */
    resolveMany(namesOrAddresses: string[]): Promise<string[]>;
    /**
     * Perform a reverse lookup to get the default SuiNS name for an address.
     * Note: Reverse lookup is not currently supported by the @mysten/suins SDK.
     * This method always returns null. Future versions may implement this
     * feature when the SDK adds support for it.
     * @param address - A Sui address
     * @returns Always returns null (reverse lookup not supported)
     */
    reverseLookup(_address: string): Promise<string | null>;
}
