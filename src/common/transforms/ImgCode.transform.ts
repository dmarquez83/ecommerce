
export function ImageCode(value: string | any[]) {
    if (typeof value === 'string' && value.trim() === '') {
        return null;
    }

    return value;
}
