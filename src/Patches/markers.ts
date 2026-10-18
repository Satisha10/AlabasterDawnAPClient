import {Injectable} from "@project-selene/api";
import {
    FloorInteractable,
    MapInfoLayer,
    MapInteractLayer,
    Vec2
} from "@project-selene/api/terra";
import {addDebug} from "../doc";

// terra.g_menu.gui.getMenu(SUB_MENU.MAP).views.get(MAP_MENU_VIEW.MAP).getMap().getInteractLayer().addMarkerInteract
// For creating markers outside the class
export class Test extends Injectable(MapInteractLayer) {
    enter() {
        this.active = true;
        // TODO remove test markers

        let interact = FloorInteractable.get("chest-prog-1", { type: "chest-prog-useful" })
        interact.pos = Vec2.fromArray([-20, 300])
        let out = this.addInteract(interact, this.floor.visited, -17, -33, 26, true)

        interact = FloorInteractable.get("chest-prog-2", { type: "chest-prog" })
        interact.pos = Vec2.fromArray([-10, 300])
        this.addInteract(interact, this.floor.visited, -17, -33, 26, true)

        interact = FloorInteractable.get("chest-prog-3", { type: "chest-useful" })
        interact.pos = Vec2.fromArray([0, 300])
        this.addInteract(interact, this.floor.visited, -17, -33, 26, true)

        interact = FloorInteractable.get("chest-prog-4", { type: "chest-filler" })
        interact.pos = Vec2.fromArray([10, 300])
        this.addInteract(interact, this.floor.visited, -17, -33, 26, true)

        interact = FloorInteractable.get("chest-prog-5", { type: "chest-trap" })
        interact.pos = Vec2.fromArray([20, 300])
        this.addInteract(interact, this.floor.visited, -17, -33, 26, true)

        interact = FloorInteractable.get("chest-prog-6", { type: "chest-unknown" })
        interact.pos = Vec2.fromArray([30, 300])
        this.addInteract(interact, this.floor.visited, -17, -33, 26, true)

        this.updateInteractPositions(true);
    }
    addMarkerInteract(pos: any, type: any, ...args: unknown[]) {
        //addDebug(`${pos}, ${type}`);
        return super.addMarkerInteract(pos, type, ...args);
    }
    addInteract(interact: any, visited: any, minX: any, minY: any, gridWidth: any, ignoreVisited = false, ...args: unknown[]) {
        //addDebug(`${interact}, ${minX}, ${minY}, ${gridWidth}, ${ignoreVisited}`);
        return super.addInteract(interact, visited, minX, minY, gridWidth, ignoreVisited, ...args);
    }
}

export class TestText extends Injectable(MapInfoLayer) {
    setToolTipContent(interact: any, ...args: unknown[]) {
        super.setToolTipContent(interact, ...args)
        addDebug("Tooltip called")
        // TODO Change the text for the markers here, and filter to not change every icon
        if (this.interactTooltip.text) {
            let temp = interact.label.set("Test for dynamic text !");
            this.interactTooltip.setText(temp)
            addDebug(`${this.interactTooltip.text.textBlock.getTextLength()}`)
        }
    }
}

