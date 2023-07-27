const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image');
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

const db = mysql.createConnection({
  host: "brbxusbqvn2fpwmujvoc-mysql.services.clever-cloud.com",
  user: "u0xh2k2odwa66s52",
  password: "U5t5zaXh5gxYdQOlIN91",
  database: "brbxusbqvn2fpwmujvoc",
  port: 3306,
});

// post
app.get('/blog', (req, res) => {
    const postId = req.params.id;
    const sql = "SELECT * FROM blog";
    db.query(sql, [postId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  app.get('/blog/:id', (req, res) => {
    const postId = req.params.id;
    const sql = "SELECT * FROM blog WHERE id = ?";
    db.query(sql, [postId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  app.get('/blogg/:category', (req, res) => {
    const category = req.params.category; // Fix: Use req.params.category
    const sql = "SELECT * FROM blog WHERE category = ?";
    db.query(sql, [category], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  
  app.post('/blog', upload.single('image'), (req, res) => {
    const { title,content,category,date } = req.body;
    const image = req.file.filename;
  
    const sql = "INSERT INTO blog (image,title,content,category,date) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [ image,title,content,category,date], (err, result) => {
      if (err) {
        return res.json({ error: err.message });
      }
      return res.json({ status: "Success" });
    });
  });
app.delete('/blog/:id', (req, res) => {
    const postId = req.params.id;
    const sql = "DELETE FROM blog WHERE id = ?";
    db.query(sql, [postId], (err, result) => {
      if (err) {
        return res.json({ error: err.message });
      }
      return res.json({ status: "Success" });
    });
  });
  
// login 
app.get('/users', (req, res) => {
    const postId = req.params.id;
    const sql = "SELECT * FROM users";
    db.query(sql, [postId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  app.post('/users',(req, res) => {
    const { username,password,role} = req.body;
    const sql = "INSERT INTO users (username, password,role) VALUES (?, ?, ?)";
    db.query(sql, [username,password,role], (err, result) => {
      if (err) {
        return res.json({ error: err.message });
      }
      return res.json({ status: "Success" });
    });
  });
// app.put('/post/:id', upload.single('image'), (req, res) => {
//     const postId = req.params.id;
//     const { title, description, datetime, category } = req.body;
//     const image = req.file ? req.file.filename : null;

//     const sql = "UPDATE posts SET title = ?, image = ?, description = ?, datetime = ?, category = ? WHERE id = ?";
//     db.query(sql, [title, image, description, datetime, category, postId], (err, result) => {
//         if (err) {
//             return res.json({ error: err.message });
//         }
//         return res.json({ status: "Success" });
//     });
// });


app.listen(8081, () => {
    console.log('Running');
});