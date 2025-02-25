import "./App.css";
import { themeAILight } from "./redux/types/ui/themes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Main from "./components/main/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { initStateWithPrevTab } from "redux-state-sync";
import { store } from "./redux/store";

const App = () => {
  initStateWithPrevTab(store);
  return (
    <Provider store={store}>
      <ThemeProvider theme={themeAILight}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Main />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
