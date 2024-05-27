import express, { Request, Response } from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

// Create MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sdiwakar@2002",
  database: "student",
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes

// Default route
app.get("/", (req: Request, res: Response) => {
  res.json("hello this is the backend");
});

// Get all students
app.get("/studentlist", async (req: Request, res: Response) => {
  try {
    const q = "SELECT * FROM student_list";
    const data = await query(q);
    res.json(data);
  } catch (err) {
    console.error("Error fetching student list:", err);
    res.status(500).json({ error: "Error fetching student list" });
  }
});

// Get a single student by ID
app.get("/studentlist/:id", async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const q = "SELECT * FROM student_list WHERE id = ?";
    const data = await query(q, [studentId]);
    if (data.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(data[0]);
  } catch (err) {
    console.error("Error fetching student data:", err);
    res.status(500).json({ error: "Error fetching student data" });
  }
});

// Add a new student
app.post("/studentlist", async (req: Request, res: Response) => {
  try {
    const q =
      "INSERT INTO student_list (`name`, `email`, `number`, `enroll_number`, `date_of_admission`) VALUES (?, ?, ?, ?, ?)";
    const values = [
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.enrollNumber,
      req.body.admissionDate,
    ];
    await query(q, values);
    console.log("Student data inserted successfully");
    res.json("Student list has been created");
  } catch (err) {
    console.error("Error inserting student data:", err);
    res.status(500).json({ error: "Error inserting student data" });
  }
});

// Delete a student by ID
app.delete("/studentlist/:id", async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const q = "DELETE FROM student_list WHERE id = ?";
    const data = await query(q, [studentId]);
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    console.log("Student data deleted successfully");
    res.json("Student list has been deleted");
  } catch (err) {
    console.error("Error deleting student data:", err);
    res.status(500).json({ error: "Error deleting student data" });
  }
});

// Update a student by ID
app.put("/studentlist/:id", async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const q =
      "UPDATE student_list SET `name`=?, `email`=?, `number`=?, `enroll_number`=?, `date_of_admission`=? WHERE id = ?";
    const values = [
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.enrollNumber,
      req.body.admissionDate,
      studentId,
    ];
    const data = await query(q, values);
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    console.log("Student data updated successfully");
    res.json("Student list has been updated");
  } catch (err) {
    console.error("Error updating student data:", err);
    res.status(500).json({ error: "Error updating student data" });
  }
});

// Utility function to execute MySQL queries with promise
const query = (sql: string, values?: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Start the server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
