export function isEmpty(value) {
    const type = typeof value;
    if (value === null || value === undefined) {
        return true
    }
    if (type === 'boolean' || type === 'number') {
        return true
    }
    if (type === 'string') {
        return value === "";
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (value instanceof Map || value instanceof Set) {
        return value.size === 0;
    }
    if (type === "object") {
        if (Object.keys(value).length === 0) {
            return true
        } else {
            return false
        }
    }
}
