const router = require("express").Router()

const weatherService = require("../services/weatherService")

router.post("/search", async (req, res) => {

    try {
        const city = req.body.city
        const data = await weatherService.getFullWeather(city)

        res.json(data)
    } catch (error) {
        res.send(error.message)
    }
})


module.exports = router