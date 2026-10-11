const fs: typeof import('fs') = (0, eval)('require("fs")');

import {addMessage, addDebug} from "./doc"
import {client} from "./client"
import {DataPackage, GamePackage} from "archipelago.js"

async function savePackage(game: string, data: GamePackage) {
    fs.mkdirSync("./ap_datapackage", { recursive: true })
    try {
        fs.writeFileSync(`./ap_datapackage/${game}.json`, JSON.stringify(data), "utf8");
        addDebug(`Saved package for ${game}`)
    }
    catch (err: any) {
        addMessage(`Failed to save data package for ${game}`);
        addMessage(err.message());
    }
}

export async function savePackages(data: DataPackage) {
    return Promise.all(
        Object.entries(data.games).map(([game, gpkg]) => savePackage(game, gpkg))
    )
}

function loadPackage(game: string): GamePackage | undefined {
    if (!fs.existsSync(`./ap_datapackage/${game}.json`)) {
        addDebug(`Missing datapackage for ${game}`)
        return;
    }
    try {
        const data = fs.readFileSync(`./ap_datapackage/${game}.json`, {encoding: "utf8"});
        return JSON.parse(data);
    }
    catch (err: any) {
        addMessage(`Failed to load data package for ${game}`);
        addMessage(err.message());
        throw err;  // TODO don't crash and return a flag to be handled somewhere
    }
}

// TODO call this somewhere with all games required and use client.package.importPackage
export async function loadPackages(checksums: Record<string, string>): Promise<DataPackage> {
    let dataPackage: Record<string, GamePackage> = {};
    for (let [game, _] of Object.entries(checksums)) {
        let gamePackage = loadPackage(game);
        if (gamePackage) {
            dataPackage[game] = gamePackage;
            addDebug(`Loaded package for ${game}, checksum ${dataPackage[game].checksum}`)
        }
    }
    addDebug("Loading finished")
    return {games: dataPackage};
}
