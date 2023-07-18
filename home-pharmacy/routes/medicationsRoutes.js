const express = require("express");

const {
  new_medication,
  add_medication,
  edit_medication,
  update_medication,
  medications,
  delete_medication,

} = require('../controllers/medicationsController');

const router = express.Router();
router.route("/").get(medications);
router.route("/add").get(new_medication).post(add_medication);
router.route("/edit/:medication").get(edit_medication);
router.route("/update/:medication").post(update_medication);
router.route("/delete/:medication").delete(delete_medication);

module.exports = router;  
