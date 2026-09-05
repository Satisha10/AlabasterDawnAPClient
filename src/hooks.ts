import {Mod} from "@project-selene/api";
import {ChestPatch, SkipItemDialogs} from "./Patches/chest";
import {DishTracker} from "./Patches/dish";
import {ItemTracker, ElementTracker, WeaponTracker} from "./Patches/items";
import {PlotCheck, PlotProgress, PlotCompleted} from "./Patches/plots";
import {MapTags} from "./Patches/tags";
import {SaveAPData, NewGameButton, LoadTracker, RemoveAnalytics, ReturnMenu, OnDeath} from "./Patches/save";

export class Hooks {
    static init(mod: Mod) {
        mod.inject(ChestPatch);
        mod.inject(SkipItemDialogs);
        mod.inject(DishTracker);
        mod.inject(ItemTracker);
        mod.inject(ElementTracker);
        mod.inject(WeaponTracker);
        mod.inject(PlotCheck);
        mod.inject(PlotProgress);
        mod.inject(MapTags);
        mod.inject(SaveAPData);
        mod.inject(NewGameButton);
        mod.inject(LoadTracker);
        mod.inject(RemoveAnalytics);
        mod.inject(ReturnMenu);
        mod.inject(OnDeath);
        mod.inject(PlotCompleted);
    }
}
