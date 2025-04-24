import express, { json } from "express";
import axios from "axios";

const app = express();
const PORT = 3000;
const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

// Middleware to parse JSON requests
app.use(json());

// In-memory user list
let userList = [{ Name: "Ash", Email: "Ash@example.com" }];

// GET all user
app.get("/user", (req, res) => {
  res.json({ user: userList });
});

// POST a new user
app.post("/user", (req, res) => {
  userList.push(req.body);
  res.json({ userList: userList });
});

// DELETE a user by index
app.delete("/user", (req, res) => {
  const { index } = req.body;
  if (index === undefined || index < 0 || index >= userList.length) {
    res.status(400).json({ error: "Invalid index" });
  }
  userList.splice(index, 1);
});

// In-memory book list
let bookList = [{ Name: "title", ISBN: "123456789" }];

// Get all books
app.get("/book", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json({ book: bookList });
    }
    const response = await axios.get(`${GOOGLE_BOOKS_API_URL}?q=${query}`);
    const apiBooks = response.data.items
      ? response.data.items.map((item) => ({
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors,
          isbn:
            item.volumeInfo.industryIdentifiers?.find(
              (identifier) => identifier.type === "ISBN_13"
            )?.identifier ||
            item.volumeInfo.industryIdentifiers?.find(
              (identifier) => identifier.type === "ISBN_10"
            )?.identifier,
          description: item.volumeInfo.description,
          thumbnail: item.volumeInfo.imageLinks?.thumbnail,
        }))
      : [];
    res.json({ books: apiBooks });
  } catch (error) {
    console.error("Error fetching books from Google Books API:", error);
    res.status(500).json({ error: "Failed to fetch books from the API" });
  }
});

// Post a new book
app.post("/book", (req, res) => {
  bookList.push(req.body);
  res.json({ bookList: bookList });
});

// DELETE a book by index
app.delete("/book", (req, res) => {
  const { index } = req.body;
  if (index === undefined || index < 0 || index >= bookList.length) {
    res.status(400).json({ error: "Invalid index" });
  }
  bookList.splice(index, 1);
});

// In-memory rating list
let ratingList = [{ Rating: 1 }];

// Get all rating
app.get("/rating", (req, res) => {
  res.json({ rating: ratingList });
});

// Post a new rating
app.post("/rating", (req, res) => {
  ratingList.push(req.body);
  res.json({ ratingList: ratingList });
});

// DELETE a rating by index
app.delete("/rating", (req, res) => {
  const { index } = req.body;
  if (index === undefined || index < 0 || index >= ratingList.length) {
    res.status(400).json({ error: "Invalid index" });
  }
  ratingList.splice(index, 1);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
