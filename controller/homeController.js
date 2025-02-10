const db = require("../db/db");

class HomeController {
    static async index(req, res) {

        const data = await db("tari");

        res.render("home", {
            tari: data
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
}

module.exports = HomeController