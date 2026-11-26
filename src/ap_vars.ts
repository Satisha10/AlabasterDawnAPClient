/*
Use the variable system of the game to refer to Archipelago client or multiworld data during condition evaluations.

A condition is written as "$ap.<COMMAND>.<VALUES>", where <VALUES> are an array of string separated with dots.
Example with the condition "$ap.areas.valley.plains":
- The command is "areas", which will check if all the area values are accessible (via checkAreaAccess).
- The values are ["valley", "plains"], and are passed to checkAreaAccess with the callback.

A text can also be fetched, which is written as "{v:ap.<COMMAND>.<VALUES>}". Example: "{v:ap.area_prog.aether}".
*/

import {terra} from "@project-selene/api";
import {client, client_data, slot_data} from "./client";
import {fetchSave} from "./utils"
import {addDebug, addMessage} from "./doc";
import {loc_game_name_id} from "./location_gamename_id";

interface AreaUnlocks {
    overworld: number;
    dungeon: number;
    global: number;
}

// TODO these are hardcoded for now, but it might change when random spawn or using a subset of areas is implemented.
let overworld = [
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

// Name displayed to the player when unlocking the area
let ui_names = new Map([
    ["valley", "Koro Valley"],
    ["aether", "Trial of Aether"],
    ["plains", "Aurum Plains"],
    ["swamp", "Scala Moor"],
    ["cryo", "Trial of Cryo"],
])

class APVars {
    unlocked_areas: string[];
    unlock_amounts: AreaUnlocks;
    variables: string[];

    constructor() {
        this.unlocked_areas = ["valley"];
        this.unlock_amounts = {overworld: 0, dungeon: 0, global: 0};
        this.variables = ["valley_bridges", "low_tide"];

        const accessor = terra.g_vars.registerAccessor("ap");
        accessor.add("areas", (keys: string[]) => this.checkAreaAccess(keys));
        accessor.add("loc", (keys: string[]) => this.checkLoc(keys[2]));
        accessor.add("vars", (keys: string[]) => this.checkVars(keys[2]));
        accessor.add("area_prog", (keys: string[]) => this.getAreaProgressMessage(keys[2]));
    }

    checkAreaAccess(areas: string[]): boolean {
        // Return true if every area in the condition is accessible.
        for (let area of areas.slice(2)) {
            if (!ui_names.has(area)) {  // Sanity check
                addMessage(`Unknown area in APVars.checkAreaAccess: ${area}`);
                return false;
            }
            if (!this.unlocked_areas.includes(area)) {
                return false;
            }
        }
        return true;
    }

    checkLoc(loc: string): boolean {
        // TODO Handle locs with . in them (take slice and join with .)
        // Return true if the location is checked in the multiworld or local storage.
        let loc_id = loc_game_name_id.get(loc);
        if (loc_id == undefined) {
            addDebug(`Unknown location ${loc} in APVars`);
            return false;
        }
        return (client.room.checkedLocations.includes(loc_id) || client_data.checked_locations.includes(loc_id));
    }

    checkVars(variable: string): boolean {
        // Return true if the variable is present in this.variables.
        return this.variables.includes(variable);
    }

    exportState(): Object {
        return {
            unlocked_areas: this.unlocked_areas,
            unlock_amounts: this.unlock_amounts,
            variables: this.variables,
        }
    }

    importState(data: any) {
        this.unlocked_areas = fetchSave(data.unlocked_areas, ["valley"], "unlocked_areas");
        this.unlock_amounts = fetchSave(data.unlock_amounts, {area: 0, dungeon: 0, global: 0}, "unlock_amounts");
        this.variables = fetchSave(data.variables, ["valley_bridges", "low_tide"], "variables");
    }

    resetState() {
        this.unlocked_areas = ["valley"];
        this.unlock_amounts = {overworld: 0, dungeon: 0, global: 0};
        this.variables = ["valley_bridges", "low_tide"];
    }

    unlockNewArea(type: string) {
        // Update the unlocked regions when a progressive area unlock (of the given type) is received
        if (type == "area") {
            let index = this.unlock_amounts.overworld;
            if (index >= overworld.length) {
                return;
            }
            this.unlock_amounts.overworld = index + 1;
            this.unlocked_areas.push(overworld[index]);
            this.showUnlockAreaMessage(overworld[index]);
        }
        else if (type == "dng") {
            let index = this.unlock_amounts.dungeon;
            if (index >= dungeons.length) {
                return;
            }
            this.unlock_amounts.dungeon = index + 1;
            this.unlocked_areas.push(dungeons[index]);
            this.showUnlockAreaMessage(dungeons[index]);
        }
        else if (type == "global") {
            let index = this.unlock_amounts.global;
            if (index >= global.length) {
                return;
            }
            this.unlock_amounts.global = index + 1;
            this.unlocked_areas.push(global[index]);
            this.showUnlockAreaMessage(global[index]);
        }
        else {
            if (!ui_names.has(type)) {
                addMessage(`Failed to unlock a new area: unknown type ${type} in unlockNewArea`)
            }
            if (!this.unlocked_areas.includes(type)) {
                this.unlocked_areas.push(type);
            }

        }
    }
    showUnlockAreaMessage(name: string) {
        let message_name = ui_names.get(name);
        if (message_name == undefined) {
            return;
        }
        addMessage(`You can now access ${message_name} !`);
    }

    getAreaProgressMessage(area: string): string {
        // Return the text for the progression towards unlocking the area.
        // TODO 3 cases depending on area/options
        if (slot_data.progressive_areas == "combine") {
            let i_found = this.unlock_amounts.global;
            let i_req = global.indexOf(area) + 1
            return `Area unlocks: ${i_found}/${i_req}.`;
        }
        if (slot_data.progressive_areas == "split") {
            if (dungeons.includes(area)) {
                let i_found = this.unlock_amounts.dungeon;
                let i_req = dungeons.indexOf(area) + 1
                return `Area unlocks: ${i_found}/${i_req}.`;
            }
            let i_found = this.unlock_amounts.overworld;
            let i_req = overworld.indexOf(area) + 1
            return `Area unlocks: ${i_found}/${i_req}.`;
        }
        // slot_data.area_progression == "separate"
        return `Missing ${ui_names.get(area)} unlock.`
    }
}

export const ap_vars = new APVars();
