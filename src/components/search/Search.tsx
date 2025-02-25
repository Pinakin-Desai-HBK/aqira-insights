import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { SearchProps } from "src/redux/types/ui/search";
import TextField from "@mui/material/TextField";

const Search = ({ themeSearch, onSearchTextChange, placeholder, type }: SearchProps) => {
  const [searchText, setSearchText] = useState("");
  const [showStartAdornment, setShowStartAdornment] = useState(true);

  const handleChange = (searchText: string) => {
    setSearchText(searchText);
    onSearchTextChange(searchText);
  };

  const iconStyle = { color: themeSearch.icon, fontSize: "20px" };

  return (
    <TextField
      autoComplete="off"
      type="text"
      data-testid={`AI-search-${type}-input`}
      placeholder={placeholder}
      variant="outlined"
      value={searchText}
      onChange={(e) => handleChange(e.target.value)}
      onFocus={() => setShowStartAdornment(false)}
      onBlur={() => setShowStartAdornment(true)}
      sx={{
        display: "flex",
        margin: "0 4px",
        background: themeSearch.background,
        borderRadius: 1,
        "& .MuiOutlinedInput-root": {
          "& fieldset": { border: "none" },
          "&:hover fieldset": { border: "2px solid", borderColor: themeSearch.border }
        }
      }}
      slotProps={{
        input: {
          sx: {
            borderRadius: 1
          },
          style: {
            padding: "6px",
            height: "30px",
            color: "white"
          },
          startAdornment: showStartAdornment && (
            <InputAdornment position="start">
              <SearchIcon sx={iconStyle} />
            </InputAdornment>
          ),
          endAdornment: searchText && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => handleChange("")}
                data-testid={`AI-search-${type}-clear`}
                sx={{ "&:focus": { outline: "none" } }}
              >
                <ClearIcon sx={iconStyle} />
              </IconButton>
            </InputAdornment>
          )
        }
      }}
    />
  );
};

export default Search;
