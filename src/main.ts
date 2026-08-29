import {Mod} from '@project-selene/api';
import {Hooks} from './hooks';
import {init_client} from "./client";
import {addDebug} from "./doc";
import {connect_menu} from "./connect_menu";

export default function main(mod: Mod) {
    addDebug("Mod injected");
    init_client();
    Hooks.init(mod);
    connect_menu.show();
}
