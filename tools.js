const setObjectPath = (object, path, value, create = true) => {
    if (typeof object !== 'object') {
        throw new Error('Not a valid object passed to setObjectPath');
    }
    path = typeof path === 'string' ? path.split('.') : path;
    if (!Array.isArray(path)) {
        throw new Error('Invalid path passed to setObjectPath');
    }

    let handle = object;
    let depth = 0;
    for (let sub of path.slice(0, -1)) {
        if (typeof handle[sub] === 'undefined' && create) {
            handle[sub] = {};
        }
        if (typeof handle[sub] !== 'object') {
            throw new Error('{OBJECT}.' + path.slice(0, depth + 1).join('.') + ' is not an object');
        }
        handle = handle[sub];
        depth++;
    }

    handle[path.slice(-1)[0]] = value;
}

const camelToSnake = (str) => str.replace(/[A-Z]/g, pat => '_' + pat.toLowerCase());
const snakeToCamel = (str) => str.replace(/(_[a-z])/g, pat => pat.substr(1).toUpperCase());
const ucFirst = (str) => str.substr(0, 1).toUpperCase() + str.substr(1);

module.exports = { setObjectPath, camelToSnake, snakeToCamel, ucFirst }
