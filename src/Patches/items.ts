import {Injectable, terra} from "@project-selene/api";
import {PlayerInventory, PlayerModel, PlayerCombat, PartyModel} from "@project-selene/api/terra";
import {addMessage, addDebug} from "../doc";
import {item_name_data} from "../item_name_gamedata";
import {loc_game_name_id} from "../location_gamename_id";
import {client} from "../client";

type LoadState = {
    melee: string[];
    ranged: string[];
}

export class ItemTracker extends Injectable(PlayerInventory) {
    addItem(key: string, quantity = 1, skipHUD = false, skipEvent = false, ...args: unknown[]) {
        addDebug(`Received item ${key} times ${quantity}, skipHUD ${skipHUD}, skipEvent ${skipEvent}`);
        return super.addItem(key, quantity, skipHUD, skipEvent, ...args);
    }
}

export class ElementTracker extends Injectable(PlayerModel) {
    setCore(type: number, state: boolean, ...args: unknown[]) {
        addDebug(`setCore ${type}, ${state}`);
        let elemMap = new Map([[14, "Physis"], [15, "Aether"], [16, "Cryo"], [17, "Ignis"]]);
        let elemName = elemMap.get(type);
        if (elemName && state && item_flags.checkedElem(type)){
            if (loc_game_name_id.has(elemName)) {
                client.check(<number>loc_game_name_id.get(elemName));
            }
            else {
                addMessage(`Unknown element checked ${elemName}`)
            }
            return;
        }
        return super.setCore(type, state, ...args);
    }
}

export class WeaponTracker extends Injectable(PlayerCombat) {
    setWeaponUnlock(key: string, unlock: boolean, ...args: unknown[]) {
        addDebug(`Get weapon ${key} unlock ${unlock}`);
        if (unlock && item_flags.checkedWeapon(key)) {
            if (loc_game_name_id.has(key)) {
                client.check(<number>loc_game_name_id.get(key));
            }
            else {
                addMessage(`Unknown weapon checked ${key}`)
            }
            return;
        }
        return super.setWeaponUnlock(key, unlock, ...args);
    }
    increaseSyncLevel(...args: unknown[]) {
        addDebug("Increased sync level");
        return super.increaseSyncLevel(...args);
    }
}

export class PartyTracker extends Injectable(PartyModel) {
    addPartyMember(member: string, ...args: unknown[]) {
        addDebug(`New member ${member}`);  // TODO typing
        if (loc_game_name_id.has(member)) {
            client.check(<number>loc_game_name_id.get(member))
        }
        return super.addPartyMember(member, ...args);
    }
}

// Class to track if a location check is due to receiving an AP item
class ItemFlags {
    elemID: number;
    weaponKey: string;
    constructor() {
        this.elemID = 0;
        this.weaponKey = "";
    }
    gaveElem(value: number) {
        // Received an element (with value its ID) through an AP item
        this.elemID = value;
    }
    checkedElem(value: number): boolean {
        // Called in the ElementTracker hook when detecting a new element,
        // return false if the change is caused by receiving an item.
        if (value == this.elemID) {
            this.elemID = 0;
            return false;
        }
        return true;
    }
    gaveWeapon(value: string) {
        // Received a weapon (with value its key) through an AP item
        this.weaponKey = value;
    }
    checkedWeapon(value: string): boolean {
        // Called in the WeaponTracker hook when detecting a new weapon,
        // return false if the change is caused by receiving an item.
        if (value == this.weaponKey) {
            this.weaponKey = "";
            return true;
        }
        return false;
    }
}

export const item_flags = new ItemFlags()

// TODO move this function
export function handle_item(name: string) {
    let item_data = item_name_data.get(name);
    if (!item_data) {
        addMessage("Warning: Unknown item name received: " + name);
        return;
    }
    if (item_data.name.startsWith("WEAPON:")) {
        let weapon = item_data.name.substring("WEAPON:".length);
        addDebug("Unlock " + weapon);
        terra.g_player.combat.setWeaponUnlock(weapon, true);
        item_flags.gaveWeapon(weapon);
    }
    else if (item_data.name.startsWith("ELEMENT:")) {
        addDebug("Unlock " + item_data.name)
        let elemID = Number(item_data.name.substring("ELEMENT:".length));
        // TODO remove once init file is called
        terra.g_player.setCore(18, true);  // Element change
        terra.g_player.setCore(24, true);  // Loadouts
        terra.g_player.setCore(elemID, true);
        item_flags.gaveElem(elemID);

        let melee: string[] = terra.g_player.combat.getMeleeWeaponList();
        let range: string[] = terra.g_player.combat.getRangedWeaponList();
        let elem: number = terra.g_player.combat.getTotalElementsUnlocked();

        // TODO maybe do that on setup
        // Equip weapons manually (with duplicates) if not enough weapons available to fill all slots
        if (melee.length < 2 || range.length < 2) {  // TODO elem instead of 2
            terra.g_player.combat.setLoadout(0);

            let state: LoadState = {  // Force duplicates on the loadout
                melee: [melee[0], melee[0], melee[0], melee[0]],
                ranged: [range[0], range[0], range[0], range[0]]
            };
            for (let i = 0; i < terra.g_player.combat.loadouts.length; i++) {
                terra.g_player.combat.loadouts[i].setState(state);
            }
            terra.g_player.combat.setLoadout(1);  // Reload loadout 0 so the weapons get equipped on the new element
            terra.g_player.combat.setLoadout(0);
        }
        else {
            terra.g_player.autoEquipWeapons();  // This is what the game usually does
        }
    }
    // TODO Items for party members
    //else if (item_data.name.startsWith("PARTY:")) {
    //    let member = item_data.name.substring("PARTY:".length);
    //    addDebug("Unlock " + member);
    //    terra.g_party.addPartyMember("filia");
    //}
    else if (item_data.name == "Divine Connection") {
        terra.g_player.combat.increaseSyncLevel();
    }
    else if (item_data.name.startsWith("PLOT:")) {
        let plot_data = item_data.name.substring("PLOT:".length).split(".");
        if (plot_data.length != 2) {
            addMessage(`Failed to parse ${item_data.name}: expected it to split into two parts.`);
        }
        else {
            addDebug(`Progress ${plot_data[0]} to ${plot_data[1]}`);
            terra.g_plot.progressPlotToStateC(plot_data[0], plot_data[1]);
        }
    }
    else if (item_data.name.startsWith("CL:")) {
        let area = item_data.name.substring("CL:".length);
        addDebug(`Progress  community level for ${area}`);
        terra.g_plot.progressPlotToNextState("ap_" + area);
    }
    else if (item_data.name == "test") {
        //terra.g_plot.progressPlotToStateC("ch1c", "goToRemisRock");
        //let party_data = new PartyMember();
        //let member_data = party_data.get("filia");
        //terra.g_party.addPartyMember(member_data);

        //terra.g_plot.progressPlotToStateC("ch2b", "traineeFlashback");
        //terra.g_scene.teleport("start.north.north-03-dungeon", "");
    }
    else {
        terra.g_player.inventory.addItem(item_data.name, item_data.qty);
    }
}
