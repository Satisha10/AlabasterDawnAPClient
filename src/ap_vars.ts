/*
Use the variable system of the game to refer to Archipelago client or multiworld data during condition evaluations.

A condition is written as "$ap.<COMMAND>.<VALUES>", where <VALUES> are an array of string separated with dots.
Example with the condition "$ap.areas.valley.plains":
- The command is "areas", which will check if all the area values are accessible (via checkAreaAccess).
- The values are ["valley", "plains"], and are passed to checkAreaAccess with the callback.
*/

import {terra} from "@project-selene/api";
import {client, client_data} from "./client";
import {fetchSave} from "./utils"
import {addMessage} from "./doc";
import {loc_game_name_id} from "./location_gamename_id";

interface AreaUnlocks {
    area: number;
    dungeon: number;
    global: number;
}

// TODO these are hardcoded for now, but it might change when random spawn or using a subset of areas is implemented.
let areas = [
    "plains",
    "swamp",
]

let dungeons = [
    "aether",
    "cryo",
]

let global = [
    "aether",
    "plains",
    "swamp",
    "cryo",
]


class APVars {
    unlocked_areas: string[];
    unlock_amounts: AreaUnlocks;

    constructor() {
        this.unlocked_areas = ["valley"];
        this.unlock_amounts = {area: 0, dungeon: 0, global: 0}

        const accessor = terra.g_vars.registerAccessor("ap");
        accessor.add("areas", (keys: string[]) => this.checkAreaAccess(keys));
        accessor.add("loc", (keys: string[]) => this.checkLoc(keys[2]));
    }

    checkAreaAccess(areas: string[]): boolean {
        // Return true if every area in the condition is accessible.
        for (let area of areas.slice(2)) {
            if (!this.unlocked_areas.includes(area)) {
                return false;
            }
        }
        return true;
    }

    checkLoc(loc: string): boolean {
        // Return true if the location is checked in the multiworld or local storage.
        let loc_id = loc_game_name_id.get(loc);
        if (loc_id == undefined) {
            return false;
        }
        return (client.room.checkedLocations.includes(loc_id) || client_data.checked_locations.includes(loc_id));
    }

    exportState(): Object {
        return {
            unlocked_areas: this.unlocked_areas,
            unlock_amounts: this.unlock_amounts,
        }
    }

    importState(data: any) {
        this.unlocked_areas = fetchSave(data.unlocked_areas, [], "unlocked_areas");
        this.unlock_amounts = fetchSave(data.unlock_amounts, {area: 0, dungeon: 0, global: 0}, "unlock_amounts");
    }

    unlockNewArea(type: "area" | "dng" | "global") {
        // Update the unlocked regions when a progressive area unlock (of the given type) is received
        if (type == "area") {
            let index = this.unlock_amounts.area
            if (index >= areas.length) {
                return;
            }
            this.unlock_amounts.area = index + 1
            this.unlocked_areas.push(areas[index])
        }
        else if (type == "dng") {
            let index = this.unlock_amounts.dungeon
            if (index >= dungeons.length) {
                return;
            }
            this.unlock_amounts.dungeon = index + 1
            this.unlocked_areas.push(dungeons[index])
        }
        else if (type == "global") {
            let index = this.unlock_amounts.global
            if (index >= global.length) {
                return;
            }
            this.unlock_amounts.global = index + 1
            this.unlocked_areas.push(global[index])
        }
        else {
            addMessage(`Failed to unlock a new area: unknown type ${type} in unlockNewArea`)
        }
    }
}

export const ap_vars = new APVars();
