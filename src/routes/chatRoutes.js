const express = require("express");
const { isAuth } = require("../middleware/authMiddleware");
const {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
} = require("../controllers/chatController");
const router = express.Router();

router.route("/").post(isAuth, accessChat);
router.route("/").get(isAuth, fetchChats);
router.route("/group").post(isAuth, createGroupChat);
router.route("/rename").put(isAuth, renameGroup);
router.route("/groupadd").put(isAuth, addToGroup);
router.route("/groupremove").put(isAuth, removeFromGroup);

module.exports = router;
