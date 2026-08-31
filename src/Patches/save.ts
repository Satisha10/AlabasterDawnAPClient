import {Injectable} from "@project-selene/api"
import {SaveFile, Game, SceneManager, TitleMenu, BUT_DATA_KEYS, Dialogs, Analytics} from "@project-selene/api/terra"
import {client, client_data} from "../client";
import {addMessage} from "../doc";
import {initializeFile} from "../file_init";
import {connect_menu} from "../connect_menu";


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
        if (is_new_game != 0) {
            if (is_new_game == 3) {
                initializeFile();
                is_new_game = -1  // Set it back to 0, since there is a +1 just below
            }
            is_new_game += 1;
        }
        // TODO check seed and slot_name
        client_data.is_loaded = true;
        client_data.giveStashedItems();
        connect_menu.hide();
        return result;
    }
}

// If non-zero, count the number of times the loaded occurs, and only call initializeFile at a specific time
let is_new_game = 0;

export class NewGameButton extends Injectable(TitleMenu) {
    onLayoutClick(button: any, ...args: unknown[]) {
        if (!button)
            return;
        const key = button.getData(BUT_DATA_KEYS.KEY);
        if (key == "START" && !client.authenticated) {
            // @ts-ignore
            Dialogs.showInfo("You cannot start a new game without being connected to a multiworld !")
        }
        else {
            is_new_game = 1;
            return super.onLayoutClick(button, ...args);
        }
    }
}

export class RemoveAnalytics extends Injectable(Analytics) {
    isTrackingAllowed(...args: unknown[]) {
        return false;
    }
}
