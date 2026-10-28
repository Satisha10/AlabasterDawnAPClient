import {Injectable, terra} from "@project-selene/api";
import {ChestDatabase, Chest} from "@project-selene/api/terra";
import {addDebug} from "../doc";
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

    getType(...args: unknown[]) {
        let classification = client_data.scouted_locations.get(this.key);
        if (classification == undefined) {
            addDebug(`Unknown chest key ${this.key} in the scouted locations`);
            return "default";
        }
        let is_prog = classification & 0b001;
        let is_useful = classification & 0b010;
        let is_trap = classification & 0b100;

        if (is_prog && is_useful) {
            return "relic";  // TODO hinted items
        }
        if (is_prog) {
            return "outKey";
        }
        if (is_useful) {
            return "arts";
        }
        if (is_trap) {
            if (terra.g_options.get("fake_traps")) {
                return "dngKey";
            }
            return "sackCloth";
        }
        return "default";
    }
}
