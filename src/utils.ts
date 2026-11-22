import {addMessage} from "./doc";

export function fetchSave(value: any, defaultValue: any, failMessage: null | string = null) {
    // Return the value unless it is missing (null or undefined), in which case the defaultValue is used.
    if (value === undefined || value === null)
        if (failMessage) {
            addMessage(`Failed to fetch the saved data for ${failMessage}`)
            return defaultValue;
        }
    return value;
}

export function fetchSlot(value: any, defaultValue: any, failMessage: null | string = null) {
    // Return the value unless it is missing (null or undefined), in which case the defaultValue is used.
    if (value === undefined || value === null)
        if (failMessage) {
            addMessage(`Missing slot data for key ${failMessage}`)
            return defaultValue;
        }
    return value;
}