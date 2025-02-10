const { Router } = require('express');
const DetailController = require('../controller/detailController.js')
const router = Router();

router.get('/detail/:nama_tari', DetailController.index)

module.exports = router;