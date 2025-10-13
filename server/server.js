require("./config/db");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { authenticateToken } = require("./middleware/authMiddleware");



const app = express();
const port = 5202;


app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

//For Management
app.use("/api/students", require("./routes/students"));
app.use("/api/universities", require("./routes/universities"));
app.use("/api/subjects", require("./routes/subjects"));
app.use("/api/users", require("./routes/users"));

//For Input
app.use("/api/subject_scores", require("./routes/subjectScores"));
app.use("/api/student_grades", require("./routes/studentGrades"));

//For Viewn
app.use("/api/grade_criteria", require("./routes/grade_criteria"));
app.use("/api/top", require("./routes/top"));

//For Archive
app.use("/api/archive", authenticateToken, require("./routes/archive"));

app.use("/api/seasons", require("./routes/season"));



app.use("/api/auth", require("./routes/auth"));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});