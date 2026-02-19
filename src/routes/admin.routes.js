const router = require("express").Router();
const admin = require("../controllers/admin.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

router.get("/stats", auth, role("admin"), admin.getStats);

router.get("/users", auth, role("admin"), admin.getUsers);

router.delete("/users/:id", auth, role("admin"), admin.deleteUser);

router.patch("/user/:id/status",auth,role("admin"),admin.toggleUserStatus);

router.get("/logs", auth, role("admin"), admin.getLogs);

module.exports = router;
