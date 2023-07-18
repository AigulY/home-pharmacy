const Vitamin = require("../models/Vitamin");
const parse_v = require("../util/parse_v_error");

const vitamins = async (req, res) => {
  const vitaminlist = await Vitamin.find({ createdBy: req.user.id });
  res.render("pages/vitamins", {
    vitamins: vitaminlist,
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

const isFeatured_values = ["True", "False"];

const new_vitamin = (req, res) => {
  const vitamin_values = {
    brandName: "",
    notes: "",
    isFeatured: "",
    action: "/vitamins/add",
    submit: "Add",
    title: "Add a Vitamin Entry",
  };
  res.render("pages/vitamin", {
    vitamin_values,
    isFeatured_values,
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

const add_vitamin = async (req, res, next) => {
  try {
    await Vitamin.create ({
      brandName: req.body.brandName,
      notes: req.body.notes,
      isFeatured: req.body.isFeatured ==='on',
      createdBy: req.user.id,
    });

    } catch (e) {
      if (e.name === "ValidationError") {
        parse_v(e, req);
        const vitamin_values = {
          brandName: req.body.brandName,
          notes: req.body.notes,
          isFeatured: req.body.isFeatured,
          action: "/vitamins/add",
          submit: "Add",
          title: "Add a Vitamin Entry",
        };
          return res.render("pages/vitamin", {
            vitamin_values,
            isFeatured_values,
            errors: req.flash("error"),
            info: req.flash("info"),
          });
        } else {
          return next(e);
        }
    };
    req.flash("info", "The Vitamin entry was added.");
    res.redirect("/vitamins");
}

const edit_vitamin = async (req, res) => {
  const this_vitamin = await Vitamin.findOne({
    _id: req.params.vitamin,
    createdBy: req.user.id,
  });
  if (!this_vitamin) {
    req.flash("error", "That vitamin was not found.");
    return res.redirect("/vitamins");
  }
  const vitamin_values = {
    brandName: this_vitamin.brandName || "",
    notes: this_vitamin.notes || "",
    isFeatured: this_vitamin.isFeatured || "",
    action: `/vitamins/update/${this_vitamin._id}`,
    submit: "Update",
    title: "Edit a Vitamin Entry",
  };
  res.render("pages/vitamin", {
    vitamin_values,
    isFeatured_values,
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

const update_vitamin = async (req, res, next) => {
  let this_vitamin = null;
  try {
    this_vitamin = await Vitamin.findOneAndUpdate(
      { _id: req.params.vitamin, createdBy: req.user.id },
      req.body,
      { runValidators: true }
    );
  } catch (e) {
    if (e.name === "ValidationError") {
      parse_v(e, req);
      const vitamin_values = {
        brandName: req.body.brandName,
        notes: req.body.notes,
        isFeatured: req.body.isFeatured ==='on',
        action: `/vitamins/update/${req.params.vitamin}`,
        submit: "Update",
        title: "Edit a vitamin Entry",
      };
      return res.render("pages/vitamin", {
        vitamin_values,
        isFeatured_values,
        errors: req.flash("error"),
        info: req.flash("info"),
      });
    } else {
      return next(e);
    }
  }

  if (this_vitamin) {
    req.flash("info", "The vitamin entry was updated.");
  } else {
    req.flash("error", "The vitamin entry was not found.");
  }
  res.redirect("/vitamins");
};

const delete_vitamin = async (req, res, next) => {
  const this_vitamin = await Vitamin.findOneAndDelete({
    _id: req.params.vitamin,
    createdBy: req.user.id,
  });
  if (this_vitamin) {
    req.flash("info", "The vitamin entry was deleted.");
  } else {
    req.flash("error", "The vitamin entry was not found.");
  }

  res.redirect("/vitamins");
};

module.exports = {
  vitamins,
  add_vitamin,
  new_vitamin,
  edit_vitamin,
  update_vitamin,
  delete_vitamin,
};
