const router = require("express").Router();
const ctrl = require("../controllers/password.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, ctrl.addPassword);
router.get("/", auth, ctrl.getPasswords);
router.delete("/:id", auth, ctrl.deletePassword);
router.put("/:id", auth, ctrl.updatePassword);

module.exports = router;
