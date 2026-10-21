import {addMessage} from "./doc";

export function fetchSave(value: any, defaultValue: any, failMessage: null | string = null) {
    if (value === undefined || value === null)
        if (failMessage) {
            addMessage(`Failed to fetch the saved data for ${failMessage}`)
            return defaultValue;
        }
    return value;
}