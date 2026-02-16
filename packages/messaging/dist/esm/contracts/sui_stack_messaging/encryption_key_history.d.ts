import { MoveStruct, MoveTuple } from '../utils/index.js';
export declare const EncryptionKeyHistory: MoveStruct<{
    latest: import("@mysten/bcs").BcsType<number[], Iterable<number> & {
        length: number;
    }, string>;
    latest_version: import("@mysten/bcs").BcsType<number, number, "u32">;
    history: MoveStruct<{
        contents: MoveStruct<{
            id: MoveStruct<{
                id: import("@mysten/bcs").BcsType<string, string | Uint8Array<ArrayBufferLike>, "bytes[32]">;
            }, "0x2::object::UID">;
            size: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
        }, "0x2::table::Table">;
    }, "0x2::table_vec::TableVec">;
}, "@local-pkg/sui-stack-messaging::encryption_key_history::EncryptionKeyHistory">;
export declare const EditEncryptionKey: MoveTuple<import("@mysten/bcs").BcsType<boolean, boolean, "bool">[], "@local-pkg/sui-stack-messaging::encryption_key_history::EditEncryptionKey">;
