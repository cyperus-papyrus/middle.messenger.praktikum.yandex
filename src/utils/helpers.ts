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

type SIndexed = Record<string, unknown>;

export function set(object: SIndexed | unknown, path: string, value: unknown): SIndexed | unknown {
    if (typeof path !== 'string') {
        throw new Error('path must be string');
    }
    if (typeof object !== 'object' || object === null) {
        return object;
    }
    const keys = path.split('.');
    let current = object as SIndexed;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current.hasOwnProperty(key) ||
            typeof current[key] !== 'object' ||
            current[key] === null) {
            current[key] = {};
        }
        current = current[key] as SIndexed;
    }
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
    return object;
}

type PlainObject<T = unknown> = {
    [k in string]: T;
};

function isPlainObject(value: unknown): value is PlainObject {
    return typeof value === 'object'
        && value !== null
        && value.constructor === Object
        && Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value: unknown): value is [] {
    return Array.isArray(value);
}

function isArrayOrObject(value: unknown): value is [] | PlainObject {
    return isPlainObject(value) || isArray(value);
}

function getKey(key: string, parentKey?: string) {
    return parentKey ? `${parentKey}[${key}]` : key;
}

function getParams(data: PlainObject | [], parentKey?: string) {
    const result: [string, string][] = [];

    for (const [key, value] of Object.entries(data)) {
        if (isArrayOrObject(value)) {
            result.push(...getParams(value, getKey(key, parentKey)));
        } else {
            result.push([getKey(key, parentKey), encodeURIComponent(String(value))]);
        }
    }

    return result;
}

export function queryString(data: PlainObject) {
    if (!isPlainObject(data)) {
        throw new Error('input must be an object');
    }

    return getParams(data).map(arr => arr.join('=')).join('&');
}
type ArrayOrObject = PlainObject | string | unknown[];

export function isEqual(lhs: ArrayOrObject, rhs: ArrayOrObject) {
    if (Object.keys(lhs).length !== Object.keys(rhs).length) {
        return false;
    }

    for (const [key, value] of Object.entries(lhs)) {
        const rightValue = (rhs as PlainObject)[key];
        if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
            if (isEqual(value, rightValue)) {
                continue;
            }
            return false;
        }

        if (value !== rightValue) {
            return false;
        }
    }

    return true;
}

export function formatTime(timeString: string): string {
    try {
        const date = new Date(timeString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Вчера';
        } else if (diffDays < 7) {
            const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
            return weekdays[date.getDay()];
        }
        return date.toLocaleDateString();
    } catch (e) {
        console.error('Invalid date format:', timeString, e);
        return '';
    }
}
