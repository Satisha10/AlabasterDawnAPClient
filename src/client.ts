import {Client, Item, ItemsManager} from "archipelago.js";
import {addDebug, addMessage} from "./doc";
import {giveGameItem} from "./item_handler";

// Create a new instance of the Client class.
export const client = new Client();
export const items_manager = new ItemsManager(client);


// TODO refactor: extend Client, and add a connect/disconnect method
export function init_client(url: string | null = null, name: string | null = null, password : string | null = null) {
    // TODO Connect when save loaded
    // TODO Datapackage
    // TODO last item index: save and load it on the save file
    // TODO Slot data

    let connUrl = url == null ? client_data.url : url;
    let connName = name == null ? client_data.slot_name : name;
    let connPassword = password == null ? client_data.password : password;

    client.login(connUrl, connName, "Alabaster Dawn", {password: connPassword})
        .then(() => {
            addMessage(`Connected to Archipelago as ${connName}`);
            client_data.url = connUrl;
            client_data.slot_name = connName;
            client_data.password  = connPassword;
        })
        .catch(() => addMessage(`Connection failed (url: ${connUrl}, Slot name: ${connName})`));

    items_manager.on("itemsReceived", () => {
        client_data.giveStashedItems();
    });
}


class ClientData {
    url: string;
    slot_name: string;
    password: string;

    alias: string;
    last_item_index: number;  // Last item index received by the player. The index is reset to last_saved_index on death
    last_saved_index: number;  // Last item index that got saved (always equal or lower than last_item_index)
    is_loaded: boolean;

    checked_locations: Set<number>;

    constructor() {
        this.url = "ws://localhost:38281";  // TODO
        this.slot_name = "Player1";
        this.password = "";

        this.alias = "Player1";

        this.last_item_index = 0;
        this.last_saved_index = 0;
        this.is_loaded = false;
        this.checked_locations = new Set();  // TODO
    }

    // TODO Regroup the two functions
    handleItems(items: Item[]) {
        addDebug("Give items");
        addDebug(`In ${this.last_item_index}`)
        if (!client.authenticated || !this.is_loaded) {
            return;
        }
        let item: Item;
        items = items.slice(this.last_item_index);

        for (item of items) {
            giveGameItem(item);
            this.last_item_index += 1;
        }
        addDebug(`Out: ${this.last_item_index}`)
    }

    giveStashedItems() {
        this.handleItems(items_manager.received);
    }

    checkLocation(id: number) {
        this.checked_locations.add(id);
        if (!client.authenticated || !this.is_loaded) {
            return;
        }
        for (const location of this.checked_locations) {
            if (client.room.missingLocations.includes(location)) {
                client.check(location);
            }
        }
    }

    // Export data as an Object, to store it in the save file
    exportState(): Object {
        this.last_saved_index = this.last_item_index;
        return {
            url: this.url,
            slot_name: this.slot_name,
            password: this.password,
            last_item_index: this.last_item_index,
            checked_locations: this.checked_locations,
        }
    }

    // TODO
    // Import the client state from the save file data
    importState(data: any) {
        this.url = data.url;
        this.slot_name = data.slot_name;
        this.password = data.password;
        this.alias = data.alias;
        this.last_item_index = data.last_item_index;
        if (!client.authenticated) {
            init_client();
        }
    }

    reset_state() {
        // Reset some client variables, called when going to the menu
        this.last_item_index = 0;
        this.last_saved_index = 0;
        this.is_loaded = false;
        this.checked_locations.clear();
    }

    on_death() {
        this.last_item_index = this.last_saved_index;
    }
}

export const client_data = new ClientData();

// Class to track if a location check is due to receiving an AP item
class ItemFlags {
    elemID: number;
    weaponKey: string;
    is_init: boolean;  // Used when initializing, to skip the item/location patches
    constructor() {
        this.elemID = 0;
        this.weaponKey = "";
        this.is_init = false;
    }
    gaveElem(value: number) {
        // Received an element (with value its ID) through an AP item
        this.elemID = value;
    }
    checkedElem(value: number): boolean {
        // Called in the ElementTracker hook when detecting a new element,
        // return false if the change is caused by receiving an item.
        if (value == this.elemID) {
            this.elemID = 0;
            return false;
        }
        return true;
    }
    gaveWeapon(value: string) {
        // Received a weapon (with value its key) through an AP item
        this.weaponKey = value;
    }
    checkedWeapon(value: string): boolean {
        // Called in the WeaponTracker hook when detecting a new weapon,
        // return false if the change is caused by receiving an item.
        if (value == this.weaponKey) {
            this.weaponKey = "";
            return true;
        }
        return false;
    }
}

export const item_flags = new ItemFlags()
