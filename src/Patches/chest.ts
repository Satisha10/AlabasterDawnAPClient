import {Injectable} from "@project-selene/api";
import {ChestDatabase, Chest} from "@project-selene/api/terra";
import {addMessage, addDebug} from "../doc";
import {client} from "../client";
import {loc_game_name_id} from "../location_gamename_id"

export class SkipItemDialogs extends Injectable(ChestDatabase) {
    runItemGetDialog(...args: unknown[]) {  // Don't show the item message
        addDebug("Skipped ChestDatabase.runItemGetDialog");
    }
    runWeaponGetDialog(...args: unknown[]) {  // Don't show the weapon message
        addDebug("Skipped ChestDatabase.runWeaponGetDialog");
    }
    runElementGetDialog(...args: unknown[]) {  // Don't show the weapon message
        addDebug("Skipped ChestDatabase.runWeaponGetDialog");
    }
    runSyncLevelUp(...args: unknown[]) {  // Don't show the weapon message
        addDebug("Skipped ChestDatabase.runSyncLevelUp");
    }
}


export class ChestPatch extends Injectable(Chest) {
    open(...args: unknown[]) {
        addMessage(`Opened Chest ${this.key}`);
        if (loc_game_name_id.has(this.key)) {
            client.check(<number>loc_game_name_id.get(this.key))
        }
        return super.open(...args);
    }

    addItemContent(...args: unknown[]) {  // Don't give the chest items
        addDebug(`Skip giving ${this.items[0].key}`);
    }
}
