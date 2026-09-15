import {Client, Item, ItemsManager, NetworkPlayer} from "archipelago.js";
import {addDebug, addMessage} from "./doc";
import {giveGameItem} from "./item_handler";

// Create a new instance of the Client class.
export const client = new Client();
export const items_manager = new ItemsManager(client);

// TODO location check packets with printJSON: show message + remove from stashed locations
// TODO refactor: extend Client, and add a connect/disconnect method

// Add callbacks to the websocket client
export function init_client() {
    // TODO Connect when save loaded
    // TODO Datapackage
    // TODO Slot data
    // Handle received items
    items_manager.on("itemsReceived", () => {
        client_data.giveStashedItems();
    });

    client.socket.on("connected", (packet) => {
        client_data.slot_id = packet.slot;
        for (let player of packet.players) {
            client_data.player_map.set(player.slot, player);
        }
        client_data.alias = client_data.player_map.get(client_data.slot_id)?.alias
    });

    // Warn when lost connection.
    client.socket.on("disconnected", () => {
        addMessage("Lost connection to the AP server");
    });

    // Show sent items
    client.socket.on("printJSON", (packet) => {
        if (packet.type == "ItemSend" || packet.type == "ItemCheat") {
            // Only display if the item is not a local item, and comes from this game
            if (packet.receiving != client_data.slot_id && packet.item.player == client_data.slot_id) {
                let game = client.players.slots[packet.receiving].game;
                let item_name = client.package.lookupItemName(game, packet.item.item)
                let player_name = client_data.player_map.get(packet.receiving);
                addMessage(`Sent ${item_name} to ${player_name?.alias}`);
            }
        }
        // TODO handle other messages, and use helpers to facilitate getting game, item_name...
    });
}


class ClientData {
    url: string;
    slot_name: string;
    password: string;

    alias: string | undefined;
    slot_id: number;
    player_map: Map<number, NetworkPlayer>;

    last_item_index: number;  // Last item index received by the player. The index is reset to last_saved_index on death
    last_saved_index: number;  // Last item index that got saved (always equal or lower than last_item_index)
    is_loaded: boolean;
    is_save_valid: boolean;

    checked_locations: number[];

    constructor() {
        this.url = "ws://localhost:38281";  // TODO
        this.slot_name = "Player1";
        this.password = "";

        this.alias = "Player1";
        this.slot_id = 0;
        this.player_map = new Map()
        this.last_item_index = 0;
        this.last_saved_index = 0;
        // Flag, true when the game is loaded in a running state: items can be safely received.
        this.is_loaded = false;
        // Flag, true if the opened save file contains valid AP data
        this.is_save_valid = false;
        // Contains locations checked, but not yet validated by the server
        this.checked_locations = [];
    }

    // Connect to the multiworld with the given connection info (optional, otherwise use the ones from the instance.
    connect(url: string | null = null, name: string | null = null, password : string | null = null) {
        // TODO Connect when save loaded
        // TODO Datapackage
        // TODO last item index: save and load it on the save file
        // TODO Slot data

        let connUrl = url == null ? this.url : url;
        let connName = name == null ? this.slot_name : name;
        let connPassword = password == null ? this.password : password;

        client.login(connUrl, connName, "Alabaster Dawn", {password: connPassword})
            .then(() => {
                addMessage(`Connected to Archipelago as ${connName}`);
                this.url = connUrl;
                this.slot_name = connName;
                this.password = connPassword;
            })
            // TODO show error message
            .catch(() => addMessage(`Connection failed (url: ${connUrl}, Slot name: ${connName})`));
    }

        // TODO Regroup the two functions
    handleItems(items: Item[]) {
        addDebug("Give items");
        if (!client.authenticated || !this.is_loaded) {
            return;
        }
        let item: Item;
        items = items.slice(this.last_item_index);

        for (item of items) {
            giveGameItem(item);
            this.last_item_index += 1;
        }
    }

    giveStashedItems() {
        this.handleItems(items_manager.received);
    }

    checkLocation(id: number) {
        this.checked_locations.push(id);
        if (!client.authenticated || !this.is_loaded) {
            return;
        }
        this.sendStashedLocations();
    }

    sendStashedLocations() {
        let new_locs: number[] = []
        for (const location of this.checked_locations) {
            if (client.room.missingLocations.includes(location)) {
                client.check(location);
                if (!new_locs.includes(location)) {
                    new_locs.push(location);
                }
            }
        }
        this.checked_locations = new_locs;
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
        this.last_item_index = data.last_item_index;
        this.checked_locations = data.checked_locations;
    }

    reset_state() {
        // Reset some client variables, called when going to the menu
        this.last_item_index = 0;
        this.last_saved_index = 0;
        this.is_loaded = false;
        this.checked_locations = [];
        this.is_save_valid = false;
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
            return false;
        }
        return true;
    }
}

export const item_flags = new ItemFlags()
