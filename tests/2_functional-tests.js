/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const BookModel = require("../db/book");

chai.use(chaiHttp);
const invalidId = "654fcfb7192811f5075f4dd1";

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test.only("#example Test GET /api/books", function (done) {
  //   chai
  //     .request(server)
  //     .get("/api/books")
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, "response should be an array");
  //       assert.property(res.body[0], "commentcount", "Books in array should contain commentcount");
  //       assert.property(res.body[0], "title", "Books in array should contain title");
  //       assert.property(res.body[0], "_id", "Books in array should contain _id");
  //       done();
  //     });
  // });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    suite("POST /api/books with title => create book object/expect book object", function () {
      test("Test POST /api/books with title", function (done) {
        const book = { title: "Brave New World" };
        chai
          .request(server)
          .post("/api/books")
          .send(book)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, "title", "Book should contain a title");
            assert.property(res.body, "_id", "Book should contain a unique id");
            done();
          });
      });

      test("Test POST /api/books with no title given", function (done) {
        const book = {};
        chai
          .request(server)
          .post("/api/books")
          .send(book)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field title");
            done();
          });
        //done();
      });
    });

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(res.body[0], "commentcount", "Books in array should contain commentcount");
            assert.property(res.body[0], "title", "Books in array should contain title");
            assert.property(res.body[0], "_id", "Books in array should contain _id");
            done();
          });
        //done();
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get(`/api/books/${invalidId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", async function () {
        const book = new BookModel({ title: "Brave New World" });
        await book.save();
        const id = book._id;
        const title = book.title;

        return chai
          .request(server)
          .get(`/api/books/${id}`)
          .then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            assert.equal(res.body.title, title);
          });
      });
    });

    suite("POST /api/books/[id] => add comment/expect book object with id", function () {
      test("Test POST /api/books/[id] with comment", async function () {
        const book = new BookModel({ title: "1984" });
        await book.save();
        const id = book._id;
        const title = book.title;
        const comment = "test";

        return chai
          .request(server)
          .post(`/api/books/${id}`)
          .send({ comment })
          .then((res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments);
            assert.include(res.body.comments, comment);
            assert.equal(title, "1984");
          });
      });

      test("Test POST /api/books/[id] without comment field", async function () {
        const book = new BookModel({ title: "No Comment" });
        await book.save();
        const id = book._id;
        const title = book.title;
        const noComment = {};
        return chai
          .request(server)
          .post(`/api/books/${id}`)
          .send(noComment)
          .then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field comment");
            assert.equal(title, "No Comment");
          });
      });

      test("Test POST /api/books/[id] with comment, id not in db", function (done) {
        const comment = "test";
        chai
          .request(server)
          .post(`/api/books/${invalidId}`)
          .send({ comment })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", async function () {
        const book = new BookModel({ title: "To Be Deleted" });
        await book.save();
        const id = book._id;
        return chai
          .request(server)
          .delete(`/api/books/${id}`)
          .then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
          });
      });

      test("Test DELETE /api/books/[id] with id not in db", function (done) {
        return chai
          .request(server)
          .delete(`/api/books/${invalidId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });
  });
});
