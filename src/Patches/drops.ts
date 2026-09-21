import {Injectable, terra} from "@project-selene/api";
import {DropManager, PlayerCoreStats, PlayerCuisine, PlayerWeapon} from "@project-selene/api/terra";
import {addDebug} from "../doc";


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

export class IncreaseCuisineExp extends Injectable(PlayerCuisine) {
    addExp(exp: number, ...args: unknown[]) {
        return super.addExp(exp * terra.g_options.get("exp_mult"), ...args);
    }
}

export class IncreaseWeaponExp extends Injectable(PlayerWeapon) {
    addExp(exp: number, ...args: unknown[]) {
        return super.addExp(exp * terra.g_options.get("exp_mult"), ...args);
    }
}
