import {terra} from "@project-selene/api";
import {Item} from "archipelago.js";

import {addMessage, addDebug} from "./doc";
import {item_name_data} from "./item_id_gamedata";
import {item_flags, client_data} from "./client";

import {connect_menu} from "./connect_menu";

type LoadState = {
    melee: string[];
    ranged: string[];
}

export function giveGameItem(item: Item) {
    let item_data = item_name_data.get(item.id);
    if (!item_data) {
        addMessage("Warning: Unknown item name received: " + item.name);
        return;
    }

    if (item_data.name.startsWith("WEAPON:")) {
        let weapon = item_data.name.substring("WEAPON:".length);
        addDebug("Unlock " + weapon);
        item_flags.gaveWeapon(weapon);
        terra.g_player.combat.setWeaponUnlock(weapon, true);
    }
    else if (item_data.name.startsWith("ELEMENT:")) {
        addDebug("Unlock " + item_data.name)
        let elemID = Number(item_data.name.substring("ELEMENT:".length));
        item_flags.gaveElem(elemID);
        terra.g_player.setCore(elemID, true);
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
