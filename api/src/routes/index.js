const express = require("express");
const _birthRoute = require("./birth")
const router = new express.Router();
/**
 * Primary app routes.
 */
router.use("/birthcertificate", _birthRoute);

module.exports = router;
