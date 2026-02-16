import { MoveStruct, MoveTuple } from '../utils/index.js';
export declare const Auth: MoveStruct<{
    member_permissions: MoveStruct<{
        contents: import("@mysten/bcs").BcsType<{
            key: string;
            value: {
                contents: {
                    name: string;
                }[];
            };
        }[], Iterable<{
            key: string | Uint8Array<ArrayBufferLike>;
            value: {
                contents: Iterable<{
                    name: string;
                }> & {
                    length: number;
                };
            };
        }> & {
            length: number;
        }, string>;
    }, "0x2::vec_map::VecMap<bytes[32], 0x2::vec_set::VecSet<std::type_name::TypeName>>">;
    config: MoveStruct<{
        id: MoveStruct<{
            id: import("@mysten/bcs").BcsType<string, string | Uint8Array<ArrayBufferLike>, "bytes[32]">;
        }, "0x2::object::UID">;
        version: import("@mysten/bcs").BcsType<string, string | number | bigint, "u64">;
    }, "0x2::versioned::Versioned">;
}, "@local-pkg/sui-stack-messaging::auth::Auth">;
export declare const EditPermissions: MoveTuple<import("@mysten/bcs").BcsType<boolean, boolean, "bool">[], "@local-pkg/sui-stack-messaging::auth::EditPermissions">;
