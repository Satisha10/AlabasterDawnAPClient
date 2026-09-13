import {Injectable} from "@project-selene/api";
import {PlayerWeapon} from "@project-selene/api/terra";

export class MultiEquip extends Injectable(PlayerWeapon) {
    canMultiEquip(...args: unknown[]) {
        return true;
    }
}
