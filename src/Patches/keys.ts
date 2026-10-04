import {Injectable, terra} from "@project-selene/api";
import {KeyWallLockEntity} from "@project-selene/api/terra";

export class DungeonKeys extends Injectable(KeyWallLockEntity) {
    getItemKey(...args: unknown[]) {
        let map: string | undefined;
        if (terra.g_game.map.loading?.path) {  // Loaded map takes priority when it exists
            map = terra.g_game.map.loading?.path
        }
        else {
            map = terra.g_game.map.active?.path;
        }
        if (map == undefined) {
            return super.getItemKey(...args);
        }
        if (map.startsWith("start.dng")) {  // Trial of Aether
            return "ap-key-aether";
        }
        if (map.startsWith("swamp.dng")) {  // Trial of Cryo
            return "ap-key-cryo";
        }
        return super.getItemKey(...args);
    }
}
