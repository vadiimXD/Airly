const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const routes = require("./routes")
const app = express();
const puppeteer = require("puppeteer");
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

async function getAdress(adress) {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.goto('https://www.accuweather.com/');

    try {

        const btn = await page.waitForSelector('button#ketch-banner-button-primary[aria-label="Consent"]', { visible: true, timeout: 5000 });

        await btn.evaluate(button => button.click());

    } catch (error) {

        console.log("No consent button found or error occurred");

    }

    try {

        await page.waitForSelector('input[name="query"]');

        await page.type('input[name="query"]', `${adress}`, { delay: 100 });

        await page.keyboard.press('Enter');

    } catch (error) {

        console.log("Error interacting with the search input");

    }

    try {

        const adressSelector = await page.waitForSelector('a > p');
        await adressSelector.evaluate(link => link.click());

    } catch (error) {

        console.log("Error selecting the address from search results");

    }
}



mongoose.connect(`mongodb://localhost:27017/airly`).then(async () => {
    console.log("DB connected successfully")
    app.listen(port, () => console.log(`Server working on port http://localhost:${port}/ :)`))
    await getAdress("Blagoevgrad");
});