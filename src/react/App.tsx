import "./App.css";
import { themeAILight } from "./redux/types/ui/themes";
import Main from "./components/main/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { initStateWithPrevTab } from "redux-state-sync";
import { store } from "./redux/store";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { SciChart3DSurface, SciChartSurface } from "scichart";
import { handlePageReload } from "./helpers/handle-page-reload/handle-page-reload";

//https://www.scichart.com/documentation/js/current/webframe.html#Tutorial02IncludeIndexMinJSWebassemblyFilesOffline.html

SciChartSurface.configure({
  dataUrl: `./sciChart/v3.5.727/scichart2d.data`,
  wasmUrl: `./sciChart/v3.5.727/scichart2d.wasm`
});

SciChart3DSurface.configure({
  dataUrl: `./sciChart/v3.5.727/scichart3d.data`,
  wasmUrl: `./sciChart/v3.5.727/scichart3d.wasm`
});

handlePageReload();

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
