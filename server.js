const cors = require('cors-express');
const express = require("express");
const bodyParser = require('body-parser');
const Books = require("./books");

const PORT = process.env.PORT || 3001;
const app = express();
const router = express.Router();


const options ={
  allow: {
    origin: '*',
      methods: 'GET,PATCH,PUT,POST,DELETE,HEAD,OPTIONS',
      headers: 'Content-Type, Authorization, Content-Length, X-Requested-With, X-HTTP-Method-Override'
  },
}

// MongoDB Database
require('./models');

app.use(cors(options));
// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Serve the UI over express
router.get('/', function (req, res) {
  if (process.env.NODE_ENV === "production") {
      res.sendFile(path.join(__dirname, "./client/build/index.html"));
  } else {
      res.sendFile(path.join(__dirname, './client/public/'));
  }
});

// Initialize Api routes
router.get('/api', (req, res) => res.send('API initialized'));

//Register API routes
app.use('/api', router);

// Route for all records in collection
router.route('/books')
    // Add a saved book entry to the database
    .post(function (req, res) {
        console.log("saving book")
        // Create an entry
        const books = new Books();
        books.title = req.body.title,
            books.authors = req.body.authors,
            books.rating = req.body.rating,
            books.publisher = req.body.publisher,
            books.publishedDate = req.body.publishedDate,
            description = req.body.description,
            books.thumbnail = req.body.thumbnail,
            books.price = req.body.price,
            books.purchase = req.body.purchase;

        // Save the entry and check for errors
        books.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.json({
                    message: 'Books added',
                    books: books
                });
            }
        })
    })

    // Retrieve all books from the database
    .get(function (req, res) {
        Books.find(function (err, books) {
            if (err) {
                res.send(err);
            } else {
                res.json(books);
            }
        });
    })

// Route for specific records
router.route('/books/:id')

    // Remove a record permanently
    .delete( (req, res) => {
        Books.deleteOne({ _id: req.params.id },(err) => {
            if (err) {
                res.send(err);
            } else {
                console.log("successfully removed!", req.params.id);
            }
        }).then(() => {
            res.status(204).end();
        });
    });
// Define API routes here

// Send every other request to the React app
// Define any API routes before this runs
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
