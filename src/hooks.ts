import {Mod} from "@project-selene/api";
import {ChestTracker, ChestTest} from "./Patches/chest";
import {DishTracker} from "./Patches/dish";
import {ItemTracker, ElementTracker, WeaponTracker, PartyTracker} from "./Patches/items";

export class Hooks {
    static init(mod: Mod) {
        mod.inject(ChestTracker);
        mod.inject(ChestTest);
        mod.inject(DishTracker);
        mod.inject(ItemTracker);
        mod.inject(ElementTracker);
        mod.inject(WeaponTracker);
        mod.inject(PartyTracker);
    }
}
