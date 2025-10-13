import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportToExcel = (data, fileName = "grades.xlsx") => {
  // 1. Convert JSON data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 2. Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");

  // 3. Write workbook to binary buffer
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // 4. Save file using FileSaver
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};
