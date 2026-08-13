import {Injectable, terra} from "@project-selene/api";
import {ChestDatabase, Chest} from "@project-selene/api/terra";
import {addMessage} from "../doc";
import {client} from "../client";
import {loc_game_name_id} from "../location_gamename_id"

export class ChestTracker extends Injectable(ChestDatabase) {
    open(key: string, ...args: unknown[]) {
        //addMessage(`Opened chest ${key}`);

        return super.open(key, ...args);
    }

    runItemGetDialog(...args: unknown[]) {
        // addMessage("Skipped ChestDatabase.runItemGetDialog");
        return super.runItemGetDialog(...args);
    }
}


export class ChestTest extends Injectable(Chest) {
    open(...args: unknown[]) {
        addMessage(`Opened Chest ${this.key}`);
        if (loc_game_name_id.has(this.key)) {
            client.check(<number>loc_game_name_id.get(this.key))
        }

        //terra.g_player.inventory.addItem("ess-evil-garrot")

        return super.open(...args);
    }

    addItemContent(...args: unknown[]) {  // Don't give the items
        //addMessage(`Skip giving ${this.items[0].key} (Chest.addItemContent)`);
        return super.addItemContent(...args);
    }
}
