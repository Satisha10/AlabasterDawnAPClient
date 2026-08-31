import {Injectable} from "@project-selene/api";
import {PlayerInventory, PlayerModel, PlayerCombat, PartyModel} from "@project-selene/api/terra";
import {addMessage, addDebug} from "../doc";
import {loc_game_name_id} from "../location_gamename_id";
import {client, item_flags} from "../client";

export class ItemTracker extends Injectable(PlayerInventory) {
    addItem(key: string, quantity = 1, skipHUD = false, skipEvent = false, ...args: unknown[]) {
        addDebug(`Received item ${key} times ${quantity}, skipHUD ${skipHUD}, skipEvent ${skipEvent}`);
        return super.addItem(key, quantity, skipHUD, skipEvent, ...args);
    }
}

export class ElementTracker extends Injectable(PlayerModel) {
    setCore(type: number, state: boolean, ...args: unknown[]) {
        if (item_flags.is_init) {
            return super.setCore(type, state, ...args);
        }
        addDebug(`setCore ${type}, ${state}`);
        let elemMap = new Map([[14, "Physis"], [15, "Aether"], [16, "Cryo"], [17, "Ignis"]]);
        let elemName = elemMap.get(type);
        if (elemName && state && item_flags.checkedElem(type)){
            if (loc_game_name_id.has(elemName)) {
                client.check(<number>loc_game_name_id.get(elemName));
            }
            else {
                addMessage(`Unknown element checked ${elemName}`)
            }
            return;
        }
        return super.setCore(type, state, ...args);
    }
}

export class WeaponTracker extends Injectable(PlayerCombat) {
    setWeaponUnlock(key: string, unlock: boolean, ...args: unknown[]) {
        if (item_flags.is_init) {
            return super.setWeaponUnlock(key, unlock, ...args);
        }
        addDebug(`Get weapon ${key} unlock ${unlock}`);
        if (unlock && item_flags.checkedWeapon(key)) {
            if (loc_game_name_id.has(key)) {
                client.check(<number>loc_game_name_id.get(key));
            }
            else {
                addMessage(`Unknown weapon checked ${key}`)
            }
            return;
        }
        return super.setWeaponUnlock(key, unlock, ...args);
    }
    increaseSyncLevel(...args: unknown[]) {
        addDebug("Increased sync level");
        return super.increaseSyncLevel(...args);
    }
}

/*
export class PartyTracker extends Injectable(PartyModel) {
    addPartyMember(member: string, ...args: unknown[]) {
        addDebug(`New member ${member}`);  // TODO typing
        if (loc_game_name_id.has(member)) {
            client.check(<number>loc_game_name_id.get(member))
        }
        return super.addPartyMember(member, ...args);
    }
}
*/
