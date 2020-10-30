const editObjectPath = (action, object, path, value, createIgnore = true) => {
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
        if (handle[sub] == undefined) {
            if (createIgnore) {
                if (action === 'set') {
                    handle[sub] = {};
                } else {
                    return;
                }
            } else {
                throw new Error('{OBJECT}.' + path.slice(0, depth + 1).join('.') + ' is undefined.');
            }
        }
        if (typeof handle[sub] !== 'object') {
            throw new Error('{OBJECT}.' + path.slice(0, depth + 1).join('.') + ' is not an object');
        }
        handle = handle[sub];
        depth++;
    }

    if (action === 'set') {
        handle[path.slice(-1)[0]] = value;
    } else if (action === 'delete') {
        if (handle[path.slice(-1)[0]] === undefined) {
           if (!createIgnore) {
               throw new Error('{OBJECT}.' + path.join('.') + ' is not defined');
           }
        } else {
            delete handle[path.slice(-1)[0]]
        }
    }
}

const setObjectPath = (object, path, value, create = true) => {
    editObjectPath('set', object, path, value, create);
}

const deleteObjectPath = (object, path, ignore = true) => {
    editObjectPath('delete', object, path, undefined, ignore);
}

const getObjectPathEditor = (object) => {
    return {
        set (paths, value, create) {
            if (typeof paths === 'object') {
                for (let [path, value] of Object.entries(paths)) {
                    setObjectPath(object, path, value, create);
                }
            } else if (typeof paths === 'string') {
                setObjectPath(object, paths, value, create);
            }
            return this;
        },
        delete (paths, ignore) {
            if (Array.isArray(paths)) {
                paths.forEach(path => {
                    deleteObjectPath(object, path, ignore)
                })
            } else if (typeof paths === 'string') {
                deleteObjectPath(object, paths, ignore);
            }
            return this;
        }
    }
}

const camelToSnake = (str) => str.replace(/[A-Z]/g, pat => '_' + pat.toLowerCase());
const snakeToCamel = (str) => str.replace(/(_[a-z])/g, pat => pat.substr(1).toUpperCase());
const ucFirst = (str) => str.substr(0, 1).toUpperCase() + str.substr(1);

module.exports = { setObjectPath, camelToSnake, snakeToCamel, ucFirst, getObjectPathEditor }
