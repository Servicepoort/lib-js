const fs = require('fs');

module.exports = async (sequelize, MigrationModel, migrationDir) => {

    const line = (msg, additional = 0) => {
        msg += '\n';

        if (typeof additional === 'number' && additional > 0) {
            for (let i = 0; i < additional; i++) {
                msg += '\n';
            }
        }
        process.stdout.write(msg);
    }

    let ok = true;

    if (!migrationDir.match(/\/$/)) {
        migrationDir += '/';
    }

    for (let file of fs.readdirSync(migrationDir)) {
        if (file === 'init.sql') continue;

        try {

            let path = migrationDir + file;
            let name = file.replace(/\.sql$/, '');
            let migration = await MigrationModel.findOne({ where: { name }});

            if (!migration || migration.queries > migration.executed) {
                let contents = fs.readFileSync(path).toString();
                let queries = contents.trim()
                    .split(/(\r?\n){2}/)
                    .map(query => query.trim().replace(/;$/, ''))
                    .filter(query => query.trim())
                ;

                if (!migration) {
                    migration = await MigrationModel.create({
                        name,
                        queries: queries.length,
                        executed: 0,
                    })
                }

                while (migration.executed < migration.queries) {
                    // taking advantage of arrays starting at 0;
                    // E.g. 3 executed means: start at query with index 3 (the 4th one)
                    let query = queries[migration.executed];
                    line('Running query: ' + query);
                    try {
                        await sequelize.query(query);
                        line('Query run successfully', 1);
                        migration.executed++;
                    } catch (e) {
                        console.log(e);
                        line('Query failed. Halting execution');
                        ok = false;
                        break;
                    }
                }

                await migration.save();

            }
        }  catch (e) {
            ok = false;
            console.log('Error while migrating:', e);
        }
    }

    await sequelize.close();

    process.exit(ok ? 0 : 1);

};
