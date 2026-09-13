import {Injectable} from "@project-selene/api";
import {ChestDatabase, Chest} from "@project-selene/api/terra";
import {addMessage, addDebug} from "../doc";
import {client_data} from "../client";
import {loc_game_name_id} from "../location_gamename_id"


// Hide messages when checking a location
export class SkipItemDialogs extends Injectable(ChestDatabase) {
    runItemGetDialog(...args: unknown[]) {
    }
    runWeaponGetDialog(...args: unknown[]) {
    }
    runElementGetDialog(...args: unknown[]) {
    }
    runSyncLevelUp(...args: unknown[]) {
    }
}


export class ChestPatch extends Injectable(Chest) {
    open(...args: unknown[]) {
        addDebug(`Opened Chest ${this.key}`);
        if (loc_game_name_id.has(this.key)) {
            client_data.checkLocation(<number>loc_game_name_id.get(this.key))
        }
        return super.open(...args);
    }

    addItemContent(...args: unknown[]) {  // Don't give the chest items
    }
}
