const db = require("../db/db");

class DetailController {
    static async index(req, res) {

        const namaTari = req.params.nama_tari; 

        const data = await db("tari").where({ nama_tari: namaTari }).first();

        if (!data) {
            return res.status(404).send("Tari tidak ditemukan");
        }

        res.render("detail", {
            tari: data
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
}

module.exports = DetailController