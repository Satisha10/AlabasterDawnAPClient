import {is_debug} from "./main";

export let container: HTMLDivElement;
container = document.createElement('div');
container.id = 'ap-logs';
container.style.position = 'absolute';
container.style.top = '130px';
container.style.left = '30px';
container.style.zIndex = '9999';
container.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
container.style.userSelect = 'none';
container.style.fontSize = '15pt';
container.inert = true;
document.body.appendChild(container);


export function addDebug(message: string) {
    if (!is_debug) {
        return;
    }
    const msg = document.createElement('div');
    msg.textContent = message;
    msg.inert = true;
    container.appendChild(msg);

    setTimeout(() => {
        container.removeChild(msg);
    }, 20000);
}

export function addMessage(message: string) {
    const msg = document.createElement('div');
    msg.textContent = message;
    msg.inert = true;
    container.appendChild(msg);

    setTimeout(() => {
        container.removeChild(msg);
    }, 20000);
}