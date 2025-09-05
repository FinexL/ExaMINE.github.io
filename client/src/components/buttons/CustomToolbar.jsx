import { Toolbar } from "@mui/x-data-grid";
import SearchBarButtons from "./SearchBarButton";
import AddButton from "./AddButton";

export default function CustomToolbar({ onAddClick, addLabel, exportButton }) {
  return (
    <Toolbar
      sx={{
        display: "flex",

        padding: "10px 10px",
      }}
    >
      {exportButton && exportButton}
      <SearchBarButtons />

      <AddButton onClick={onAddClick} label={addLabel} />
    </Toolbar>
  );
}
