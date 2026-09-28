import {Injectable} from "@project-selene/api";
import {OptionsTabList, OptionCheckboxGui} from "@project-selene/api/terra";
import {death_link_manager} from "../client";
import {addDebug} from "../doc";

export class AddOptionTab extends Injectable(OptionsTabList) {
    constructor() {
        super();
        this.addTab("ARCHIPELAGO", {
            label: "Archipelago",
            icon: "option-cat-ARCHIPELAGO"
        });
    }
}

export class OptionCallback extends Injectable(OptionCheckboxGui) {
    submitChange(value: boolean, ...args: unknown[]) {
        if (this.key == "death_link") {
            if (value) {
                addDebug("Enabled DeathLink");
                death_link_manager.enableDeathLink();
            } else {
                addDebug("Disabled DeathLink");
                death_link_manager.disableDeathLink();
            }
        }
        return super.submitChange(value, args);
    }
}
