export declare const THUNDER_VERSION = 1;
export interface ThunderAction {
    v: typeof THUNDER_VERSION;
    method: 'tools/call';
    tool: string;
    input: Record<string, unknown>;
    origin: string;
}
export declare const THUNDER_TOOLS: {
    readonly REGISTER: "sui:register";
    readonly TRANSFER: "sui:transfer";
    readonly SWAP: "sui:swap";
    readonly STAKE: "sui:stake";
    readonly SKI: "sui:ski";
    readonly MESSAGE: "sui:message";
};
export type ThunderTool = (typeof THUNDER_TOOLS)[keyof typeof THUNDER_TOOLS];
export declare function createThunderAction(tool: string, input: Record<string, unknown>, origin: string): ThunderAction;
export declare function serializeThunderAction(action: ThunderAction): Uint8Array;
export declare function deserializeThunderAction(bytes: Uint8Array): ThunderAction;
