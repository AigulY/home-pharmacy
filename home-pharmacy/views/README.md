<!-- <input type="hidden" name="_csrf" value="<%= _csrf %>"> -->
<!-- <input type="hidden" name="_csrf" value="<%= _csrf %>"> -->

const parse_v = (e, req) => {
  console.log("Error Object:", e);

  const keys = Object.keys(e.errors);
  keys.forEach((key) => {
    console.log("Error Key:", key);
    console.log("Error Message:", e.errors[key].properties.message);
    req.flash("error", key + ": " + e.errors[key].properties.message);
  });
};

module.exports = parse_v;