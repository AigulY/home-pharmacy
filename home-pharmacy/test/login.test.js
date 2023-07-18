const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Login", function () {
  it("should authenticate the user and redirect to the dashboard", function (done) {
    chai
      .request(app)
      .post("/login")
      .send({ email: "anna3@gmail.com", password: "Aa123456" })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.redirectTo("/medications");

        done(); 
      });
  });

  it("should show an error message for incorrect credentials", function () {
    return new Promise((resolve, reject) => {
      chai
        .request(app)
        .post("/login")
        .send({ email: "annana@gmail.com", password: "aa123456" })
        .end(function (err, res) {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("Incorrect credentials.");

          resolve(); 
        });
    });
  });
});