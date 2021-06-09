
export function StringToBoolean(value: string | boolean): boolean {
    
    if (typeof value === 'string') {
        return value === 'true';
    }

    return value;
}
