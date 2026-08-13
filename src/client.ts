import {Client, Item, ItemsManager} from "archipelago.js";
import {addMessage} from "./doc";
import {handle_item} from "./Patches/items";

// Create a new instance of the Client class.
export const client = new Client();
export const items_manager = new ItemsManager(client);

export function init_client() {
    // TODO Connect when save loaded
    // TODO Datapackage
    // TODO last item index
    // TODO connection page
    client.login("localhost:38281", "Player1", "Alabaster Dawn")
        .then(() => console.log("Connected to the Archipelago server!"))
        .catch(console.error);

    items_manager.on("itemsReceived", (items) => {
        let item: Item;
        for (item of items) {
            handle_item(item.name);
        }
    });
}
