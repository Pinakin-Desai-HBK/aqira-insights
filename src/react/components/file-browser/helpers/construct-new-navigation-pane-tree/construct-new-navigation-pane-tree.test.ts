// import { describe, expect, it, vi } from "vitest";
// import * as uuid from "uuid";
// import { constructNewNavigationPaneTree } from "./construct-new-navigation-pane-tree";
// import { NAVIGATION_PANE_TREE_ROOT } from "../../consts/consts";
// import { mockFileSystemDefault } from "../../../../../vite-test/mock-data/mock-file-system-data";
// import { getNavigationPaneDataFromFileSystemData } from "../get-navigation-pane-data-from-file-system-data/get-navigation-pane-data-from-file-system-data";
// import { mockNavigationPaneData } from "../../../../../vite-test/mock-data/mock-navigation-pane-tree-data";

// describe("constructNewNavigationPaneTree", () => {
//   it("should return a new navigation pane tree with the folder", () => {
//     vi.spyOn(uuid, "v4").mockReturnValue("c8695c02-34d1-473d-8a60-e75a0a390564");

//     expect(
//       constructNewNavigationPaneTree(
//         getNavigationPaneDataFromFileSystemData(mockFileSystemDefault),
//         NAVIGATION_PANE_TREE_ROOT
//       )
//     ).toEqual(mockNavigationPaneData);
//   });
// });
