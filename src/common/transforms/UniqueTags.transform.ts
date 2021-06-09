import _ = require('lodash');

export function UniqueTags<T = string>(tags: T[]): T[] {
    const uniqueTags = _.uniq(tags);

    if (uniqueTags.length === 0) {
        return null;
    }

    return uniqueTags;
}
