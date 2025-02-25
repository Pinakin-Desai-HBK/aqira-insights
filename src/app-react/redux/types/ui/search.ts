import { ThemeSearch } from "./themes";

export type SearchProps = {
  themeSearch: ThemeSearch;
  onSearchTextChange: (searchText: string) => void;
  placeholder: string;
  type: string;
};
