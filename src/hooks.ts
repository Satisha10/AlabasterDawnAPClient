import {Mod} from "@project-selene/api";
import {ChestPatch, SkipItemDialogs} from "./Patches/chest";
import {DishTracker} from "./Patches/dish";
import {ElementTracker, WeaponTracker} from "./Patches/items";
import {PlotCheck, PlotProgress, PlotCompleted} from "./Patches/plots";
import {MapTags} from "./Patches/tags";
import {
    SaveAPData,
    MenuButtons,
    LoadTracker,
    RemoveAnalytics,
    ReturnMenu,
    OnDeath,
    LoadFile,
    OptionsExit
} from "./Patches/save";
import {MultiEquip} from "./Patches/weapon";
import {IncreaseDrops, IncreaseWeaponExp, IncreaseCuisineExp, IncreaseCoreExp} from "./Patches/drops";
import {AddOptionTab} from "./Patches/options";
import {OptionsMenu} from "@project-selene/api/terra";

export class Hooks {
    static init(mod: Mod) {
        mod.inject(ChestPatch);
        mod.inject(SkipItemDialogs);
        mod.inject(DishTracker);
        mod.inject(ElementTracker);
        mod.inject(WeaponTracker);
        mod.inject(PlotCheck);
        mod.inject(PlotProgress);
        mod.inject(MapTags);
        mod.inject(SaveAPData);
        mod.inject(MenuButtons);
        mod.inject(LoadTracker);
        mod.inject(RemoveAnalytics);
        mod.inject(ReturnMenu);
        mod.inject(OnDeath);
        mod.inject(LoadFile);
        mod.inject(PlotCompleted);
        mod.inject(MultiEquip);
        mod.inject(IncreaseDrops);
        mod.inject(IncreaseCuisineExp);
        mod.inject(IncreaseWeaponExp);
        mod.inject(IncreaseCoreExp);
        mod.inject(AddOptionTab);
        mod.inject(OptionsExit);
    }
}
