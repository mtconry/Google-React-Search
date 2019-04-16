module.exports = (router, db, axios, apiKey) => {
    const { Book } = db;
  
    router.route("/search").get((req, res) => {
      const query = req.query.q;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyBXOeRmNZfN4Ao0l11_EkldbCwhMYtMx-M&fields=items(id,volumeInfo(title,subtitle,authors,description,imageLinks/thumbnail,infoLink))`;
  
      axios
        .get(url)
        .then(response => {
          if (
            Object.keys(response.data).length === 0 &&
            response.data.constructor === Object
          ) {
            return res.status(204).send([]);
          }
          const promises = response.data.items.map(item => {
            const googleBooksId = item.id;
            const {
              title,
              subtitle,
              authors,
              description,
              imageLinks,
              infoLink,
            } = item.volumeInfo;
  
            const link = infoLink;
  
            return Book.findOne({ googleBooksId }).then(dbBook => ({
              ...(dbBook && { _id: dbBook._id }),
              googleBooksId,
              title,
              subtitle,
              authors,
              description,
              ...(imageLinks && { image: imageLinks.thumbnail }),
              link,
            }));
          });
  
          return Promise.all(promises).then(books => res.status(200).send(books));
        })
        .catch(err => {
          console.log(err);
          return res.status(500).send(err);
        });
    });
  
    router
      .route("/books/:id?")
      .all((req, res, next) => {
        next();
      })
      .get((req, res) => {
        Book.find()
          .then(dbBooks => res.json(dbBooks))
          .catch(err => res.status(500).send(err));
      })
      .post((req, res) => {
        const { googleBooksId } = req.body;
        Book.findOne({ googleBooksId })
          .then(book => {
            if (book) {
              res.status(409).send({ error: "Book already exists on database" });
              return false;
            }
            return Book.create(req.body);
          })
          .then(dbBook => {
            // * check for (dbBook === false) from previous block
            if (dbBook) {
              return res.status(200).send(dbBook);
            }
          })
          .catch(err => res.status(500).send(err));
      })
      .delete((req, res) => {
        Book.findByIdAndDelete(req.params.id)
          .then(dbBook => res.status(200).send(dbBook))
          .catch(err => res.status(500).send(err));
      });
  };