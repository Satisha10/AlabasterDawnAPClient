import {Client, Item, ItemsManager} from "archipelago.js";
import {addMessage} from "./doc";
import {handle_item} from "./item_handler";

// Create a new instance of the Client class.
export const client = new Client();
export const items_manager = new ItemsManager(client);

export function init_client() {
    // TODO Connect when save loaded
    // TODO Datapackage
    // TODO last item index: save and load it on the save file
    // TODO connection page
    client.login(client_data.url, client_data.slot_name, "Alabaster Dawn")
        .then(() => addMessage(`Connected to Archipelago as Player1`))
        .catch(console.error);

    items_manager.on("itemsReceived", (items, starting_index) => {
        let item: Item;
        if (starting_index == 0) {
            items = items.slice(client_data.last_item_index);  // TODO verify
        }
        else if (starting_index != client_data.last_item_index + 1) {
            // TODO Ask for item sync
        }

        for (item of items) {
            handle_item(item);
            client_data.last_item_index += 1;
        }
    });
}

class ClientData {
    url: string;
    slot_name: string;
    password: string | null;

    alias: string;

    last_item_index: number;

    constructor() {
        this.url = "ws://localhost:38281";  // TODO
        this.slot_name = "Player1";
        this.password = null;

        this.alias = "Player1";

        this.last_item_index = 0;
    }

    // TODO use JSON instead ?
    // Export data as an Object, to store it in the save file
    export_state(): Object {
        return {
            url: this.url,
            slot_name: this.slot_name,
            password: this.password,
            alias: this.alias,
            last_item_index: this.last_item_index,
        }
    }

    // Import the client state from the save file data
    import_state(data: any) {
        this.url = data.url;
        this.slot_name = data.slot_name;
        this.password = data.password;
        this.alias = data.alias;
        this.last_item_index = data.last_item_index;
    }
}

export const client_data = new ClientData();

// Class to track if a location check is due to receiving an AP item
class ItemFlags {
    elemID: number;
    weaponKey: string;
    constructor() {
        this.elemID = 0;
        this.weaponKey = "";
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