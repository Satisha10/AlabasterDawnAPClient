import {Injectable} from "@project-selene/api";
import {PlayerModel, g_items} from "@project-selene/api/terra";
import {addMessage} from "../doc";

// TODO typing
export class DishTracker extends Injectable(PlayerModel) {
    cook(dish: any, spice: any, ...args: unknown[]) {
        addMessage(`Cooked dish ${g_items.getItem(dish).key} spice ${g_items.getItem(spice)?.spice}`);
        return super.cook(dish, spice, ...args);
    }
}
