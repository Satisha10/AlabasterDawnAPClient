import {Injectable} from "@project-selene/api";
import {OptionsTabList} from "@project-selene/api/terra";

export class AddOptionTab extends Injectable(OptionsTabList) {
    constructor() {
        super();
        this.addTab("ARCHIPELAGO", {
            label: "Archipelago",
            icon: "option-cat-ARCHIPELAGO"
        });
    }
}
