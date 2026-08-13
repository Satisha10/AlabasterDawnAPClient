import {Mod} from '@project-selene/api';
import {Hooks} from './hooks';
import {init_client} from "./client";

export default function main(mod: Mod) {

    init_client()
    Hooks.init(mod);
}
