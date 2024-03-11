const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: "./public/Images",
  filename: function (req, file, cb) {
    const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    var ext = path.extname(file.originalname)
    if (ext.toLowerCase() === '.png' || ext.toLowerCase() === '.jpg' || ext.toLowerCase() === '.svg' || ext.toLowerCase() === '.jpeg') {
      cb(null, true);
    } else {
      return cb(new Error('The image type is not allowed. Allowed types: SVG, jpeg, jpg, png'))
    }
  }
});

module.exports = {
  upload: upload.single('profileImage'),
  productImageUpload: upload.fields([{ name: 'image' }])
}

