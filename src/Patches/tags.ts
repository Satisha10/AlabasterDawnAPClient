import {GameMap} from "@project-selene/api/terra";
import {Injectable, terra} from "@project-selene/api";
import {addDebug, addMessage} from "../doc";

export class MapTags extends Injectable(GameMap) {
    updateTags() {
        getActiveTagsPatched(this.activeTags, this.tags)
    }
}


// TODO Patch the static method directly
function getActiveTagsPatched(dest: string[], tags: any) {  // tags: map[string, GameMapTag]
    dest.length = 0;
    for (let tag in tags) {
        const tagDef = tags[tag];
        let result = modifyTag(tag);
        if (result[0]) {  // Use modified behavior
            if (result[1]) {
                dest.push(tag);
            } else {
                dest.push("!" + tag);
            }
        } else {  // Default behavior
            if (tagDef.cond.evaluate()) {
                dest.push(tag);
            } else {
                dest.push("!" + tag);
            }
        }
    }
}

// First value: if the value is altered (i.e. result set by the function). Second: the result of the new condition (only used if first is true).
function modifyTag(tagKey: string): [boolean, boolean] {
    if (tagKey == "CL1") {
        let map: string = terra.g_game.map.active?.path;
        if (map == undefined) {
            return [false, false]
        }
        if (map.startsWith("start")) {
            return [true, terra.g_plot.checkPlotStateC("ap_lyhamn", "cl1")]
        }
        return [false, false]
    }
    // Valley bridges
    if (["BR1", "BRG"].includes(tagKey)) {
        return [true, terra.g_plot.checkPlotStateC("ap_bridge", "received")]
    }
    // Quickwood quest
    if (tagKey == "BRD") {
        return [true, terra.g_plot.checkPlotStateC("quickwood", "end")]
    }
    // Flower boss
    if (tagKey == "PHB") {
        return [true, terra.g_plot.checkPlotStateC("flowerBoss1", "end")]
    }
    // Rice fields
    if (["RHB", "Rff", "Rf0"].includes(tagKey)) {
        return [true, terra.g_plot.checkPlotStateC("ricefarm", "end")]
    }
    return [false, false]
}
