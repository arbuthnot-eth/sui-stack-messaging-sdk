// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

export const THUNDER_VERSION = 1;

export interface ThunderAction {
	v: typeof THUNDER_VERSION;
	method: 'tools/call';
	tool: string;
	input: Record<string, unknown>;
	origin: string;
}

export const THUNDER_TOOLS = {
	REGISTER: 'sui:register',
	TRANSFER: 'sui:transfer',
	SWAP: 'sui:swap',
	STAKE: 'sui:stake',
	SKI: 'sui:ski',
	MESSAGE: 'sui:message',
} as const;

export type ThunderTool = (typeof THUNDER_TOOLS)[keyof typeof THUNDER_TOOLS];

export function createThunderAction(
	tool: string,
	input: Record<string, unknown>,
	origin: string,
): ThunderAction {
	return {
		v: THUNDER_VERSION,
		method: 'tools/call',
		tool,
		input,
		origin,
	};
}

export function serializeThunderAction(action: ThunderAction): Uint8Array {
	return new TextEncoder().encode(JSON.stringify(action));
}

export function deserializeThunderAction(bytes: Uint8Array): ThunderAction {
	const text = new TextDecoder().decode(bytes);
	const parsed = JSON.parse(text) as ThunderAction;
	if (parsed.v !== THUNDER_VERSION) {
		throw new Error(`Unsupported Thunder action version: ${parsed.v}`);
	}
	if (parsed.method !== 'tools/call') {
		throw new Error(`Unsupported Thunder action method: ${parsed.method}`);
	}
	return parsed;
}
