export let container: HTMLDivElement;
container = document.createElement('div');
container.id = 'ap-logs';
container.style.position = 'absolute';
container.style.top = '30px';
container.style.left = '30px';
container.style.zIndex = '9999';
container.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
container.style.userSelect = 'none';
container.style.fontSize = '14pt';
container.inert = true;
document.body.appendChild(container);

let debug = true;

export function addDebug(message: string) {
    if (!debug) {
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