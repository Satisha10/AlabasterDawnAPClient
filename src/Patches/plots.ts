import {Injectable} from "@project-selene/api";
import {PlotManager} from "@project-selene/api/terra";
import {addDebug} from "../doc";

export class InterceptConditions extends Injectable(PlotManager) {
    checkPlotStateC(plotKey: string, stateKey: string, ...args: unknown[]) {
        if (plotKey == "ch1b" && stateKey == "village-built") {
            return super.checkPlotStateC("ap_lyhamn", "cl1");
        }
        // TODO make sure these apply to the map only, otherwise it messes up with the quest progression
        // Or patch the quest.
        // TODO 2: North bridges are built from CL1, change it ?
        else if (plotKey == "quickwood" && (stateKey == "bridgeBuilt" || stateKey == "end")) {
            return super.checkPlotStateC("ap_bridges", "received");
        }
        return super.checkPlotStateC(plotKey, stateKey, ...args);
    }
}
