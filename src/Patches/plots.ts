import {Injectable} from "@project-selene/api";
import {PlotManager} from "@project-selene/api/terra";
import {addDebug} from "../doc";

export class InterceptConditions extends Injectable(PlotManager) {
    checkPlotStateC(plotKey: string, stateKey: string, ...args: unknown[]) {
        addDebug(`Checked plot ${plotKey}, ${stateKey}`);
        if (plotKey == "ch1b" && stateKey == "village-built") {
            return super.checkPlotStateC("ap_lyhamn", "cl1");
        }
        else if (plotKey == "quickwood" && stateKey == "bridgeBuilt") {
            return super.checkPlotStateC("ap_bridges", "received");
        }
        return super.checkPlotStateC(plotKey, stateKey, ...args);
    }
}