import {Injectable} from "@project-selene/api"
import {SaveFile} from "@project-selene/api/terra"


export class SaveAPData extends Injectable(SaveFile) {
    saveData(...args: unknown[]) {
        this.data["ap_data"] = {"test": 0};  // TODO use exported client data
        return super.saveData(...args);
    }
    loadData(...args: unknown[]) {
        let data: Object = super.loadData(...args);
        // TODO import client data
        return data;
    }
}
