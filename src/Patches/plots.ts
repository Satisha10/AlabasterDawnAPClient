import {Injectable, terra} from "@project-selene/api";
import {PlotManager, Plot} from "@project-selene/api/terra";

export class PlotCheck extends Injectable(PlotManager) {
    checkPlotStateC(plotKey: string, stateKey: string, ...args: unknown[]) {
        let out = modify_plot_keys(plotKey, stateKey)
        let newPlot = out[0]
        let newState = out[1]
        return super.checkPlotStateC(newPlot, newState, ...args);
    }
}

let plot_flag = false;  // TODO rename or better structure

export class PlotProgress extends Injectable(Plot) {
    progressToState(stateKey: string, ...args: unknown[]) {
        if (plot_flag) {
            plot_flag = false;
            return super.progressToState(stateKey, ...args)
        }
        let plotKey: string = this.key
        let out = modify_plot_keys(plotKey, stateKey)
        plotKey = out[0]
        let newState = out[1]
        plot_flag = true;
        return terra.g_plot.plots[plotKey].progressToState(newState, ...args);
    }
}

function modify_plot_keys(plotKey: string, stateKey: string): [string, string] {
    // Check if a different pair of plot/state keys must be used
    /*
    if (plotKey == "ch1b" && stateKey == "village-built") {
        return ["ap_lyhamn", "cl1"];
    }
    // TODO see if it messes up with quest completion, otherwise add an extra step in the quest with a patch
    // TODO Also remove the !CL1 tags on quickwood (and probably other quests)
    if (plotKey == "quickwood" && (stateKey == "bridgeBuilt" || stateKey == "end")) {
        return ["ap_bridges", "received"];
    }*/
    // Second part of Aether dungeon
    if (plotKey == "southDng" && stateKey in [
        "outerFishBattle",
        "part2Intro",
        "f2room2check1",
        "f2room2check2",
        "f2room2check3",
        "f2room3check1",
        "f2room4battle1",
        "f2room4check1",
        "f2room4check2",
        "f2room4check3",
        "f2room4bBattle",
        "f2room3check2",
        "f2room3check3",
        "f2room3GotKey",
        "f2room2bLock",
        "f2room2bBattle1",
        "f2room2shortcut",
        "f2room2check4",
        "f2room2check5",
        "f2room2check6",
        "learnedOrbHack",
        "f2room5battle1",
        "f2room6check1",
        "f2room6check2",
        "f2room6check3",
        "f2room6check4",
        "f2room6check5",
        "f2room7check1",
        "f2room7check2",
        "finalElevator"
    ]) {
        return ["southDngB", stateKey];
    }
    return [plotKey, stateKey]
}
