const express = require("express");
const router = express.Router();

const WatchController = require("../controllers/watch.controller");
const admin = require("../middlewares/verify");
const isLogin = require("../middlewares/isLogin");

router.get("/create-watch", admin, WatchController.renderCreateWatchPage);
router.post("/create-watch", admin, WatchController.createWatch);
router.get("/watches", admin, WatchController.getWatch);
router.get("/delete-watch/:id", admin, WatchController.deleteWatch);
router.get("/edit-watch/:id", admin, WatchController.renderEditWatchPage);
router.post("/edit-watch/:id", admin, WatchController.editWatch);
router.post("/watch/:id/comment", isLogin, WatchController.comment);
router.get(
  "/watch/:id/comment/:commentId/delete",
  isLogin,
  WatchController.deleteComment
);
module.exports = router;
