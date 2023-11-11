/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const BookModel = require("../db/book");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      try {
        const books = await BookModel.find({});
        res.json(books);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (!title) {
        return res.send("missing required field title");
      }
      try {
        const book = new BookModel({ title });

        await book.save();

        res.json(book);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    .delete(async function (req, res) {
      try {
        const deleteAll = await BookModel.deleteMany({});

        if (!deleteAll) {
          return res.send("could not delete");
        }

        return res.send("complete delete successful");
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookId = req.params.id;
      try {
        const book = await BookModel.findById({ _id: bookId });

        if (!book) {
          return res.send("no book exists");
        } else {
          res.json(book);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    .post(async function (req, res) {
      let bookId = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.send("missing required field comment"); // ????!!!
      }

      try {
        const book = await BookModel.findById({ _id: bookId });
        if (!book) {
          return res.send("no book exists");
        } else {
          // Update
          book.commentcount = (book.commentcount || 0) + 1;
          book.comments.push(comment);

          // Save
          await book.save();
          // Respond
          res.json(book);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    .delete(async function (req, res) {
      let bookId = req.params.id;
      try {
        const book = await BookModel.findById({ _id: bookId });

        if (!book) {
          return res.send("no book exists");
        }
        await book.deleteOne();
        res.send("delete successful");
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
};
