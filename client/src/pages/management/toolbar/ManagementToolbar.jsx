import { Toolbar } from "@mui/x-data-grid";
import SearchBarButtons from "../../../components/buttons/SearchBarButton";
import AddButton from "../../../components/buttons/AddButton";

export default function ManagementToolbar({
  onAddClick,
  addLabel,
  exportButton,
}) {
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
