import express from "express";
import ViteExpress from "vite-express";
import bodyParser from "body-parser";
import pkg from 'mysql2/promise';
import cors from 'cors';
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//---------------------------------------------------------------------------------------------------------------------------------------------
const mysql = pkg;
const app = express();
// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup multer for image upload and specify the destination directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware to parse JSON bodies
app.use(express.json());

const jwtSecret = 'your_jwt_secret'; // Replace with your secret key


ViteExpress.listen(app, 3000, async () =>
  console.log("Server is listening on port 3000...")
);
//-------------------------------------------------------------------------------------------------------------------------------
// protection
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
};

const password = 'your_password';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  // Store hash in your password DB.
  console.log(hash);
});
//---------------------------------------------------------------------------------------------------------------------------
// register 

app.post('/register/user', upload.single('img'), async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  const data = req.body;
  const dob = data.dob;
  const dateCreated = new Date();
  let imageId = 1; // Default image ID
  let imgUrl = null;

  try {
    if (req.file) {
      const imgPath = req.file.path; // path to the uploaded image
      imgUrl = `http://localhost:3000/uploads/${path.basename(imgPath)}`; // generate the URL for the image

      // Insert the image URL into the database
      const [imgResult] = await conn.query('INSERT INTO image (imageurl) VALUES (?)', [imgUrl]);
      imageId = imgResult.insertId;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Insert the user data into the user table
    const userInsertQuery = `
      INSERT INTO user (fName, mName, lName, email, username, password, dateCreated, dob, image_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [userResult] = await conn.query(userInsertQuery, [
      data.fName, 
      data.mName, 
      data.lName, 
      data.email, 
      data.username, 
      hashedPassword, // Use hashed password here
      dateCreated, 
      dob, 
      imageId
    ]);

    const userId = userResult.insertId;

    // Insert payment details into the payment table
    const paymentInsertQuery = `
      INSERT INTO payment (user_id, type, creditcardNo, cvv) 
      VALUES (?, ?, ?, ?)`;

    await conn.query(paymentInsertQuery, [
      userId,
      data.creditType,
      data.creditno,
      data.cvv
    ]);

    res.status(201).json({ message: 'User and payment created successfully', userId, imgUrl });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: 'Error creating user' });
  } finally {
    await conn.end();
  }
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//--------------------------------------------------------------------------------------------------------------------------------------------
// logins
app.post('/login', async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  const { username, password } = req.body;

  try {
    const [userRows] = await conn.query('SELECT * FROM user WHERE username = ?', [username]);
    const [staffRows] = await conn.query('SELECT s.*, r.rolename FROM staff s JOIN role r ON s.role_id = r.role_id WHERE s.username = ?', [username]);

    if (userRows.length > 0) {
      const user = userRows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ username: user.username, role: 'user' }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, user });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } else if (staffRows.length > 0) {
      const staff = staffRows[0];
      const match = await bcrypt.compare(password, staff.password);
      if (match) {
        const token = jwt.sign({ username: staff.username, role: staff.rolename }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, staff });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Error during login' });
  } finally {
    await conn.end();
  }
});
//--------------------------------------------------------------------------------------------------------------------------------------
// Function to fetch user information based on username
async function getUserInfo(username) {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });

    const [results] = await conn.query('SELECT * FROM user WHERE username = ?', [username]);
    await conn.end();
    return results;

  } catch (err) {
    console.error('Error fetching user information:', err);
    throw err;
  }
}

// Endpoint to get user information based on username
app.post('/infouser', async (req, res) => {
  try {
    const { username } = req.body;
    const userInfo = await getUserInfo(username);
    res.json(userInfo);

  } catch (err) {
    console.error('Error fetching user information:', err);
    res.status(500).send('Error fetching user information');
  }
});

// Function to fetch staff information based on username
async function getStaffInfo(username) {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });

    const [results] = await conn.query('SELECT s.*, i.imageurl FROM staff s JOIN image i ON s.image_id = i.image_id WHERE s.username = ?', [username]);
    await conn.end();
    return results;

  } catch (err) {
    console.error('Error fetching staff information:', err);
    throw err;
  }
}

// Endpoint to get staff information based on username
app.post('/infostaff', async (req, res) => {
  try {
    const { username } = req.body;
    const staffInfo = await getStaffInfo(username);
    res.json(staffInfo);

  } catch (err) {
    console.error('Error fetching staff information:', err);
    res.status(500).send('Error fetching staff information');
  }
});
//------------------------------------------------------------------------------------------------------------
// Route to get all movies
// Function to fetch staff information based on username
async function getMoviesInfo() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });

    const [results] = await conn.query(`
      SELECT
        m.movie_id AS id,
        m.title AS name,
        m.picture_url AS image,
        AVG(r.rating) AS rating,
        m.description,
        m.trailer
      FROM 
        movie m 
      JOIN 
        review r 
      ON 
        m.movie_id = r.movie_id 
      GROUP BY 
        m.movie_id
    `);
    await conn.end();
    return results.map(row => ({
      id: row.id,
      name: row.name,
      price: null, // Set price to null or some default value if it's not available
      image: row.image,
      trailer: row.trailer,
      rating: Math.round(row.rating * 10) / 10, // Optionally round the rating to one decimal place
      description: row.description
    }));

  } catch (err) {
    console.error('Error fetching movie information:', err);
    throw err;
  }
}

// Endpoint to get movie information
app.post('/moviescard', async (req, res) => {
  try {
    const moviesInfo = await getMoviesInfo();
    res.json(moviesInfo);

  } catch (err) {
    console.error('Error fetching movie information:', err);
    res.status(500).send('Error fetching movie information');
  }
});
//-----------------------------------------------------------------------------------------------
// Middleware to handle authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Validate the token (you'll need to implement this part)
  // If valid, set req.user with user information extracted from the token
  req.user = { role: 'Staff' }; // Dummy user for testing, replace this with actual user data
  next();
};

app.get('/user', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });
  try {
    const [results] = await conn.query(`
      SELECT u.*, i.imageurl 
      FROM user u
      LEFT JOIN image i ON u.image_id = i.image_id
    `);
    await conn.end();
    res.json(results);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Error fetching users');
  }
});

// Update a user by ID
app.put('/users/:id', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });
  try {
    const { id } = req.params;
    const { fName, lName, email, username, image_id } = req.body;
    const role = req.user.role;

    if (role !== 'Staff') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const [result] = await conn.query(
      'UPDATE user SET fName = ?, lName = ?, email = ?, username = ?, image_id = ? WHERE user_id = ?',
      [fName, lName, email, username, image_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await conn.end();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a user by ID
app.delete('/users/:id', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });
  try {
    const { id } = req.params;
    const role = req.user.role;

    if (role !== 'Staff' && role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const [result] = await conn.query('DELETE FROM user WHERE user_id = ?', [id]);

    await conn.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/users', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });
  try {
    const {
      fName, mName, lName, email, username, password, dateCreated, member_id, dob, image_id
    } = req.body;

    const [result] = await conn.query(
      'INSERT INTO user (fName, mName, lName, email, username, password, dateCreated, member_id, dob, image_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [fName, mName, lName, email, username, password, dateCreated, member_id, dob, image_id]
    );

    const [newUser] = await conn.query('SELECT * FROM user WHERE user_id = ?', [result.insertId]);

    await conn.end();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//=============================================
// Get all movies
app.get('/movies', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  try {
    const [results] = await conn.query('SELECT * FROM movie');
    await conn.end();
    res.json(results);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).send('Error fetching movies');
  }
});


// Update a movie by ID
app.put('/movies/:id', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  try {
    const { id } = req.params;
    const { title, director, description } = req.body;
    const role = req.user.role;

    if (role !== 'Staff') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const [result] = await conn.query('UPDATE movie SET title = ?, director = ?, description = ? WHERE movie_id = ?', 
                                      [title, director, description, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    await conn.end();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete a movie by ID
app.delete('/movies/:id', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  try {
    const { id } = req.params;
    const role = req.user.role;

    if (role !== 'Staff') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await conn.query('DELETE FROM movie WHERE movie_id = ?', [id]);
    await conn.end();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Create a new movie
app.post('/movies', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  try {
    const { title, director, description, duration, picture_url, genre } = req.body;

    if (!title || !director || !description || !duration || !picture_url || !genre) {
      return res.status(400).json({ error: 'title, director, description, duration, picture_url, genre are required' });
    }

    const [result] = await conn.query('INSERT INTO movie (title, director, description, duration, picture_url, genre) VALUES (?, ?, ?, ?, ?, ?)', 
                                      [title, director, description, duration, picture_url, genre]);

    await conn.end();
    res.status(201).json({ message: 'Movie created successfully', movieId: result.insertId });
  } catch (error) {
    console.error('Error inserting movie:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//===============================
// Get all reviews
app.get('/reviews', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  try {
    const [results] = await conn.query('SELECT * FROM review');
    await conn.end();
    res.json(results);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).send('Error fetching movies');
  }
});
//===========================================
app.get('/theaters', authenticate, async (req, res) => {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  try {
    const [results] = await pool.query('SELECT * FROM theater');
    res.json(results);
  } catch (err) {
    console.error('Error fetching theaters:', err);
    res.status(500).send('Error fetching theaters');
  }
});

//==========================================
// Fetch showtimes
app.get('/showtimes', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  try {
    const [results] = await conn.query('SELECT * FROM showtime');
    await conn.end();
    res.json(results);
  } catch (err) {
    console.error('Error fetching showtimes:', err);
    res.status(500).json({ error: 'Error fetching showtimes' });
  }
});

// Update a showtime by ID
app.put('/showtimes/:id', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  try {
    const { id } = req.params;
    const { startTime, movie_id, title, theater_id, theaterName } = req.body;
    const role = req.user.role;

    if (role !== 'Staff') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const [result] = await conn.query('UPDATE showtime SET startTime = ?, movie_id = ?, title = ?, theater_id = ?, theaterName = ? WHERE show_id = ?', 
                                      [startTime, movie_id, title, theater_id, theaterName, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    await conn.end();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error updating showtime:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a showtime by ID
app.delete('/showtimes/:id', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  try {
    const { id } = req.params;
    const role = req.user.role;

    if (role !== 'Staff') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await conn.query('DELETE FROM showtime WHERE show_id = ?', [id]);
    await conn.end();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting showtime:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Create a new movie
app.post('/movies', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  try {
    const { title, director, description, duration, picture_url, genre } = req.body;

    if (!title || !director || !description || !duration || !picture_url || !genre) {
      return res.status(400).json({ error: 'title, director, description, duration, picture_url, genre are required' });
    }

    const [result] = await conn.query('INSERT INTO movie (title, director, description, duration, picture_url, genre) VALUES (?, ?, ?, ?, ?, ?)', 
                                      [title, director, description, duration, picture_url, genre]);

    await conn.end();
    res.status(201).json({ message: 'Movie created successfully', movieId: result.insertId });
  } catch (error) {
    console.error('Error inserting movie:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//======================================================================
// Fetch all staff
app.get('/staff', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });
  try {
    const [results] = await conn.query(`
      SELECT s.*, i.imageurl 
      FROM staff s
      LEFT JOIN image i ON s.image_id = i.image_id
    `);
    await conn.end();
    res.json(results);
  } catch (err) {
    console.error('Error fetching staff:', err);
    res.status(500).send('Error fetching staff');
  }
});

// Update a staff by ID
app.put('/staff/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { fName, mName, lName, email, username, phoneNo, dob, role_id, image_id } = req.body;
    const role = req.user.role;

    // Check if the user is authorized to update staff
    if (role !== 'staff' && role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    // Validate input data
    // (Example using express-validator, make sure to install it)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Update staff information in the database
    const [result] = await conn.execute(
      'UPDATE staff SET fName = ?, mName = ?, lName = ?, email = ?, username = ?, phoneNo = ?, dob = ?, role_id = ?, image_id = ? WHERE staff_id = ?',
      [fName, mName, lName, email, username, phoneNo, dob, role_id, image_id, id]
    );

    // Check if staff was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.sendStatus(204); // No content, successful update
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete a staff by ID
app.delete('/staff/:id', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });
  try {
    const { id } = req.params;
    const role = req.user.role;

    if (role !== 'staff' && role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const [result] = await conn.query('DELETE FROM staff WHERE staff_id = ?', [id]);

    await conn.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new staff
app.post('/staff', authenticate, async (req, res) => {
  const { fName, mName, lName, email, username, password, phoneNo, dob, roleId, imageurl } = req.body;

  // Creating a connection pool to reuse connections
  const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  try {
    // Get a connection from the pool
    const conn = await pool.getConnection();

    try {
      // Start transaction
      await conn.beginTransaction();

      // Insert data into the image table
      const [imageResult] = await conn.query(
        'INSERT INTO image (imageurl) VALUES (?)',
        [imageurl]
      );

      // Retrieve the newly inserted image row
      const [newImage] = await conn.query('SELECT * FROM image WHERE image_id = ?', [imageResult.insertId]);

      // Insert data into the staff table
      const [staffResult] = await conn.query(
        'INSERT INTO staff (fName, mName, lName, email, username, password, phoneNo, dob, role_id, image_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [fName, mName, lName, email, username, password, phoneNo, dob, roleId, imageResult.insertId]
      );

      // Retrieve the newly inserted staff row
      const [newStaff] = await conn.query('SELECT * FROM staff WHERE staff_id = ?', [staffResult.insertId]);

      // Commit transaction if all operations are successful
      await conn.commit();

      // Release the connection back to the pool
      conn.release();

      // Send response with the inserted data
      res.status(201).json({ newImage, newStaff });
    } catch (error) {
      // Rollback the transaction if there's any error
      await conn.rollback();

      // Log and handle the error
      console.error('Error during transaction:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    // Handle connection errors
    console.error('Error connecting to the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//========================================================================
//seat
// GET all seats
app.get("/seats", authenticate, async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "projectcpe241",
    });
    const [results] = await conn.query(`
      SELECT * FROM seat;
    `);
    await conn.end();
    res.json(results);
  } catch (err) {
    console.error("Error fetching seats:", err);
    res.status(500).send("Error fetching seats");
  }
});

// Update a seat by ID
app.put("/seats/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { seatnumber, price, isAvailable, theater_id, theaterName } = req.body;
    const role = req.user.role;

    if (role !== "Staff" && role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const conn = await dbConfig.getConnection();
    const [result] = await conn.execute(
      "UPDATE seat SET seatnumber = ?, price = ?, isAvailable = ?, theater_id = ?, theaterName = ? WHERE seat_id = ?",
      [seatnumber, price, isAvailable, theater_id, theaterName, id]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Seat not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Error updating seat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//=================================================================
// Fetch all tickets
app.get('/tickets', async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });
  try {
    const [results] = await conn.query(`
      SELECT * FROM ticket;
    `);
    await conn.end();
    res.json(results);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).send('Error fetching tickets');
  }
});

// Update a ticket by ID
app.put('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { seat_id, show_id, user_id } = req.body;

    // Update ticket information in the database
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });
    const [result] = await conn.execute(
      'UPDATE ticket SET seat_id = ?, show_id = ?, user_id = ? WHERE ticket_id = ?',
      [seat_id, show_id, user_id, id]
    );
    await conn.end();

    // Check if ticket was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.sendStatus(204); // No content, successful update
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a ticket by ID
app.delete('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete ticket from the database
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });
    const [result] = await conn.query('DELETE FROM ticket WHERE ticket_id = ?', [id]);
    await conn.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new ticket
app.post('/tickets', async (req, res) => {
  const { seat_id, show_id, user_id } = req.body;

  try {
    // Insert new ticket into the database
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });
    const [result] = await conn.query(
      'INSERT INTO ticket (seat_id, show_id, user_id) VALUES (?, ?, ?)',
      [seat_id, show_id, user_id]
    );

    // Retrieve the newly inserted ticket
    const [newTicket] = await conn.query('SELECT * FROM tickets WHERE ticket_id = ?', [result.insertId]);
    await conn.end();

    res.status(201).json(newTicket);
  } catch (error) {
    console.error('Error adding ticket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//===============================================================================
// Fetch all payments
app.get('/payments', async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });
  try {
    const [results] = await conn.query('SELECT * FROM payment;');
    await conn.end();
    res.json(results);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).send('Error fetching payments');
  }
});

// Update a payment by ID
app.put('/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, type, creditcardNo, cvv } = req.body;

    // Hash CVV and mask half of the credit card number
    const hashedCvv = await bcrypt.hash(cvv, 10);
    const maskedCreditCardNo =
      creditcardNo.slice(0, 6) + "******" + creditcardNo.slice(-4);

    // Update payment information in the database
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });
    const [result] = await conn.execute(
      'UPDATE payment SET user_id = ?, type = ?, creditcardNo = ?, cvv = ? WHERE payment_id = ?',
      [user_id, type, maskedCreditCardNo, hashedCvv, id]
    );
    await conn.end();

    // Check if payment was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.sendStatus(204); // No content, successful update
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a payment by ID
app.delete('/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete payment from the database
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });
    const [result] = await conn.query('DELETE FROM payment WHERE payment_id = ?', [id]);
    await conn.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new payment
app.post('/payments', async (req, res) => {
  const { user_id, type, creditcardNo, cvv } = req.body;

  try {
    // Hash CVV and mask half of the credit card number
    const hashedCvv = await bcrypt.hash(cvv, 10);
    const maskedCreditCardNo =
      creditcardNo.slice(0, 6) + "******" + creditcardNo.slice(-4);

    // Insert new payment into the database
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });
    const [result] = await conn.query(
      'INSERT INTO payment (user_id, type, creditcardNo, cvv) VALUES (?, ?, ?, ?)',
      [user_id, type, maskedCreditCardNo, hashedCvv]
    );

    // Retrieve the newly inserted payment
    const [newPayment] = await conn.query('SELECT * FROM payment WHERE payment_id = ?', [result.insertId]);
    await conn.end();

    res.status(201).json(newPayment[0]);
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//=================================================================================
// MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'projectcpe241'
};

// Get all memberships
app.get('/memberships', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [results] = await conn.query('SELECT * FROM membership');
    await conn.end();
    res.json(results);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a membership by ID
app.put('/memberships/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, discount } = req.body;

    // Update membership information in the database
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute(
      'UPDATE membership SET name = ?, discount = ? WHERE member_id = ?',
      [name, discount, id]
    );
    await conn.end();

    // Check if membership was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    res.sendStatus(204); // No content, successful update
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a membership by ID
app.delete('/memberships/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete membership from the database
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute('DELETE FROM membership WHERE member_id = ?', [id]);
    await conn.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new membership
app.post('/memberships', async (req, res) => {
  const { name, discount } = req.body;

  try {
    // Insert new membership into the database
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.query(
      'INSERT INTO membership (name, discount) VALUES (?, ?)',
      [name, discount]
    );

    // Retrieve the newly inserted membership
    const [newMembership] = await conn.query('SELECT * FROM membership WHERE member_id = ?', [result.insertId]);
    await conn.end();

    res.status(201).json(newMembership[0]);
  } catch (error) {
    console.error('Error adding membership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//===================================================================================
// info triket
// Define API endpoint to fetch tickets
app.get("/api/tickets", async (req, res) => {
  const userId = req.query.user_id; // Retrieve the user ID from the query parameters

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });

    const query = `
      SELECT 
        ticket.ticket_id,
        movie.title AS movie_title,
        theater.theatername AS theater_name,
        movie.duration,
        showtime.startTime,
        seat.seatnumber,
        movie.picture_url
      FROM 
        ticket
      INNER JOIN showtime ON ticket.show_id = showtime.show_id
      INNER JOIN movie ON showtime.movie_id = movie.movie_id
      INNER JOIN theater ON ticket.theater_id = theater.theater_id
      INNER JOIN seat ON ticket.seat_id = seat.seat_id
      WHERE ticket.user_id = ?
    `;

    const [results] = await conn.query(query, [userId]);
    res.json(results);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//=================================================================================
app.get("/api/showseat", async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });

    const query = `
    SELECT 
        s.startTime, 
        m.title AS movie_title, 
        m.description AS movie_description, 
        m.duration AS movie_duration, 
        m.director AS movie_director, 
        m.releasedate AS movie_release_date, 
        m.picture_url AS movie_picture_url, 
        m.genre AS movie_genre, 
        s.theaterName AS theater_name, 
        se.seatnumber, 
        se.price AS seat_price, 
        se.isAvailable AS seat_available, 
        u.fName AS user_first_name, 
        u.mName AS user_middle_name, 
        u.lName AS user_last_name, 
        u.email AS user_email,
        p.type AS payment_type,
        p.creditcardNo AS credit_card_number,
        p.cvv AS credit_card_cvv
    FROM 
        showtime s
    INNER JOIN 
        Movie m ON s.movie_id = m.movie_id
    INNER JOIN 
        seat se ON s.theater_id = se.theater_id
    LEFT JOIN 
        user u ON u.user_id = s.user_id
    LEFT JOIN 
        payment p ON p.user_id = u.user_id
    `;

    const [results] = await conn.query(query, []);
    res.json(results);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//==============================================================================
//--------------------------------------------------1 advanced analysis
// Middleware for authenticating JWT tokens

app.get('/moviestats', authenticate, async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectcpe241'
  });

  try {
    const [results] = await conn.query(`
      SELECT
        m.title AS movie_title,
        COUNT(r.review_id) AS total_reviews,
        AVG(r.rating) AS average_rating,
        MAX(r.rating) AS highest_rating,
        MIN(r.rating) AS lowest_rating,
        COUNT(DISTINCT u.user_id) AS unique_reviewers
      FROM
        review r
      JOIN
        Movie m ON r.movie_id = m.movie_id
      JOIN
        user u ON r.user_id = u.user_id
      GROUP BY
        m.title
      ORDER BY
        total_reviews DESC
    `);
    await conn.end();
    res.json(results);
  } catch (err) {
    console.error('Error fetching movie stats:', err);
    res.status(500).send('Error fetching movie stats');
  }
});
//====================================================
app.get('/tickets-sold', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });

    const query = `
      SELECT m.title, th.theaterName, COUNT(t.ticket_id) AS tickets_sold
      FROM Ticket t
      JOIN Showtime st ON t.show_id = st.show_id
      JOIN Movie m ON st.movie_id = m.movie_id
      JOIN Theater th ON st.theater_id = th.theater_id
      GROUP BY m.title, th.theaterName;
    `;

    const [results] = await conn.query(query);
    res.json(results);

    await conn.end(); // Close the connection
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//====================================================
app.get('/max-ticket-price', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });

    const query = `
      SELECT m.title, th.theaterName, MAX(s.price) AS max_price
      FROM ticket t
      JOIN seat s ON t.seat_id = s.seat_id
      JOIN showtime st ON t.show_id = st.show_id
      JOIN movie m ON st.movie_id = m.movie_id
      JOIN theater th ON st.theater_id = th.theater_id
      GROUP BY m.title, th.theaterName;
    `;

    const [results] = await conn.query(query);
    res.json(results);

    await conn.end(); // Close the connection
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//=======================================================
// app.getConnection((err, connection) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//   } else {
//     console.log("Connected to MySQL successfully");
//   }
// })
//======================================================
app.get('/min-ticket-price', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'projectcpe241'
    });

    const query = `
      SELECT m.title, th.theaterName, MIN(s.price) AS max_price
      FROM ticket t
      JOIN seat s ON t.seat_id = s.seat_id
      JOIN showtime st ON t.show_id = st.show_id
      JOIN movie m ON st.movie_id = m.movie_id
      JOIN theater th ON st.theater_id = th.theater_id
      GROUP BY m.title, th.theaterName;
    `;

    const [results] = await conn.query(query);
    res.json(results);

    await conn.end(); // Close the connection
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


