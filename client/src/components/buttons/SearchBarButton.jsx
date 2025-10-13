import React, { forwardRef } from "react";
import {
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
  ToolbarButton,
} from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button, InputBase } from "@mui/material";

// Wrap TextInput in forwardRef
const TextInput = forwardRef((props, ref) => {
  return (
    <InputBase
      {...props}
      inputRef={ref} // attach the ref here
      sx={{
        height: "36px",
        width: "100%",
        border: "1px solid",
        borderColor: "neutral.300",
        borderRadius: 1,
        px: 1.5,
        fontSize: "1rem",
        color: "text.primary",
        bgcolor: "background.paper",
        "&:focus-within": {
          outline: "2px solid #1976d2",
        },
        ...props.sx,
      }}
    />
  );
});

export default function SearchBarButtons() {
  return (
    <QuickFilter
      render={(props, state) => (
        <div
          {...props}
          style={{ marginLeft: "auto", display: "flex", overflow: "hidden" }}
        >
          <QuickFilterTrigger
            render={
              <ToolbarButton
                render={
                  <Button
                    aria-label="Search"
                    sx={{
                      borderTopRightRadius: state.expanded ? 0 : 1,
                      borderBottomRightRadius: state.expanded ? 0 : 1,
                      height: 36,
                    }}
                  >
                    <SearchIcon fontSize="small" />
                  </Button>
                }
              />
            }
          />
          <div
            style={{
              display: "flex",
              overflow: "hidden",
              width: state.expanded ? "12rem" : 0,
              transition: "width 0.3s ease-in-out",
            }}
          >
            <QuickFilterControl
              placeholder="Search"
              render={({ slotProps, ...controlProps }) => (
                <TextInput
                  {...controlProps}
                  {...slotProps?.htmlInput}
                  ref={slotProps?.ref} // forward the ref
                  sx={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius:
                      state.expanded && state.value !== "" ? 0 : 4,
                    borderBottomRightRadius:
                      state.expanded && state.value !== "" ? 0 : 4,
                  }}
                />
              )}
            />
            {state.expanded && state.value !== "" && (
              <QuickFilterClear
                render={
                  <Button
                    aria-label="Clear"
                    sx={{
                      height: 36,
                      minWidth: "36px",
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                  >
                    <CancelIcon fontSize="small" />
                  </Button>
                }
              />
            )}
          </div>
        </div>
      )}
    />
  );
}
