// Import necessary modules
import request from 'supertest';
import express from 'express';
import mysql from 'mysql';
import { Application } from 'express';

// Initialize the Express application and the database connection
let app: Application;
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sdiwakar@2002",
  database: "student",
});

// Setup before all tests
beforeAll(() => {
  // Create an Express app
  app = express();
  // Use JSON middleware for parsing request bodies
  app.use(express.json());

  // Define routes for different endpoints

  // GET request to root path
  app.get("/", (req, res) => {
    res.json("hello this is the backend");
  });

  // GET request to fetch all students
  app.get("/studentlist", (req, res) => {
    const q = "SELECT * FROM student_list";
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

  // GET request to fetch a student by ID
  app.get("/studentlist/:id", (req, res) => {
    const studentId = req.params.id;
    const q = "SELECT * FROM student_list WHERE id = ?";
    db.query(q, [studentId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data[0]);
    });
  });

  // POST request to add a new student
  app.post("/studentlist", (req, res) => {
    const q =
      "INSERT INTO student_list (`name`, `email`, `number`, `enroll_number`, `date_of_admission`) VALUES (?, ?, ?, ?, ?)";
    const values = [
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.enrollNumber,
      req.body.admissionDate,
    ];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Error inserting student data:", err);
        return res.status(500).json({ error: "Error inserting student data" });
      }
      console.log("Student data inserted successfully");
      res.json("Student list has been created");
    });
  });

  // DELETE request to delete a student by ID
  app.delete("/studentlist/:id", (req, res) => {
    const studentId = req.params.id;
    const q = "DELETE FROM student_list WHERE id = ?"

    db.query(q, [studentId], (err, data) => {
      if (err) {
        console.error("Error deleting student data:", err);
        return res.status(500).json({ error: "Error deleting student data" });
      }
      console.log("Student data deleted successfully");
      res.json("Student list has been deleted");
    });
  });

  // PUT request to update a student by ID
  app.put("/studentlist/:id", (req, res) => {
    const studentId = req.params.id;
    const q = "UPDATE student_list SET `name`=?, `email`=?, `number`=?, `enroll_number`=?, `date_of_admission`=? WHERE id = ?"

    const values = [
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.enrollNumber,
      req.body.admissionDate,
    ];

    db.query(q, [...values, studentId], (err, data) => {
      if (err) {
        console.error("Error editing student data:", err);
        return res.status(500).json({ error: "Error editing student data" });
      }
      console.log("Student data edited successfully");
      res.json("Student list has been edited");
    });
  });
});

// Cleanup after all tests
afterAll(() => {
  // Close the database connection
  db.end();
});

// Describe block for testing the root path
describe('Test the root path', () => {
  // Test to check if the root path responds to the GET method
  test('It should respond to the GET method', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual("hello this is the backend");
  });
});

// Describe block for testing the /studentlist POST method
describe('Test the /studentlist POST method', () => {
  // Test to check if the /studentlist path creates a new student
  test('It should create a new student', async () => {
    const newStudent = {
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      enrollNumber: "EN123456",
      admissionDate: "2023-01-01"
    };
    const response = await request(app).post('/studentlist').send(newStudent);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual("Student list has been created");
  });
});
