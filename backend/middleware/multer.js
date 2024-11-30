const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({storage});

// const upload = multer({
//   storage: storage,
// }).array('posters', 10);

// const upload2 = multer({
//   storage: storage,
// }).single('poster', 1);

module.exports = { upload };