import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

function StuData(stuID, name, university) {
  return { stuID, name, university };
}
function UniData(uniID, name, numberOfStudents, dean, deanEmail) {
  return { uniID, name, numberOfStudents, dean, deanEmail };
}
function TopicData(topicID, topicName, subjectName) {
  return { topicID, topicName, subjectName };
}
function UserData(userID, username, email, status, role, createdDate) {
  return { userID, username, email, status, role, createdDate };
}
const students = [
  StuData("S001", "John Doe", "University A"),
  StuData("S002", "Jane Smith", "University B"),
  StuData("S003", "Alice Johnson", "University A"),
  StuData("S004", "Bob Brown", "University C"),
  StuData("S005", "Charlie White", "University B"),
];
const universities = [
  UniData("U001", "University A", 1500, "Dr. Smith", "Smith@gmail.com"),
  UniData("U002", "University B", 1200, "Dr. Johnson", "Johnson@gmail.com"),
  UniData("U003", "University C", 800, "Dr. Brown", "Brown@gmail.com"),
];
const topics = [
  TopicData("T001", "Machine Learning", "Computer Science"),
  TopicData("T002", "Data Science", "Computer Science"),
  TopicData("T003", "Artificial Intelligence", "Computer Science"),
  TopicData("T004", "Web Development", "Information Technology"),
  TopicData("T005", "Cybersecurity", "Information Technology"),
];
const users = [
  UserData("U001", "dsadas", "dsadas@gmail.com", "Active", "Admin", "11/22/20"),
  UserData(
    "U002",
    "asdasda",
    "asdasda@gmail.com",
    "Inactive",
    "User",
    "01/01/21"
  ),
  UserData("U003", "qweqwe", "qweqwe@gmail.com", "Active", "User", "02/02/22"),
];

const updatedUniversities = universities.map((uni) => {
  const count = students.filter((stu) => stu.university === uni.name).length;
  return { ...uni, numberOfStudents: count };
});

const studentColumns = [
  { field: "stuID", headerName: "ID", width: 80 },
  { field: "name", headerName: "Student Name", width: 180 },
  { field: "university", headerName: "University", width: 180 },
];

const universityColumns = [
  { field: "uniID", headerName: "ID", width: 80 },
  { field: "name", headerName: "University", width: 180 },
  { field: "numberOfStudents", headerName: "# of Students", width: 130 },
  { field: "dean", headerName: "Dean", width: 150 },
  { field: "deanEmail", headerName: "Email", width: 200 },
];

const topicColumns = [
  { field: "topicID", headerName: "ID", width: 80 },
  { field: "topicName", headerName: "Topic", width: 200 },
  { field: "subjectName", headerName: "Subject", width: 200 },
];

const userColumns = [
  { field: "userID", headerName: "User ID", width: 100 },
  { field: "username", headerName: "Username", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "status", headerName: "Status", width: 120 },
  { field: "role", headerName: "Role", width: 120 },
  { field: "createdDate", headerName: "Created Date", width: 150 },
];

export default function ManagementTable(value) {
  return (
    <div style={{ width: "100%" }}>
      {value === 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Student Table
          </Typography>
          <DataGrid
            rows={students}
            columns={studentColumns}
            getRowId={(row) => row.stuID}
            pageSize={5}
          />
        </Box>
      )}
      {value === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            University Table
          </Typography>
          <DataGrid
            rows={updatedUniversities}
            columns={universityColumns}
            getRowId={(row) => row.uniID}
            pageSize={5}
          />
        </Box>
      )}
      {value === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Topic Table (Linked to Subject)
          </Typography>
          <DataGrid
            rows={topics}
            columns={topicColumns}
            getRowId={(row) => row.topicID}
            pageSize={5}
          />
        </Box>
      )}
      {value === 3 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            User Data Table
          </Typography>
          <DataGrid
            rows={users}
            columns={userColumns}
            getRowId={(row) => row.userID}
            pageSize={5}
          />
        </Box>
      )}
    </div>
  );
}
