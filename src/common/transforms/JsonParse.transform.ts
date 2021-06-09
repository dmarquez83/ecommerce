
export function JsonParse<T = any>(value: T): any {
    
    if (typeof value === 'string') {
        return JSON.parse(value.trim());
    }

    return value;
}
