const { Router } = require('express')
const router = Router();
const upload = require("../middlewares/upload");

const tariController = require("../controller/tariController")

router.get("/admin/dashboard", (req, res) => {
    res.render("admin/dashboard");
});

router.get("/admin/tari/list", tariController.index);
router.get("/admin/tari/create", tariController.create);
router.post('/admin/tari/store', upload.single('gambar_banner'), tariController.store);
router.get('/admin/tari/edit/:id', tariController.edit);
router.post('/admin/tari/update/:id', upload.single('gambar_banner'), tariController.update);


module.exports = router;