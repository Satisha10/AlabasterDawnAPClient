const fs: typeof import('fs') = (0, eval)('require("fs")');

import {addMessage, addDebug} from "./doc"
import {client} from "./client"
import {GamePackage} from "archipelago.js"

export async function savePackage(game: string, data: GamePackage) {
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

function loadPackage(game: string): GamePackage {
    try {
        const data = fs.readFileSync(`./ap_datapackage/${game}.json`, {encoding: "utf8"});
        return JSON.parse(data);
    }
    catch (err: any) {
        addMessage(`Failed to load data package for ${game}`);
        addMessage(err.message());
        throw err;
    }
}

// TODO call this somewhere with all games required and use client.package.importPackage
export async function loadPackages(games: string[]): Promise<Record<string, GamePackage>> {
    let datapackage: Record<string, GamePackage> = {};
    for (let game of games) {
        datapackage[game] = loadPackage(game);
        addDebug(`Loaded package for ${game}`)
    }
    return datapackage;
}