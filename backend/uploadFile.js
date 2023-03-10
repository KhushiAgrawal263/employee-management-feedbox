const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdir('./uploadFile/',(err)=>{
           cb(null, './uploadFile/');
        });
      },
      filename: function(req, file, cb) {
        console.log(file,"foleefghvgh");
        cb(null, Date.now() + file.originalname);
      }
})

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
const uploadFile = multer({
    storage:storage,
    limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

module.exports = uploadFile;