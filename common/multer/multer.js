const multer = require('multer');
const path = require('path');
const fs = require('fs');

 const uploadsDir = path.join(__dirname, './../../uploads');
const foodPhotoDir = path.join(uploadsDir, 'food_photo');
const userProfilePhoto = path.join(uploadsDir, 'user_profile_photo');

 if (!fs.existsSync(userProfilePhoto)) {
  fs.mkdirSync(userProfilePhoto, { recursive: true });
}

if (!fs.existsSync(foodPhotoDir)) {
  fs.mkdirSync(foodPhotoDir, { recursive: true });
}

 const profilePhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, userProfilePhoto);  
  },
  filename: (req, file, cb) => {
    if (!file.originalname) {
      return cb(new Error("Invalid file: No filename provided"));
    }
     const fileExtension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1E9)}${fileExtension}`;
    cb(null, uniqueName);
  }
});

 const profilePhotoFilter = (req, file, cb) => {
  if (!file) {
    return cb(new Error("No file uploaded"));
  }
  
   const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, GIF) are allowed!"), false);
  }
};

 const fooPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, foodPhotoDir);  
  },
  filename: (req, file, cb) => {
    if (!file.originalname) {
      return cb(new Error("Invalid file: No filename provided"));
    }
     const fileExtension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1E9)}${fileExtension}`;
    cb(null, uniqueName);
  }
});

 const foodPhotoFilter = (req, file, cb) => {
  if (!file) {
    return cb(new Error("No file uploaded"));
  }
  
   const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, GIF) and PDFs are allowed!"), false);
  }
};

 const uploadProfilePhoto = multer({
  storage: profilePhotoStorage,
  fileFilter: profilePhotoFilter,
  limits: { fileSize: 5 * 1024 * 1024 },  
});

 const uploadFoodPhoto = multer({
  storage: fooPhotoStorage,
  fileFilter: foodPhotoFilter,
  limits: { fileSize: 10 * 1024 * 1024 },  
});

module.exports = { uploadProfilePhoto, uploadFoodPhoto };
