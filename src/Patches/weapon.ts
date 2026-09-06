import {Injectable} from "@project-selene/api";
import {PlayerWeapon, PlayerCombat} from "@project-selene/api/terra";

export class MultiEquip extends Injectable(PlayerWeapon) {
    canMultiEquip(...args: unknown[]) {
        return true;
    }
}

// TODO find how to not auto equip to other loadouts
export class FixLoadouts extends Injectable(PlayerCombat) {
    equipWeapon(eleIndex: number, weaponKey: string, skipLoadout: boolean, ...args: unknown[]) {
        return super.equipWeapon(eleIndex, weaponKey, true, ...args);
    }
}
