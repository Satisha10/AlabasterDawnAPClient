import {terra} from "@project-selene/api";
import {Item} from "archipelago.js";

import {addMessage, addDebug} from "./doc";
import {item_name_data} from "./item_id_gamedata";
import {item_flags, client_data} from "./client";

// Flag, set to true while executing equipWeaponsForElement to allow multi-equip
// That way, the other elements in the loadouts are not affected by receiving an element
export let imposeMultiEquip = false;

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

        // Equip weapons if the player had no melee/range weapon and at least one element is there
        // This happens when creating the file if the elements are received before the weapons
        let equip_weapons = (
            terra.g_player.combat.getTotalElementsUnlocked() >= 1
            && (terra.g_player.combat.getTotalMeleeWeapons() == 0
            || terra.g_player.combat.getTotalRangedWeapons() == 0)
        )
        terra.g_player.combat.setWeaponUnlock(weapon, true);

        // Check that at least one range and melee weapon are now unlocked
        if (equip_weapons
            && terra.g_player.combat.getTotalMeleeWeapons() >= 1
            && terra.g_player.combat.getTotalRangedWeapons() >= 1
        ) {
            for (let i = 0; i < terra.g_player.combat.loadouts.length; i++) {
                terra.g_player.combat.setLoadout(i);
                terra.g_player.combat.equipWeapon(terra.g_player.combat.getActiveElement(), terra.g_player.combat.getMeleeWeaponList()[0], true);
                terra.g_player.combat.equipWeapon(terra.g_player.combat.getActiveElement(), terra.g_player.combat.getRangedWeaponList()[0], true);
            }
            terra.g_player.combat.setLoadout(0);
        }
    }
    else if (item_data.name.startsWith("ELEMENT:")) {
        addDebug("Unlock " + item_data.name)
        let elemID = Number(item_data.name.substring("ELEMENT:".length));
        item_flags.gaveElem(elemID);
        terra.g_player.setCore(elemID, true);
        imposeMultiEquip = true;
        equipWeaponsForElement(elemID)
        imposeMultiEquip = false;
        // Spawn element: switch to it
        if (terra.g_player.combat.getTotalElementsUnlocked() == 1) {
            let elemMap = new Map([
                [14, terra.ELEMENT.NEUTRAL],
                [15, terra.ELEMENT.AETHER],
                [16, terra.ELEMENT.IGNIS],
                [17, terra.ELEMENT.CRYO]
            ])
            if (!elemMap.has(elemID)) {
                addMessage(`Unknown element ID: ${elemID}`);
                return;
            }
            terra.g_player.combat.setElementMode(elemMap.get(elemID), true, true);
        }
    }
    else if (item_data.name.startsWith("PARTY:")) {
        let member = item_data.name.substring("PARTY:".length);
        // @ts-ignore TypeScript complains about the get property
        terra.g_party.addPartyMember(terra.PartyMember.get(member))
    }
    else if (item_data.name == "Divine Connection") {
        item_flags.gaveSync();
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
        // terra.g_player.combat.core.addExp(90000, 30)
        // terra.g_scene.teleport("start.subdng.room-04", "")
        // terra.g_plot.plots["southDng"].progressToState("finalElevator")
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


export function equipWeaponsForElement(elemID: number) {

    let eleIndexMap = new Map([[14, 0], [15, 1], [16, 2], [17, 3]]);
    let eleIndex = eleIndexMap.get(elemID);
    if (eleIndex == undefined) {
        addMessage(`Unknown element number ${elemID} used in equipWeaponsForElement.`);
        return;
    }

    let currentLoadout: number = terra.g_player.combat.currentLoadout;
    let meleeWeapons: string[] = terra.g_player.combat.getMeleeWeaponList();
    let rangeWeapons: string[] = terra.g_player.combat.getRangedWeaponList();
    // This can happen during spawn items. The weapons will get equipped once they are received as well.
    if (meleeWeapons.length == 0 || rangeWeapons.length == 0) {
        return;
    }

    for (let i = 0; i < terra.g_player.combat.loadouts.length; i++) {
        terra.g_player.combat.setLoadout((i + currentLoadout) % terra.g_player.combat.loadouts.length);
        terra.g_player.combat.equipWeapon(eleIndex, meleeWeapons[0], true);
        terra.g_player.combat.equipWeapon(eleIndex, rangeWeapons[0], true);
    }
    terra.g_player.combat.setLoadout(currentLoadout);
}
