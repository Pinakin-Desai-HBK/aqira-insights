import debounce from "@mui/material/utils/debounce";
import { GridScrollApi } from "@mui/x-data-grid";
import { useEffect, useRef } from "react";
import { GridType, UseGridSyncProps } from "src/insights/redux/types/ui/dataExplorer";

export const useGridSync = <T extends GridType>(props: UseGridSyncProps<T>) => {
  const { apiRefs, currentIndex, type, apiRef } = props;

  const scrollMonitor = useRef<null | (() => void)>(null);
  const scrollMonitorOther = useRef<null | (() => void)>(null);
  const filterMonitor = useRef<null | (() => void)>(null);
  const resizeMonitor = useRef<null | (() => void)>(null);
  useEffect(() => {
    const ref = apiRef.current;
    if (ref?.instanceId !== undefined) {
      apiRefs.current.push(
        type === "dataColumns"
          ? {
              api: ref,
              type,
              indexDetails: props.indexDetails
            }
          : {
              api: ref,
              type: props.type
            }
      );

      resizeMonitor.current = ref.subscribeEvent(
        "columnResize",
        debounce((resizeParams) => {
          apiRefs.current.forEach((apiRef) => {
            const api = apiRef.api;
            if (ref.instanceId !== api.instanceId) {
              const columns = api.getAllColumns();
              const column = columns.find((col) => col.field === resizeParams.colDef.field);
              if (column) {
                column.width = resizeParams.width;
                column.flex = 0;
                api.updateColumns(columns);
              }
            }
          });
        }, 25)
      );
      scrollMonitorOther.current = ref.subscribeEvent("virtualScrollerWheel", () => {
        const scrollPosition = ref.getScrollPosition();
        apiRefs.current.forEach(
          (apiRef) => ref.instanceId !== apiRef.api.instanceId && apiRef.api.scroll({ left: scrollPosition.left })
        );
      });
      if (currentIndex === -2) {
        const scrollFunctions = apiRefs.current.reduce(
          (acc, apiRef) => {
            return ref.instanceId !== apiRef.api.instanceId ? [...acc, apiRef.api.scroll] : acc;
          },
          [] as GridScrollApi["scroll"][]
        );
        scrollMonitor.current = ref.subscribeEvent(
          "scrollPositionChange",
          debounce((scrollParams) => {
            const params = { left: scrollParams.left };
            scrollFunctions.forEach((scroll) => scroll(params));
          }, 25)
        );
      }
      filterMonitor.current = ref.subscribeEvent("filterModelChange", (filterModel) => {
        apiRefs.current.forEach((apiRef) => {
          const api = apiRef.api;
          if (ref.instanceId !== api.instanceId) {
            api.setFilterModel(filterModel);
          }
        });
      });
    }
    return () => {
      if (ref?.instanceId !== undefined) {
        apiRefs.current = apiRefs.current.filter((apiRef) => apiRef.api.instanceId !== ref.instanceId);
      }
      if (resizeMonitor.current) {
        resizeMonitor.current();
      }
      if (scrollMonitor.current) {
        scrollMonitor.current();
      }
      if (filterMonitor.current) {
        filterMonitor.current();
      }
      if (scrollMonitorOther.current) {
        scrollMonitorOther.current();
      }
    };
  }, [apiRef, apiRefs, currentIndex, type, props]);
};
