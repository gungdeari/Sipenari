const db = require("../db/db");
const path = require('path');
const fs = require('fs').promises;

class TariController {

  // Menampilkan daftar tari (Read - Index)
  static async index(req, res) {
      try {
      const data = await db("tari");

      res.render("admin/tari/list", { 
          tari: data });

      } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Error fetching tari list", error });
      }
  }

  static async create(req, res) {
      const data = await db("tari");
  
      res.render("admin/tari/create", {
        oldValues: req.body,
        resep: data,
      });
    }

  static async store(req, res) {
      const { nama_tari, desc_singkat, desc_lengkap, asal, jenis, tokoh_penting } = req.body;
    
      try {
        let gambar_banner = '';
        if (req.file && req.file.filename) {
          gambar_banner = req.file.filename; 
        }
    
        await db("tari").insert({
          nama_tari,
          gambar_banner,
          desc_singkat,
          desc_lengkap,
          asal,
          jenis,
          tokoh_penting
        });
    
        req.flash("success", "Data tari berhasil disimpan!");

        res.redirect("/admin/tari/list");

      } catch (error) {

        console.error("Error saving tari:", error);

        res.status(500).send("Internal Server Error");

        res.redirect("/admin/tari/create");
      }
  }

  static async edit(req, res) {
    const { id } = req.params;

    try {
      const data = await db("tari").where("id", id).first();

      if (!data) {
        req.flash("error", "Tari tidak ditemukan.");
        return res.redirect("/admin/tari/list");
      }

      res.render("admin/tari/edit", {
        tari: data,
      });

    } catch (error) {

      console.error("Error fetching tari data:", error);

      req.flash("error", "Terjadi kesalahan saat memuat data.");

      res.redirect("/admin/tari/list");
    }
  }
    
  // Metode untuk memperbarui data tari
  static async update(req, res) {
    const { id } = req.params;
    const { nama_tari, desc_singkat, desc_lengkap, asal, jenis, tokoh_penting } = req.body;

    try {
        // Cari data tari berdasarkan ID
        const tari = await db('tari').where('id', id).first();

        // Jika ada file gambar yang diupload
        let gambar_banner = tari.gambar_banner; 
        if (req.file) {
            gambar_banner = req.file.filename; 
        }

        // Update data tari di database
        const result = await db('tari')
            .where('id', id)
            .update({
                nama_tari,
                gambar_banner, 
                desc_singkat,
                desc_lengkap,
                asal,
                jenis,
                tokoh_penting
            });

        if (result) {
            req.flash('success', 'Data Tari berhasil diperbarui');
            return res.redirect('/admin/tari/list');
        }
    } catch (error) {
        console.error('Error updating tari:', error);
        req.flash('error', 'Gagal memperbarui data Tari');
        return res.redirect(`/admin/tari/edit/${id}`);
    }
  }

}

module.exports = TariController;
