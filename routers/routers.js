const { Router } = require("express");

const router = Router();

const homeRouter = require("./home.router");
const detailRouter = require("./detail.router")
const adminRouter = require("./admin.router")

router.use(homeRouter);
router.use(detailRouter);
router.use(adminRouter);

module.exports = router;