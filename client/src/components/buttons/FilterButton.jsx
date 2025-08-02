import { FilterPanelTrigger, ToolbarButton } from "@mui/x-data-grid";
import FilterListAltIcon from "@mui/icons-material/FilterListAlt";
import { Button } from "@mui/material";

export default function FilterButtons() {
  return (
    <FilterPanelTrigger
      render={(props) => (
        <ToolbarButton {...props}>
          <Button
            startIcon={<FilterListAltIcon />}
            size="small"
            variant="outlined"
          >
            Filter
          </Button>
        </ToolbarButton>
      )}
    />
  );
}
