import { COLUMN_DEFINITIONS_HEADER_FONT } from "src/insights/consts/consts";

export const getColumnDetailsGridSx = (currentIndex: number) => ({
  userSelect: "text",
  width: "100%",
  overflow: "visible",
  border: "0px",
  flexGrow: "1",
  marginBottom: currentIndex === -2 ? "1px" : "0px",
  borderRadius: "0px",
  "& .MuiDataGrid-columnHeaderTitleContainerContent": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: "1",
    height: "100%",

    "& .MuiButtonBase-root": {
      visibility: "hidden"
    },
    "&:hover": {
      "& .MuiButtonBase-root": {
        visibility: "visible"
      }
    }
  },
  "& .MuiDataGrid-scrollbar":
    currentIndex !== -2
      ? {
          height: "0px"
        }
      : {},
  "& .MuiDataGrid-virtualScroller": {
    overflowY: "hidden",
    backgroundColor: "#eaeaea",
    marginRight: "-1px"
  },
  "& .MuiDataGrid-overlayWrapper": {
    display: "none"
  },
  "& .MuiDataGrid-overlayWrapperInner":
    currentIndex < 0
      ? {
          display: "none"
        }
      : { height: "30px !important" },
  "& .MuiDataGrid-columnHeaders": {
    borderRadius: "0px",
    overflowY: "hidden",
    ...(currentIndex !== -1 ? { height: "0px" } : {}),
    border: currentIndex === -1 ? "1px solid #929292D4" : "0px"
  },
  "& .MuiDataGrid-virtualScrollerRenderZone": {
    border: "1px solid #929292D4",
    borderLeft: "0px",
    marginLeft: "-1px"
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#FFF",
    color: "#00335A",
    textShadow: "0px 0px, 0px 0px, 0px 0px",
    font: COLUMN_DEFINITIONS_HEADER_FONT,
    fontSize: "13px",
    fontWeight: "500",
    borderRadius: "0px !important",
    padding: "0px",
    width: "100%",
    "& .MuiDataGrid-iconButtonContainer": {
      display: "none"
    },

    "& .MuiDataGrid-columnSeparator": {
      opacity: "1 !important",
      height: "100%",
      "& svg": {
        height: "100%",
        "& rect": {
          stroke: "#929292D4"
        }
      }
    }
  },
  "& .MuiDataGrid-cell": {
    paddingTop: "0px",
    paddingBottom: "0px",
    fontSize: "12px",
    color: "#47505C",
    borderLeft: "1px solid #929292D4"
  },
  "& .odd": { backgroundColor: "#FFF" },
  "& .even": { backgroundColor: "#F8F8FA" },
  "& .MuiTablePagination-toolbar": {
    minHeight: "30px",
    height: "30px"
  },
  "& .MuiButtonBase-root": {
    padding: "4px"
  },
  "& .MuiDataGrid-bottomContainer": {
    display: "none"
  },
  "& .MuiDataGrid-topContainer": {
    position: "relative",
    overflowX: "visible"
  }
});
