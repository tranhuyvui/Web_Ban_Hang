const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images');
    },
    filename: function (req, file, cb) {
        const uniqueName = file.originalname;
        cb(null, uniqueName);
    }
})
const upload = multer({
    storage
})

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'không có ảnh' });
    }
    const imageUrl = `uploads/images/${req.file.filename}`;
    
    res.json({imageUrl})
})
module.exports = router;