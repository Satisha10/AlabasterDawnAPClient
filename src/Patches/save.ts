import {Injectable} from "@project-selene/api"
import {SaveFile, Game, TitleMenu, BUT_DATA_KEYS, Dialogs, Analytics, SceneManager, GAME_STATE} from "@project-selene/api/terra"
import {client, client_data} from "../client";
import {addMessage, addDebug} from "../doc";
import {initializeFile} from "../file_init";
import {connect_menu} from "../connect_menu";


export class SaveAPData extends Injectable(SaveFile) {
    saveData(...args: unknown[]) {
        this.data["ap_data"] = client_data.exportState();
        addDebug("Saved data")
        return super.saveData(...args);
    }
    // TODO maybe use continue button hook,
    //  load save using g_storage.getLastSave + g_storage.load(id)
    //  and try to connect before loading the game (else abort with a message)
    //  Use ModalButtonDialog to make the messages with more config than Dialogs
    loadData(...args: unknown[]) {
        let data: any = super.loadData(...args);
        if (data.hasOwnProperty("ap_data")) {
            client_data.importState(data["ap_data"]);
            addDebug("Loaded data");
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
        if (this.state == GAME_STATE.RUNNING) {
            client_data.is_loaded = true;
            client_data.giveStashedItems();
            addDebug("Loading completed");
        }
        else {
            client_data.is_loaded = false;
        }

        connect_menu.hide();  // Hide the connect menu immediately, don't wait until the game is fully loaded
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

export class ReturnMenu extends Injectable(SceneManager) {
    goToTitle(...args: unknown[]) {
        connect_menu.show();
        client_data.reset_state();
        // TODO disconnect from multiworld
        return super.goToTitle(...args);
    }
}

export class OnDeath extends Injectable(SceneManager) {
    loadCheckpoint(onDeath: boolean, ...args: unknown[]) {
        if (onDeath) {
            addDebug("Player died")
            client_data.on_death();
        }
        return super.loadCheckpoint(onDeath, ...args);
    }
}
