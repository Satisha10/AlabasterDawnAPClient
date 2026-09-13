import {Injectable, terra} from "@project-selene/api"
import {
    Analytics,
    BUT_DATA_KEYS,
    Dialogs,
    Game,
    GAME_STATE,
    LoadMenu,
    SaveFile,
    SceneManager,
    TitleMenu
} from "@project-selene/api/terra"
import {client, client_data} from "../client";
import {addDebug, addMessage} from "../doc";
import {initializeFile} from "../file_init";
import {connect_menu} from "../connect_menu";


export class SaveAPData extends Injectable(SaveFile) {
    saveData(...args: unknown[]) {
        this.data["ap_data"] = client_data.exportState();
        addDebug("Saved data")
        addDebug(`${client_data.last_item_index}`)
        return super.saveData(...args);
    }
    // TODO maybe use continue button hook,
    //  load save using g_storage.getLastSave + g_storage.load(id)
    //  and try to connect before loading the game (else abort with a message)
    //  Use ModalButtonDialog to make the messages with more config than Dialogs
}


export class LoadTracker extends Injectable(Game) {
    onLoadingComplete(...args: unknown[]) {
        let result = super.onLoadingComplete(...args);
        if (terra.g_storage.system?.data?.hasOwnProperty("ap_data")) {
            client_data.importState(terra.g_storage.system.data.ap_data);
            addDebug(`Import state. ${client_data.last_item_index}`)
        }

        connect_menu.hide();  // Hide the connect menu immediately, don't wait until the game is fully loaded
        if (is_new_game != 0) {
            if (is_new_game != 3) {  // New game requires a few loads before behaving well with applying rando changes
                is_new_game += 1;
                return result;
            }
            initializeFile();
            is_new_game = 0
        }
        // TODO check seed and slot_name
        if (this.state == GAME_STATE.RUNNING) {
            client_data.is_loaded = true;
            client_data.giveStashedItems();
            client_data.sendStashedLocations()
            addDebug("Loading completed");
        }
        else {
            client_data.is_loaded = false;
        }

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
        if (key == "START") {
            if (!client.authenticated) {
                // @ts-ignore
                Dialogs.showInfo("You cannot start a new game without being connected to a multiworld !")
            }
            else {
                is_new_game = 1;
                return super.onLayoutClick(button, ...args);
            }
        }
        else if (key == "CONTINUE") {
            if (!client.authenticated) {
                // TODO read file
                // @ts-ignore
                Dialogs.showInfo("You (currently) cannot load a game without being connected to a multiworld !")  // TODO: connect, show info, callback cancel
            }
            else {
                if (terra.g_storage.system?.data?.hasOwnProperty("ap_data")) {
                    // Second load: the data is already loaded
                    client_data.importState(terra.g_storage.system.data.ap_data);
                }
                return super.onLayoutClick(button, ...args);
            }
        }
        else {
            return super.onLayoutClick(button, ...args);
        }
    }
}


export class LoadFile extends Injectable(LoadMenu) {
    onLayoutClick(...args: unknown[]) {
        if (!client.authenticated) {
            // @ts-ignore
            Dialogs.showInfo("You (currently) cannot load a game without being connected to a multiworld !")  // TODO: connect, show info, callback cancel
        }
        else {
            return super.onLayoutClick(...args);
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
