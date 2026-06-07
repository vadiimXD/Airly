const router = require("express").Router();
const weatherController = require("./controllers/weatherController")

router.use(weatherController)

module.exports = router