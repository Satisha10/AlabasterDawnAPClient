import {Mod} from "@project-selene/api";
import {ChestPatch, SkipItemDialogs} from "./Patches/chest";
import {DishTracker} from "./Patches/dish";
import {ItemTracker, ElementTracker, WeaponTracker, PartyTracker} from "./Patches/items";
import {InterceptConditions} from "./Patches/plots";

export class Hooks {
    static init(mod: Mod) {
        mod.inject(ChestPatch);
        mod.inject(SkipItemDialogs);
        mod.inject(DishTracker);
        mod.inject(ItemTracker);
        mod.inject(ElementTracker);
        mod.inject(WeaponTracker);
        mod.inject(PartyTracker);
        mod.inject(InterceptConditions);
    }
}
