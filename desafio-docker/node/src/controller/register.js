const registerService = require('../service/register')

async function registerController(req, res) {
    try {
        const { name } = req.body

        const response = await registerService.registerService(name)

        res.json({ response })
    } catch(err) {
        res.send("Ops... Error")
    }
}

async function findAll(req, res) {
    try {
        await registerService.registerService("TESTE")

        const result = await registerService.getAllRegistries()

        let template = `<ul>`

        let listTemplate = result.reduce((acc, cur, idx) => {
            if(idx === 0) acc = acc + cur.name + "</li>"
            else acc = `${acc}<li>${cur.name}</li>`
            return acc
        }, `<li>`)

        template = template + listTemplate + "</ul>"

        res.send(`<h1>Full Cycle Rocks!</h1></br>${template}`)
    } catch(err) {
        res.json({ error: true, message: err.message })
    }
}

module.exports = {
    registerController,
    findAll
}
