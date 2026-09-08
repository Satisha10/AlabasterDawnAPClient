import {Injectable, terra} from "@project-selene/api";
import {PlotManager, Plot, QuestCompleteScreen} from "@project-selene/api/terra";
import {loc_game_name_id} from "../location_gamename_id";
import {client} from "../client";
import {addDebug} from "../doc";

// Flags that track when the methods are recalled in Plot, to prevent infinitely calling them
let plot_progress_called = false;
let plot_set_flag_called = false;
let plot_is_flag_called = false;


export class PlotCheck extends Injectable(PlotManager) {
    checkPlotStateC(plotKey: string, stateKey: string, ...args: unknown[]) {
        let out = modifyPlotKeys(plotKey, stateKey)
        let newPlot = out[0]
        let newState = out[1]
        return super.checkPlotStateC(newPlot, newState, ...args);
    }
}


export class PlotProgress extends Injectable(Plot) {
    progressToState(stateKey: string, ...args: unknown[]) {
        if (plot_progress_called) {
            plot_progress_called = false;
            return super.progressToState(stateKey, ...args)
        }
        let plotKey: string = this.key
        let out = modifyPlotKeys(plotKey, stateKey)
        plotKey = out[0]
        let newState = out[1]
        plot_progress_called = true;
        return terra.g_plot.plots[plotKey].progressToState(newState, ...args);
    }

    setFlag(flag: string, ...args: unknown[]) {
        if (plot_set_flag_called) {
            plot_set_flag_called = false;
            return super.setFlag(flag, ...args)
        }
        let plotKey: string = this.key
        let out = modifyPlotFlagKeys(plotKey, flag)
        plotKey = out[0]
        let newFlag = out[1]
        plot_set_flag_called = true;
        return terra.g_plot.plots[plotKey].setFlag(newFlag, ...args);
    }

    isFlag(flag: string, value: string, ...args: unknown[]) {
        if (plot_is_flag_called) {
            plot_is_flag_called = false;
            return super.isFlag(flag, value, ...args)
        }
        let plotKey: string = this.key
        let out = modifyPlotFlagKeys(plotKey, flag)
        plotKey = out[0]
        let newFlag = out[1]
        plot_is_flag_called = true;
        return terra.g_plot.plots[plotKey].isFlag(newFlag, value, ...args);
    }
}

// Check if a different pair of plot/state keys must be used
function modifyPlotKeys(plotKey: string, stateKey: string): [string, string] {
    // Second part of Aether dungeon
    if (plotKey == "southDng" && [
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
    ].includes(stateKey)) {
        return ["southDngB", stateKey];
    }
    return [plotKey, stateKey]
}


// Check if a different pair of plot/flag keys must be used
function modifyPlotFlagKeys(plotKey: string, flag: string): [string, string] {
    // Second part of Aether dungeon
    if (plotKey == "southDng" && [
        "shortcut1",
        "chestBarrier1",
        "chestBarrier2",
        "chestBarrier3",
        "bonusBattle1"
    ].includes(flag)) {
        return ["southDngB", flag];
    }
    return [plotKey, flag]
}


export class PlotCompleted extends Injectable(QuestCompleteScreen) {
    show(plot: string, ...args: unknown[]) {
        addDebug(`Finished quest ${plot}`)
        if (loc_game_name_id.has(plot)) {
            client.check(<number>loc_game_name_id.get(plot));
        }
        return super.show(plot, ...args);
    }
}
