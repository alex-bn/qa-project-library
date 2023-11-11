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
      try {
        if (!title) {
          return res.status(404).json({ error: "missing required field title" });
        }

        const book = new BookModel({ title });
        await book.save();

        res.json(book);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      try {
        const deleteAll = await BookModel.deleteMany({});

        if (!deleteAll) {
          return res.json({ error: "could not delete" });
        }

        return res.json({ result: "complete delete successful" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookId = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if (!bookId) {
        return res.status(404).json({ error: "no book exists" });
      }
      try {
        const book = await BookModel.findById({ _id: bookId });
        res.status(200).json(book);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    .post(async function (req, res) {
      let bookId = req.params.id;
      let comment = req.body.comment;

      try {
        if (!comment) {
          return res.status(404).json({ error: "missing required field comment" });
        }

        const book = await BookModel.findById(bookId);

        if (!book) {
          return res.status(400).json({ error: "no book exists" });
        }

        // Update
        book.commentcount = (book.commentcount || 0) + 1;
        book.comments.push(comment);

        // Save the updated book
        await book.save();

        res.json(book);
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
          return res.status(404).json({ error: "no book exists" });
        }
        await book.deleteOne();
        return res.status(200).send("delete successful");
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
};
