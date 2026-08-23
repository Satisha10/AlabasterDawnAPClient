import {terra} from "@project-selene/api";
import {Item} from "archipelago.js";

import {addMessage, addDebug} from "./doc";
import {item_name_data} from "./item_name_gamedata";
import {item_flags, client_data} from "./client";

type LoadState = {
    melee: string[];
    ranged: string[];
}

export function handle_item(item: Item) {
    let item_data = item_name_data.get(item.name);
    if (!item_data) {
        addMessage("Warning: Unknown item name received: " + item.name);
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
        addDebug(`Progress community level for ${area}`);
        terra.g_plot.progressPlotToStateC("ap_lyhamn", "cl1");  // TODO Progress "ap_" + area
    }
    else if (item_data.name == "test") {
        //terra.g_plot.progressPlotToStateC("ch1c", "goToRemisRock");
        //let party_data = new PartyMember();
        //let member_data = party_data.get("filia");
        //terra.g_party.addPartyMember(member_data);

        terra.g_plot.progressPlotToStateC("ch2b", "traineeFlashback");
        //terra.g_scene.teleport("start.north.north-03-dungeon", "");
    }
    else {
        terra.g_player.inventory.addItem(item_data.name, item_data.qty);
    }
    display_item_message(item.name, item.sender.alias)
}

function display_item_message(item_name: string, sender: string) {
    if (sender == client_data.alias) {
        addMessage(`Found ${item_name}`);
    } else {
        addMessage(`Received ${item_name} from ${sender}`);
    }
}
