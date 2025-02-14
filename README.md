# Daily Book of Mormon API

A simple and efficient API for accessing Book of Mormon verses, providing daily verses, random verses, and specific verse lookups.

## Features

- 📖 Daily Verse - Get a new verse every day
- 🎲 Random Verse - Get a random verse from the Book of Mormon
- 🔍 Specific Verse Lookup - Get verses by book, chapter, and verse number
- 📚 Book List - Get a list of all available books and their chapters

## API Endpoints

### Get Daily Verse
```
GET /daily
```
Returns a different verse each day, cycling through all verses.

### Get Random Verse
```
GET /random
```
Returns a random verse from the Book of Mormon.

### Get Specific Verse
```
GET /:book/:chapter/:verse
```
Example: `/nephi1/3/7`

Note: For books of Nephi, you can use the following formats:
- `nephi1` or `1nephi` for 1 Nephi
- `nephi2` or `2nephi` for 2 Nephi
- `nephi3` or `3nephi` for 3 Nephi
- `nephi4` or `4nephi` for 4 Nephi

### Get Available Books
```
GET /books
```
Returns a list of all available books and their chapter counts.

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the server:
```bash
npm start
```

The server will run on port 3000 by default. You can change this by setting the `PORT` environment variable.

## Development

To run the server in development mode with auto-reload:
```bash
npm run dev
```

## Technologies Used

- Node.js
- Express.js
- CORS

## Creator

Created by Christian Furr ([@MakashiDev](https://github.com/MakashiDev))

## License

This project is open source and available under the MIT License.