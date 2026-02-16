// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

// Configuration
const FUNDER_ADDRESS = process.env.TESTNET_FUNDER_ADDRESS;
const FUNDER_SECRET_KEY = process.env.TESTNET_FUNDER_SECRET_KEY;
const FUND_AMOUNT = 100_000_000; // 0.1 SUI in MIST
const TEST_USERS_FILE = join(__dirname, 'test-users.json');

interface TestUser {
	address: string;
	secretKey: string; // Base64 encoded secret key
}

interface TestUsersData {
	users: TestUser[];
	createdAt: string;
	funded: boolean;
}

/**
 * Fund test users for testnet testing
 */
async function fundTestUsers(): Promise<void> {
	if (!FUNDER_ADDRESS || !FUNDER_SECRET_KEY) {
		throw new Error(
			'TESTNET_FUNDER_ADDRESS and TESTNET_FUNDER_SECRET_KEY environment variables are required',
		);
	}

	console.log('🚀 Starting test user funding process...');

	// Create Sui client
	const suiClient = new SuiJsonRpcClient({
		network: 'testnet',
		url: getJsonRpcFullnodeUrl('testnet'),
	});

	// Create funder signer
	const funderKeypair = Ed25519Keypair.fromSecretKey(FUNDER_SECRET_KEY);
	const funderAddress = funderKeypair.toSuiAddress();

	if (funderAddress !== FUNDER_ADDRESS) {
		throw new Error(`Funder address mismatch. Expected: ${FUNDER_ADDRESS}, Got: ${funderAddress}`);
	}

	console.log(`💰 Funder address: ${funderAddress}`);

	// Check funder balance
	const funderBalance = await suiClient.getBalance({
		owner: funderAddress,
	});
	console.log(`💰 Funder balance: ${funderBalance.totalBalance} MIST`);

	// Generate or load test users
	let testUsers: TestUser[];
	let testUsersData: TestUsersData;

	try {
		// Try to load existing test users
		const existingData = readFileSync(TEST_USERS_FILE, 'utf-8');
		testUsersData = JSON.parse(existingData);
		testUsers = testUsersData.users;
		console.log(`📋 Loaded ${testUsers.length} existing test users`);
	} catch {
		// Generate new test users
		console.log('📝 Generating new test users...');
		testUsers = Array.from({ length: 5 }, () => {
			const keypair = Ed25519Keypair.generate();
			return {
				address: keypair.toSuiAddress(),
				secretKey: keypair.getSecretKey(),
			};
		});

		testUsersData = {
			users: testUsers,
			createdAt: new Date().toISOString(),
			funded: false,
		};

		// Save test users
		writeFileSync(TEST_USERS_FILE, JSON.stringify(testUsersData, null, 2));
		console.log(`💾 Saved ${testUsers.length} test users to ${TEST_USERS_FILE}`);
	}

	// Check which users need funding
	const usersToFund = [];
	for (const user of testUsers) {
		try {
			const balance = await suiClient.getBalance({ owner: user.address });
			if (BigInt(balance.totalBalance) < BigInt(FUND_AMOUNT)) {
				usersToFund.push(user);
			} else {
				console.log(`✅ User ${user.address} already has sufficient balance`);
			}
		} catch (error) {
			console.log(`⚠️  User ${user.address} needs funding (error checking balance)`);
			usersToFund.push(user);
		}
	}

	if (usersToFund.length === 0) {
		console.log('✅ All test users are already funded!');
		testUsersData.funded = true;
		writeFileSync(TEST_USERS_FILE, JSON.stringify(testUsersData, null, 2));
		return;
	}

	console.log(`💰 Funding ${usersToFund.length} test users...`);

	// Fund users in batches to avoid rate limiting
	const batchSize = 3;
	for (let i = 0; i < usersToFund.length; i += batchSize) {
		const batch = usersToFund.slice(i, i + batchSize);
		console.log(
			`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(usersToFund.length / batchSize)}`,
		);

		// Create transaction for this batch
		const tx = new Transaction();

		for (const user of batch) {
			tx.transferObjects([tx.splitCoins(tx.gas, [FUND_AMOUNT])], user.address);
		}

		// Execute transaction
		try {
			const result = await suiClient.signAndExecuteTransaction({
				transaction: tx,
				signer: funderKeypair,
				options: {
					showEffects: true,
					showObjectChanges: true,
				},
			});

			if (result.effects?.status.status === 'success') {
				console.log(`✅ Successfully funded batch (tx: ${result.digest})`);
			} else {
				throw new Error(`Transaction failed: ${result.effects?.status.error}`);
			}
		} catch (error) {
			console.error(`❌ Failed to fund batch:`, error);
			throw error;
		}

		// Small delay between batches
		if (i + batchSize < usersToFund.length) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	// Verify funding
	console.log('🔍 Verifying funding...');
	for (const user of usersToFund) {
		const balance = await suiClient.getBalance({ owner: user.address });
		console.log(`💰 User ${user.address}: ${balance.totalBalance} MIST`);
	}

	// Update test users data
	testUsersData.funded = true;
	writeFileSync(TEST_USERS_FILE, JSON.stringify(testUsersData, null, 2));

	console.log('✅ Test user funding completed successfully!');
}

/**
 * Load test users from file
 */
export function loadTestUsers(): TestUser[] {
	try {
		const data = readFileSync(TEST_USERS_FILE, 'utf-8');
		const testUsersData: TestUsersData = JSON.parse(data);
		return testUsersData.users;
	} catch (error) {
		throw new Error(
			`Failed to load test users. Please run fund-test-users.ts first. Error: ${error}`,
		);
	}
}

/**
 * Get test user keypair by address
 */
export function getTestUserKeypair(address: string): Ed25519Keypair {
	const users = loadTestUsers();
	const user = users.find((u) => u.address === address);

	if (!user) {
		throw new Error(`Test user with address ${address} not found`);
	}

	return Ed25519Keypair.fromSecretKey(user.secretKey);
}

// Run the script
if (require.main === module) {
	fundTestUsers().catch((error) => {
		console.error('❌ Failed to fund test users:', error);
		process.exit(1);
	});
}

export { fundTestUsers, type TestUser, type TestUsersData };
