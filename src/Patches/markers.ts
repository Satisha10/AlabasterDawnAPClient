import {Injectable, terra} from "@project-selene/api";
import {
    FloorInteractable, LangEntry,
    MapInfoLayer,
    MapInteractLayer,
    Vec2
} from "@project-selene/api/terra";
import {addDebug, addMessage} from "../doc";
import {client, client_data} from "../client";
import {loc_game_name_id} from "../location_gamename_id";
import {loc_game_name_ap_name} from "../location_gamename_name";

// TODO Save the data
// TODO make them appear without setting seen to true (or circumvent that in some way)

// terra.g_menu.gui.getMenu(SUB_MENU.MAP).views.get(MAP_MENU_VIEW.MAP).getMap().getInteractLayer().addMarkerInteract
// For creating markers outside the class
export class MarkerMap extends Injectable(MapInteractLayer) {
    enter() {
        this.active = true;
        // TODO remove test markers

        let interact = FloorInteractable.get("chest-prog-1", { type: "chest-prog-useful" })
        interact.pos = Vec2.fromArray([-20, 300])
        this.addInteract(interact, this.floor.visited, -17, -33, 26, true)

        interact = FloorInteractable.get("chest-prog-2", { type: "chest-prog" })
        interact.pos = Vec2.fromArray([-10, 300])
        this.addInteract(interact, this.floor.visited, -17, -33, 26, true)

        interact = FloorInteractable.get("chest-prog-3", { type: "chest-useful" })
        interact.pos = Vec2.fromArray([0, 300])
        this.addInteract(interact, this.floor.visited, -17, -33, 26, true)

        interact = FloorInteractable.get("chest-prog-4", { type: "chest-filler" })
        interact.pos = Vec2.fromArray([10, 300])
        this.addInteract(interact, this.floor.visited, -17, -33, 26, true)

        interact = FloorInteractable.get("chest-prog-5", { type: "chest-trap" })
        interact.pos = Vec2.fromArray([20, 300])
        this.addInteract(interact, this.floor.visited, -17, -33, 26, true)

        interact = FloorInteractable.get("chest-prog-6", { type: "chest-unknown" })
        interact.pos = Vec2.fromArray([30, 300])
        this.addInteract(interact, this.floor.visited, -17, -33, 26, true)

        interact = FloorInteractable.get("chest-prog-7", { type: "chest-trap-fake" })
        interact.pos = Vec2.fromArray([20, 290])
        this.addInteract(interact, this.floor.visited, -17, -33, 26, true)


        this.updateInteractPositions(true);
    }
    addMarkerInteract(pos: any, type: any, ...args: unknown[]) {
        //addDebug(`${pos}, ${type}`);
        return super.addMarkerInteract(pos, type, ...args);
    }
    addInteract(old_interact: any, visited: any, minX: any, minY: any, gridWidth: any, ignoreVisited = false, ...args: unknown[]) {
        if (old_interact.uid.startsWith("dyn_chest_")) {
            let chest_key: string = old_interact.uid.slice("dyn_chest_".length);
            let loc_name = loc_game_name_ap_name.get(chest_key)
            if (loc_name == undefined) {
                return;  // The chest is not a multiworld location: don't show it on the map.
            }
            let new_interact = FloorInteractable.get(`ap_label_${loc_name}`, { type: getChestIcon(chest_key) });  // TODO name is location name
            new_interact.pos = old_interact.pos;
            return super.addInteract(new_interact, visited, minX, minY, gridWidth, true, ...args);
        }
        return super.addInteract(old_interact, visited, minX, minY, gridWidth, ignoreVisited, ...args);
    }
}

export class MarkerTooltip extends Injectable(MapInfoLayer) {
    setToolTipContent(interact: any, ...args: unknown[]) {
        super.setToolTipContent(interact, ...args);
        if (interact.uid.startsWith("ap_label_")) {
            let text: string = interact.uid.slice("ap_label_".length);
            if (this.interactTooltip.text) {
                let lang_entry = LangEntry.get({ en_US: text, langID: 947591, path: "#warnings" });  // TODO path
                this.interactTooltip.setText(lang_entry);
            }
        }
    }
}

function getChestIcon(key: string): string {
    let chest: any = terra.g_chests.getChest(key)
    let loc_id = loc_game_name_id.get(key);
    if (!chest) {
        addMessage(`Unknown chest key ${key} in the game data`);
        return "chest-unknown";
    }
    if (!chest.seen) {
        return "chest-unknown";
    }
    if (chest.opened) {
        return "chest-OPEN";
    }

    if (loc_id == undefined) {
        addDebug(`Unknown chest key ${key} in the location table`);
        return "chest-unknown";
    }
    let classification = client_data.scouted_locations.get(loc_id);
    if (classification == undefined) {
        addDebug(`Unknown chest key ${key} in the scouted locations`);
        return "chest-unknown";
    }
    if (client.room.checkedLocations.includes(loc_id)) {  // TODO not needed once collect for chests is implemented
        return "chest-OPEN";
    }

    let is_prog = classification & 0b001;
    let is_useful = classification & 0b010;
    let is_trap = classification & 0b100;

    if (is_prog & is_useful) {
        return "chest-prog-useful";  // TODO hinted items
    }
    if (is_prog) {
        return "chest-prog";
    }
    if (is_useful) {
        return "chest-useful";
    }
    if (is_trap) {
        return "chest-trap-fake";  // TODO fake icon or not with option
    }
    return "chest-filler";
}
