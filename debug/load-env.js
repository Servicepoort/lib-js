module.exports = (path) => {
    try {
        let env = require(path);
        for (let [key, value] of Object.entries(env)) {
            process.env[key] = value.toString();
        }
        console.log('Using ENV variables from file ' + path)
    } catch (error) {
        if (error.code !== 'MODULE_NOT_FOUND') {
            console.log('Error reading or processing env file:', { error }, '\n\n');
        }
    }
}
