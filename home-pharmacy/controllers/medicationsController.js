const Medication = require("../models/Medication");
const parse_v = require("../util/parse_v_error");

const status_values = Medication.schema.path("status").enumValues;
const productType_values = Medication.schema.path("productType").enumValues;

const medications = async (req, res) => {
  const medicationlist = await Medication.find({ createdBy: req.user.id });
  res.render("pages/medications", {
    medications: medicationlist,
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

const new_medication = (req, res) => {
  const medication_values = {
    brandName: "",
    producer: "",
    opened: "",
    expirationDate: "",
    productType: "",
    status: "",
    action: "/medications/add",
    submit: "Add",
    title: "Add a Medication Entry",
  };
  res.render("pages/medication", {
    status_values,
    productType_values,
    medication_values,
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

const add_medication = async (req, res, next) => {
  try {
    await Medication.create ({
      brandName: req.body.brandName,
      producer: req.body.producer,
      expirationDate: req.body.expirationDate,
      productType: req.body.productType,
      status: req.body.status,
      createdBy: req.user.id,
    });

    } catch (e) {
      if (e.name === "ValidationError") {
        parse_v(e, req);
        const medication_values = {
          brandName: req.body.brandName,
          producer: req.body.producer,
          expirationDate: req.body.expirationDate,
          productType: req.body.productType,
          status: req.body.status,
          opened: req.body.opened,
          action: "/medications/add",
          submit: "Add",
          title: "Add a Medication Entry",
        };
          return res.render("pages/medication", {
            status_values,
            productType_values,
            medication_values,
            errors: req.flash("error"),
            info: req.flash("info"),
          });
        } else {
          return next(e);
        }
    };
    req.flash("info", "The Medication entry was added.");
    res.redirect("/medications");
}

const edit_medication = async (req, res) => {
  const this_medication = await Medication.findOne({
    _id: req.params.medication,
    createdBy: req.user.id,
  });
  if (!this_medication) {
    req.flash("error", "That medication was not found.");
    return res.redirect("/medications");
  }
  const medication_values = {
    brandName: this_medication.brandName || "",
    producer: this_medication.producer || "",
    opened: this_medication.opened || "",
    expirationDate: this_medication.expirationDate || "",
    productType: this_medication.productType || "",
    status: this_medication.status || "",
    action: `/medications/update/${this_medication._id}`,
    submit: "Update",
    title: "Edit a Medication Entry",
  };
  res.render("pages/medication", {
    status_values,
    productType_values,
    medication_values,
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

const update_medication = async (req, res, next) => {
  let this_medication = null;
  try {
    this_medication = await Medication.findOneAndUpdate(
      { _id: req.params.medication, createdBy: req.user.id },
      req.body,
      { runValidators: true }
    );
  } catch (e) {
    if (e.name === "ValidationError") {
      parse_v(e, req);
      const medication_values = {
        brandName: req.body.brandName,
        producer: req.body.producer,
        expirationDate: req.body.expirationDate,
        productType: req.body.productType,
        status: req.body.status,
        action: `/medications/update/${req.params.medication}`,
        submit: "Update",
        title: "Edit a Medication Entry",
      };
      return res.render("pages/medication", {
        status_values,
        productType_values,
        medication_values,
        errors: req.flash("error"),
        info: req.flash("info"),
      });
    } else {
      return next(e);
    }
  }

  if (this_medication) {
    req.flash("info", "The medication entry was updated.");
  } else {
    req.flash("error", "The medication entry was not found.");
  }
  res.redirect("/medications");
};

const delete_medication = async (req, res, next) => {
  const this_medication = await Medication.findOneAndDelete({
    _id: req.params.medication,
    createdBy: req.user.id,
  });
  if (this_medication) {
    req.flash("info", "The medication entry was deleted.");
  } else {
    req.flash("error", "The medication entry was not found.");
  }

  res.redirect("/medications");
};

module.exports = {
  medications,
  add_medication,
  new_medication,
  edit_medication,
  update_medication,
  delete_medication,
};
