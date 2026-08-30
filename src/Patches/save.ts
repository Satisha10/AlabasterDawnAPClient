import {Injectable} from "@project-selene/api"
import {SaveFile, Game, SceneManager} from "@project-selene/api/terra"
import {client_data} from "../client";
import {addMessage} from "../doc";
import {initializeFile} from "../file_init";


export class SaveAPData extends Injectable(SaveFile) {
    saveData(...args: unknown[]) {
        this.data["ap_data"] = client_data.exportState();
        return super.saveData(...args);
    }
    loadData(...args: unknown[]) {
        let data: any = super.loadData(...args);
        if (data.hasOwnProperty("ap_data")) {
            client_data.importState(data["ap_data"]);
        }
        else {
            addMessage("Could not read ap_data from the save file.")
        }
        return data;
    }
}

export class LoadTracker extends Injectable(Game) {
    onLoadingComplete(...args: unknown[]) {
        let result = super.onLoadingComplete(...args);
        if (is_new_game) {
            initializeFile();
        }
        // TODO check seed and slot_name
        client_data.is_loaded = true;
        client_data.giveStashedItems();
        return result;
    }
}

let is_new_game = false;

export class NewGameHook extends Injectable(SceneManager) {
    startNewGame(...args: unknown[]) {
        is_new_game = true;
        return super.startNewGame(...args);
    }
}
