type EmptyableValue =
    | null
    | undefined
    | boolean
    | number
    | string
    | unknown[]
    | Map<unknown, unknown>
    | Set<unknown>
    | object;

export function isEmpty(value: EmptyableValue): boolean {
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
        return Object.keys(value).length === 0;
    }
    return false;
}
