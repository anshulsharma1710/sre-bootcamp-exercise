const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// Create a new instance of Pool for PostgreSQL connection
const pool = new Pool({
  user: 'student_user',            // Your PostgreSQL username
  host: 'localhost',               // PostgreSQL host (localhost if running locally)
  database: 'student_db',          // Your database name
  password: 'Floodyop@30',      // Your password for the database
  port: 5432,                      // Default PostgreSQL port
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving students', err);
    res.status(500).json({ error: 'Failed to retrieve students' });
  }
});

// Add a new student
router.post('/', async (req, res) => {
  const { first_name, last_name, email } = req.body; // Extract fields from request body

  try {
      const query = `
          INSERT INTO students (first_name, last_name, email)
          VALUES ($1, $2, $3)
          RETURNING *;
      `;
      const values = [first_name, last_name, email];

      const result = await pool.query(query, values);

      res.status(201).json(result.rows[0]); // Return the newly added student record
  } catch (error) {
      console.error('Error adding student:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
  

// Get a student by ID
router.get('/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [studentId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error retrieving student', err);
    res.status(500).json({ error: 'Failed to retrieve student' });
  }
});

// Update a student by ID
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email } = req.body;

  try {
    const result = await pool.query(
      'UPDATE students SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING *',
      [first_name, last_name, email, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating student:', error.message);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete all
router.delete('/all', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM students');
    res.status(200).json({ message: `All students deleted successfully, total: ${result.rowCount}` });
  } catch (error) {
    console.error('Error deleting all students:', error.message);
    res.status(500).json({ error: 'Failed to delete all students' });
  }
});

// Delete a student by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ message: `Student with ID ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting student:', error.message);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});



module.exports = router;
