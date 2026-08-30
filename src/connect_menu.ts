import {addMessage} from "./doc";
import {init_client} from "./client";


class ConnectionMenu {
    container: HTMLDivElement;
    inputIP: HTMLInputElement;
    inputName: HTMLInputElement;
    inputPword: HTMLInputElement;
    confirmButton: HTMLButtonElement;

    constructor() {
        this.container = document.createElement("div");
        this.inputIP = document.createElement("input");
        this.inputName = document.createElement("input");
        this.inputPword = document.createElement("input");
        this.confirmButton = document.createElement("button");

        this.container.id = "connect_box";
        this.container.style.position = "absolute";
        this.container.style.top = "50px";
        this.container.style.right = "50px";
        this.container.style.zIndex = "9999";
        this.container.style.backgroundColor = "rgba(255, 255, 255, 1)";
        this.container.style.userSelect = "all";
        this.container.style.borderBlockColor = "rgba(0, 0, 0, 1)";

        this.inputIP.id = "input_ip";
        this.inputName.id = "input_name";
        this.inputPword.id = "input_pword";

        this.confirmButton.id = "button";
        this.confirmButton.textContent = "Connect";
        this.confirmButton.addEventListener("click", () => {init_client()});

        const textIP = document.createElement("div");
        const textName = document.createElement("div");
        const textPword = document.createElement("div");

        textIP.id = "text_ip";
        textIP.textContent = "Connection address\n(ex: 'archipelago.gg:12345', 'localhost:38281')";
        textIP.style.color = "#000000";
        textIP.style.fontSize = "20px";
        textName.id = "text_name";
        textName.textContent = "Slot Name (ex: 'Player1')";
        textName.style.color = "#000000";
        textName.style.fontSize = "20px";
        textPword.id = "text_password";
        textPword.textContent = "Password (optional)";
        textPword.style.color = "#000000";
        textPword.style.fontSize = "20px";

        this.container.appendChild(textIP);
        this.container.appendChild(this.inputIP);
        this.container.appendChild(textName);
        this.container.appendChild(this.inputName);
        this.container.appendChild(textPword);
        this.container.appendChild(this.inputPword);
        this.container.appendChild(this.confirmButton);
    }

    show() {
        document.body.appendChild(this.container);
    }

    hide() {
        document.body.removeChild(this.container);
    }

    getInput(): [string, string, string] {
        return [this.inputIP.value, this.inputName.value, this.inputPword.value];
    }

    printInput() {
        addMessage(`Address: ${this.inputIP.value}, Name: ${this.inputName.value}, Password: ${this.inputPword.value}`);
    }
}

export const connect_menu = new ConnectionMenu;
