module.exports = (path) => {
    try {
        let env = require(path);
        for (let [key, value] of Object.entries(env)) {
            process.env[key] = value.toString();
        }
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.log('No custom env variables found, using server defaults. This is OK on staging / production.\n\n');
        } else {
            console.log('Error reading or processing env file:', { error }, '\n\n');
        }
    }
}
