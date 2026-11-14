import {Injectable, terra} from "@project-selene/api";
import {DropManager, PlayerCoreStats, PlayerWeapon} from "@project-selene/api/terra";


export class IncreaseDrops extends Injectable(DropManager) {
    roll(key: string, rolls: number, ...args: unknown[]) {
        return super.roll(key, rolls * terra.g_options.get("drop_rate"), ...args);
    }
}

export class IncreaseCoreExp extends Injectable(PlayerCoreStats) {
    addExp(exp: number, ...args: unknown[]) {
        return super.addExp(exp * terra.g_options.get("exp_mult"), ...args);
    }
}

// TODO Doesn't work well, need to also fix the initial exp
/*
export class IncreaseCuisineExp extends Injectable(PlayerCuisine) {
    addExp(exp: number, ...args: unknown[]) {
        return super.addExp(exp * terra.g_options.get("exp_mult"), ...args);
    }
}
*/

export class IncreaseWeaponExp extends Injectable(PlayerWeapon) {
    addExp(exp: number, ...args: unknown[]) {
        super.addExp(exp * terra.g_options.get("exp_mult"), ...args);

        if (terra.g_options.get("share_weapon_exp")) {
            for (let weapon of ["sword", "hammer", "spear", "crossbow", "chakram", "kama"]) {
                // Other weapon has higher level than this
                if (terra.g_player.combat.weapons.get(weapon).level > this.level) {
                    this.setLevel(terra.g_player.combat.weapons.get(weapon).level);
                    this.exp = terra.g_player.combat.weapons.get(weapon).exp;
                }
                // Same level: compare experience
                if (terra.g_player.combat.weapons.get(weapon).level == this.level) {
                    if (terra.g_player.combat.weapons.get(weapon).exp > this.exp) {
                        this.exp = terra.g_player.combat.weapons.get(weapon).exp;
                    }
                    else {
                        terra.g_player.combat.weapons.get(weapon).exp = this.exp;
                    }
                }
                // This weapon has higher level
                terra.g_player.combat.weapons.get(weapon).setLevel(this.level);
                terra.g_player.combat.weapons.get(weapon).exp = this.exp;

            }
        }
    }
}
