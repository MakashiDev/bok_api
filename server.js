const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(express.static(__dirname));

// Load the Book of Mormon data
const bokData = JSON.parse(fs.readFileSync(path.join(__dirname, 'bok.json'), 'utf8'));

// Helper function to get a random verse from the entire book
function getRandomVerse() {
  const books = bokData.books;
  const randomBook = books[Math.floor(Math.random() * books.length)];
  const randomChapter = randomBook.chapters[Math.floor(Math.random() * randomBook.chapters.length)];
  const randomVerse = randomChapter.verses[Math.floor(Math.random() * randomChapter.verses.length)];
  return randomVerse;
}

// Helper function to get today's verse (changes daily)
function getDailyVerse() {
  const startDate = new Date('2024-01-01').getTime();
  const today = new Date().getTime();
  const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  
  let totalVerses = [];
  bokData.books.forEach(book => {
    book.chapters.forEach(chapter => {
      totalVerses = totalVerses.concat(chapter.verses);
    });
  });
  
  const verseIndex = daysSinceStart % totalVerses.length;
  return totalVerses[verseIndex];
}

// Get daily verse
app.get('/daily', (req, res) => {
  try {
    const verse = getDailyVerse();
    res.json(verse);
  } catch (error) {
    res.status(500).json({ error: 'Error getting daily verse' });
  }
});

// Get random verse
app.get('/random', (req, res) => {
  try {
    const verse = getRandomVerse();
    res.json(verse);
  } catch (error) {
    res.status(500).json({ error: 'Error getting random verse' });
  }
});

// Get specific verse by path
app.get('/:book/:chapter/:verse', (req, res) => {
  try {
    const { book, chapter, verse } = req.params;
    
    // Handle special cases like "nephi2" -> "2 Nephi"
    let bookName = book.toLowerCase();
    if (bookName.includes('nephi')) {
      if (bookName === 'nephi2' || bookName === '2nephi') {
        bookName = '2 Nephi';
      } else if (bookName === 'nephi3' || bookName === '3nephi') {
        bookName = '3 Nephi';
      } else if (bookName === 'nephi4' || bookName === '4nephi') {
        bookName = '4 Nephi';
      } else {
        bookName = '1 Nephi';
      }
    }
    
    const foundBook = bokData.books.find(b => 
      b.book.toLowerCase() === bookName ||
      b.book.toLowerCase().replace(/\s+/g, '') === bookName
    );
    
    if (!foundBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    const foundChapter = foundBook.chapters.find(c => c.chapter === parseInt(chapter));
    if (!foundChapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    const foundVerse = foundChapter.verses.find(v => v.verse === parseInt(verse));
    if (!foundVerse) {
      return res.status(404).json({ error: 'Verse not found' });
    }
    
    res.json(foundVerse);
  } catch (error) {
    res.status(500).json({ error: 'Error getting verse' });
  }
});

// Get all available books
app.get('/books', (req, res) => {
  try {
    const books = bokData.books.map(book => ({
      name: book.book,
      chapters: book.chapters.length
    }));
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error getting books' });
  }
});

// Create a limiter for general routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Create a stricter limiter for specific routes
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // limit each IP to 50 requests per windowMs
});

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Apply stricter rate limiting to specific routes
app.use('/random', strictLimiter);
app.use('/daily', strictLimiter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});