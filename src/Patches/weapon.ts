import {Injectable, terra} from "@project-selene/api";
import {PlayerWeapon} from "@project-selene/api/terra";
import {imposeMultiEquip} from "../item_handler";

export class MultiEquip extends Injectable(PlayerWeapon) {
    canMultiEquip(...args: unknown[]) {
        if (terra.g_options.get("multi_equip") || imposeMultiEquip) {
            // The option is used, or it is called while equipping weapons for a new element
            return true;
        }
        if (!this.isRanged()
            && terra.g_player.combat.getTotalMeleeWeapons() < terra.g_player.combat.getTotalElementsUnlocked()) {
            // Not enough melee weapons to fill all element slots
            return true;
        }
        if (this.isRanged()
            && terra.g_player.combat.getTotalRangedWeapons() < terra.g_player.combat.getTotalElementsUnlocked()) {
            // Not enough range weapons to fill all element slots
            return true;
        }
        return super.canMultiEquip(...args);
    }
}
