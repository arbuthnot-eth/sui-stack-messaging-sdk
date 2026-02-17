/* --- Place your @mysten/sui imports here --- */
import type { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import type { SuiClientTypes } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export type ExecuteTransactionResult = {
  digest: string;
  effects?: SuiClientTypes.TransactionEffects;
  objectChanges?: unknown[];
};

/**
 * @param {SuiJsonRpcClient} client - The Sui JSON-RPC client instance
 * @param {Transaction} transaction - The Transaction instance
 * @param {Ed25519Keypair} signer - The Keypair signer
 * @return {Promise<ExecuteTransactionResult>}
 */
export async function executeTransaction(
  client: SuiJsonRpcClient,
  transaction: Transaction,
  signer: Ed25519Keypair
): Promise<ExecuteTransactionResult> {
  const result = await client.signAndExecuteTransaction({
    transaction,
    signer,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });

  if (result.effects?.status?.status === "failure") {
    throw new Error(
      `Transaction failed: ${result.effects.status.error ?? "Unknown error"}`
    );
  }

  await client.waitForTransaction({ digest: result.digest });

  return {
    digest: result.digest,
    effects: result.effects as SuiClientTypes.TransactionEffects | undefined,
    objectChanges: result.objectChanges as unknown[] | undefined,
  };
}
