const { spawn } = require('child_process');

const run = (cmd, args, options = {}) => {

    return new Promise((resolve, reject) => {

        const discard = () => void 0;
        const info = { out : [], err : [] }

        const stdOutWrite = data => process.stdout.write(data);
        const stdErrWrite = data => process.stderr.write(data);

        const log = (key, func) => {
            return (data) => {
                info[key].push(data);
                func(data);
            }
        }

        let command = spawn(cmd, args);

        options.out = options.mute ? discard : (typeof options.out == 'function' ? options.out : stdOutWrite);
        options.err = options.mute ? discard : (typeof options.err == 'function' ? options.err : stdErrWrite);

        command.stdout.on('data', log('out', options.out));
        command.stderr.on('data', log('err', options.err));

        command.stderr.on('close', code => {
            if (code) {
                reject({ code, err: info.err });
            } else {
                resolve(info.out);
            }
        });
    });
}

module.exports = { run }
