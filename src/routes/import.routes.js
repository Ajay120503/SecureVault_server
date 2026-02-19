const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const ctrl = require("../controllers/import.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, upload.single("file"), ctrl.importCSV);
router.post("/extension",auth,ctrl.extensionImport);


module.exports = router;
