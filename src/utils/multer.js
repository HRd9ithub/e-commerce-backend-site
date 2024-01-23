const multer  = require('multer');
const path  = require('path');

const storage = multer.diskStorage({
    destination: "./public/Images",
    filename: function (req, file, cb) {
      const uniqueSuffix = `${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload;