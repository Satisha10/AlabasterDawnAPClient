import {terra} from "@project-selene/api";
import {item_flags} from "./client";

type LoadState = {
    melee: string[];
    ranged: string[];
}

// TODO Fix main quests skipped and bridges repaired
export function initializeFile() {
    item_flags.is_init = true;

    terra.g_player.setCore(0, true);
    terra.g_player.setCore(1, true);
    terra.g_player.setCore(2, true);
    terra.g_player.setCore(3, true);
    terra.g_player.setCore(4, true);
    //terra.g_player.setCore(5, true); // Charge 2, 3
    //terra.g_player.setCore(6, true);
    //terra.g_player.setCore(7, true); // Money
    terra.g_player.setCore(8, true);
    terra.g_player.setCore(9, true);
    terra.g_player.setCore(10, true);
    terra.g_player.setCore(11, true);
    terra.g_player.setCore(12, true);
    terra.g_player.setCore(13, true);
    terra.g_player.setCore(14, true);  // Physis
    // 14-17: elements
    terra.g_player.setCore(18, true);
    terra.g_player.setCore(19, true);
    terra.g_player.setCore(20, true);
    terra.g_player.setCore(21, true);
    terra.g_player.setCore(22, true);

    terra.g_player.inventory.addItem("speed-run")

    //let melee: string[] = terra.g_player.combat.getMeleeWeaponList();
    //let range: string[] = terra.g_player.combat.getRangedWeaponList();

    terra.g_player.combat.setLoadout(0);

    terra.g_player.combat.setWeaponUnlock("sword", true);
    terra.g_player.combat.setWeaponUnlock("crossbow", true);

    // Create the loadouts with duplicates, so there are weapons equipped for every element even if there are not
    // enough different weapons to fill all slots.
    let state: LoadState = {
        melee: ["sword", "sword", "sword", "sword"],
        ranged: ["crossbow", "crossbow", "crossbow", "crossbow"],
    }
    for (let i = 0; i < terra.g_player.combat.loadouts.length; i++) {
        terra.g_player.combat.loadouts[i].setState(state);
    }
    terra.g_player.combat.setLoadout(1);  // Reload loadout 0 so the weapons get equipped
    terra.g_player.combat.setLoadout(0);

    //terra.g_plot.progressPlotToStateC("ch2b", "traineeFlashback");

    item_flags.is_init = false;
}
