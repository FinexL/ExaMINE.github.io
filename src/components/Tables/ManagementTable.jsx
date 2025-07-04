import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

// Data functions
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

//mock date delete soon
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
  UserData(
    "USER001",
    "dsadas",
    "dsadas@gmail.com",
    "Active",
    "Admin",
    "11/22/20"
  ),
  UserData(
    "USER002",
    "asdasda",
    "asdasda@gmail.com",
    "Inactive",
    "User",
    "01/01/21"
  ),
  UserData(
    "USER003",
    "qweqwe",
    "qweqwe@gmail.com",
    "Active",
    "User",
    "02/02/22"
  ),
];

// Student number sa universities
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

export default function ManagementTable({ type }) {
  const getTableProps = () => {
    switch (type) {
      case "student":
        return {
          title: "Student Table",
          rows: students,
          columns: studentColumns,
          getRowId: (row) => row.stuID,
        };
      case "university":
        return {
          title: "University Table",
          rows: updatedUniversities,
          columns: universityColumns,
          getRowId: (row) => row.uniID,
        };
      case "subject":
        return {
          title: "Subject Table",
          rows: topics,
          columns: topicColumns,
          getRowId: (row) => row.topicID,
        };
      case "user":
        return {
          title: "User Table",
          rows: users,
          columns: userColumns,
          getRowId: (row) => row.userID,
        };
      default:
        return <Typography> Walang Data Na Pwede Ma Display</Typography>;
    }
  };
  const tableProps = getTableProps();
  if (!tableProps) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        {tableProps.title}
      </Typography>
      <DataGrid
        rows={tableProps.rows}
        columns={tableProps.columns}
        getRowId={tableProps.getRowId}
        pageSize={5}
      />
    </Box>
  );
}
