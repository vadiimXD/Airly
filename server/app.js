const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const routes = require("./routes")
const app = express();
const puppeteer = require("puppeteer");
const e = require("express")
const { get } = require("node:http")
const weatherService = require("./services/weatherService")

app.use(cors());
const port = 1337;

app.use(cookieParser())

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Someone user sended request with method: "${req.method}" on this URL: "${req.url}"`)
    next()
})

app.use(routes)

mongoose.connect(`mongodb://localhost:27017/airly`).then(async () => {
    console.log("DB connected successfully")
    app.listen(port, () => console.log(`Server working on port http://localhost:${port}/ :)`))
});