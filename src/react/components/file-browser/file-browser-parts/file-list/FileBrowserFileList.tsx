import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import { Fragment, memo } from "react";
import { FileBrowserFileListProps } from "src/react/redux/types/ui/fileBrowser";
import Box from "@mui/material/Box";

export const FileBrowserFileList = memo(function FileBrowserFileListmemo({
  selectedIndex,
  selectedFolder,
  handleClick,
  handleDoubleClick
}: FileBrowserFileListProps) {
  return (
    <TableContainer sx={{ width: "65%" }}>
      <Table aria-label="folder contents" size="small" stickyHeader>
        <TableHead data-testid="AI-file-browser-file-list-head">
          <TableRow>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ overflow: "auto" }} data-testid="AI-file-browser-file-list-items">
          {selectedFolder.folder &&
            selectedFolder.folder.children!.map((row, index) => (
              <Fragment key={row.label}>
                {row.children ? (
                  <TableRow>
                    <TableCell
                      sx={{
                        border: "none",
                        background: selectedIndex === index ? "rgba(2, 95, 126, 0.08)" : "none",
                        "&:hover": { cursor: "pointer" }
                      }}
                      onDoubleClick={() => handleDoubleClick(row.id, "folder")}
                      onClick={() => handleClick(index, row.label, "folder")}
                    >
                      <Box display="flex" alignItems="end" gap={0.5}>
                        <FolderIcon />
                        <span
                          data-testid={`AI-file-browser-file-list-item-label-${row.label}`}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {row.label}
                        </span>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell
                      sx={{
                        border: "none",
                        background: selectedIndex === index ? "rgba(2, 95, 126, 0.08)" : "none",
                        "&:hover": { cursor: "pointer" }
                      }}
                      onDoubleClick={() => handleDoubleClick(row.id, "file")}
                      onClick={() => handleClick(index, row.label, "file")}
                    >
                      <Box display="flex" alignItems="end" gap={0.5}>
                        <InsertDriveFileIcon />
                        <span
                          data-testid={`AI-file-browser-file-list-item-label-${row.label}`}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {row.label}
                        </span>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});
