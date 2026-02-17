var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _suinsClient;
function isSuiNSName(input) {
  return input.toLowerCase().endsWith(".sui");
}
class SuiNSResolver {
  /**
   * Create a new SuiNSResolver.
   * @param suinsClient - An initialized SuinsClient instance
   */
  constructor(suinsClient) {
    __privateAdd(this, _suinsClient);
    __privateSet(this, _suinsClient, suinsClient);
  }
  /**
   * Resolve a SuiNS name or address to an address.
   * @param nameOrAddress - A SuiNS name or Sui address
   * @returns The resolved address
   * @throws Error if the name cannot be resolved
   */
  async resolve(nameOrAddress) {
    if (!isSuiNSName(nameOrAddress)) {
      return nameOrAddress;
    }
    const record = await __privateGet(this, _suinsClient).getNameRecord(nameOrAddress);
    if (!record || !record.targetAddress) {
      throw new Error(`Failed to resolve SuiNS name: ${nameOrAddress}`);
    }
    return record.targetAddress;
  }
  /**
   * Resolve multiple SuiNS names or addresses to addresses.
   * @param namesOrAddresses - Array of SuiNS names or Sui addresses
   * @returns Array of resolved addresses in the same order
   * @throws Error if any name cannot be resolved
   */
  async resolveMany(namesOrAddresses) {
    return Promise.all(namesOrAddresses.map((nameOrAddress) => this.resolve(nameOrAddress)));
  }
  /**
   * Perform a reverse lookup to get the default SuiNS name for an address.
   * Note: Reverse lookup is not currently supported by the @mysten/suins SDK.
   * This method always returns null. Future versions may implement this
   * feature when the SDK adds support for it.
   * @param address - A Sui address
   * @returns Always returns null (reverse lookup not supported)
   */
  async reverseLookup(_address) {
    return null;
  }
}
_suinsClient = new WeakMap();
export {
  SuiNSResolver,
  isSuiNSName
};
//# sourceMappingURL=addressResolution.js.map
