const db = require('../repository/db')

async function registerService(name) {
    const result = await db.query(
        `INSERT INTO people 
            (name)
            VALUES 
            (?)`, 
        [
            name
        ]
    )

    let message = 'Error in creating Register'

    if(result.affectedRows) 
        message = 'Register created successfully'

    return message
}

async function getAllRegistries() {
    let rows = []

    const result = await db.query(
        `SELECT name FROM people`
    )

    if(result) rows = result

    return rows
}

module.exports = {
    registerService,
    getAllRegistries
}
