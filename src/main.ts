import {Mod} from '@project-selene/api';
import {Hooks} from './hooks';
import {client_data, init_client} from "./client";
import {addDebug} from "./doc";
import {connect_menu} from "./connect_menu";

// Auto connect to localhost:38281/Player1, and display additional messages. Set this to false in release builds
export let is_debug = true;

export default function main(mod: Mod) {
    addDebug("Mod injected");
    init_client();
    Hooks.init(mod);
    connect_menu.show();
    if (is_debug) {
        client_data.connect("ws://localhost:38281", "Player1");
    }
}
