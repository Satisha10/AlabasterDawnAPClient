import {Injectable, terra} from "@project-selene/api";
import {PlayerInventory, PlayerModel, PlayerCombat, PartyModel, Vars, PlayerLoadout, PartyMember} from "@project-selene/api/terra";
import {addMessage} from "../doc";
import {item_name_data} from "../item_name_gamedata";
import {loc_game_name_id} from "../location_gamename_id";
import {client} from "../client";

type LoadState = {
    melee: string[];
    ranged: string[];
}

export class ItemTracker extends Injectable(PlayerInventory) {
    addItem(key: string, quantity = 1, skipHUD = false, skipEvent = false, ...args: unknown[]) {
        addMessage(`Received item ${key} times ${quantity}, skipHUD ${skipHUD}, skipEvent ${skipEvent}`);
        return super.addItem(key, quantity, skipHUD, skipEvent, ...args);
    }
}

export class ElementTracker extends Injectable(PlayerModel) {
    setCore(type: any, state: any, ...args: unknown[]) {  // TODO Type
        addMessage(`setCore ${type}, ${state}`)  // TODO filter for element ID
        if (loc_game_name_id.has(type)) {
            client.check(<number>loc_game_name_id.get(type))
        }
        return super.setCore(type, state, ...args);
    }
}

export class WeaponTracker extends Injectable(PlayerCombat) {
    setWeaponUnlock(key: string, unlock: boolean, ...args: unknown[]) {
        addMessage(`Get weapon ${key} unlock ${unlock}`);
        if (loc_game_name_id.has(key)) {
            client.check(<number>loc_game_name_id.get(key))
        }
        return super.setWeaponUnlock(key, unlock, ...args);
    }
}

export class PartyTracker extends Injectable(PartyModel) {
    addPartyMember(member: string, ...args: unknown[]) {
        addMessage(`New member ${member}`);  // TODO typing
        if (loc_game_name_id.has(member)) {
            client.check(<number>loc_game_name_id.get(member))
        }
        return super.addPartyMember(member, ...args);
    }
}

export function handle_item(name: string) {
    let item_data = item_name_data.get(name);
    if (!item_data) {
        addMessage("Unknown item name received: " + name);
        return;
    }
    if (item_data.name.startsWith("WEAPON:")) {
        let weapon = item_data.name.substring("WEAPON:".length);
        addMessage("Unlock" + weapon)
        terra.g_player.combat.setWeaponUnlock(weapon, true);
    }
    else if (item_data.name.startsWith("ELEMENT_")) {  // PLAYER_CORE
        addMessage("Unlock" + item_data.name)
        terra.g_player.setCore(18, true);  // Element change
        terra.g_player.setCore(24, true);  // Loadouts
        terra.g_player.setCore(15, true);  // TODO don't hardcode
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
            }
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
    else if (item_data.name.startsWith("PARTY:")) {
        let member = item_data.name.substring("PARTY:".length);
        addMessage("Unlock" + member);
        terra.g_party.addPartyMember("filia");  // TODO fix
    }
    // TODO Divine connection
    else if (item_data.name == "test") {
        //terra.g_plot.progressPlotToStateC("ch1c", "goToRemisRock")
        //let party_data = new PartyMember();
        //let member_data = party_data.get("filia");
        //terra.g_party.addPartyMember(member_data);

        //terra.g_plot.progressPlotToStateC("ch2b", "traineeFlashback");
        //terra.g_scene.teleport("start.north.north-03-dungeon", "");
    }
}
