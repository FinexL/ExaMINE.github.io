require("./config/db");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");



const app = express();
const port = 5202;


app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());


app.use("/api/students", require("./routes/students"));
app.use("/api/universities", require("./routes/universities"));
app.use("/api/subjects", require("./routes/subjects"));


app.use("/api/subject_scores", require("./routes/subjectScores"));
app.use("/api/student_grades", require("./routes/studentGrades"));

app.use("/api/seasons", require("./routes/season"));

app.use("/api", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});