import { RefObject, useCallback, useContext, useEffect, useRef, useState } from "react";
import { VisualizationDetailsContext } from "src/components/dashboard-visualization/context/VisualizationDetailsContext";
import { VisualizationDetails } from "src/redux/types/ui/visualizationDetails";
import { Box, Slider, Typography } from "@mui/material";
import { IndexSelectionParams } from "./types";

export const IndexSelect = ({ marksData, visType, indexes, selectedIndex, setSelectedIndex }: IndexSelectionParams) => {
  const { name } = useContext(VisualizationDetailsContext) as VisualizationDetails<typeof visType>;
  const ref: RefObject<HTMLSpanElement | null> = useRef(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const targetIndex = useRef<number | null>(null);
  console.log(visType);
  useEffect(() => {
    setCurrentIndex(selectedIndex || null);
  }, [selectedIndex]);

  const getAriaValueText = useCallback((value: number) => {
    return `${value}}`;
  }, []);

  const setRef = useCallback(
    (elem: HTMLSpanElement) => {
      ref.current = elem;
      if (elem === null || indexes.length === 0) return;
    },
    [indexes]
  );

  const onChange = useCallback(
    (_: unknown, value: number | number[]) => {
      if (typeof value === "number") {
        setCurrentIndex(value);
        targetIndex.current = value;
        setTimeout(() => {
          if (targetIndex.current === value) {
            setSelectedIndex(value);
            targetIndex.current = null;
          }
        }, 500);
      }
    },
    [setSelectedIndex]
  );

  const onChangeComplete = useCallback(
    (_: unknown, value: number | number[]) => {
      if (typeof value === "number") {
        setSelectedIndex(value);
      }
    },
    [setSelectedIndex]
  );

  return currentIndex !== null ? (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingLeft: "10px",
        paddingRight: "10px",
        gap: "20px"
      }}
      data-testid={`AI-histogram-index-select-${name}`}
    >
      <Typography id={`indexes-slider-label-${name}`}>Indexes</Typography>
      <Slider
        value={currentIndex}
        onChange={onChange}
        onChangeCommitted={onChangeComplete}
        sx={{
          marginBottom: 0,

          "& .MuiSlider-thumb": {
            width: 5,
            height: 16,
            borderRadius: 2,
            backgroundColor: "#444",
            "&:hover, &.Mui-focusVisible": {
              boxShadow: "0px 0px 0px 0px"
            },
            "&.Mui-active": {
              boxShadow: "0px 0px 0px 0px"
            }
          },
          "& .MuiSlider-markLabel": {
            top: "-10px",
            color: "#AAA",
            height: `10px`
          },
          "& .MuiSlider-mark": {
            height: 8
          }
        }}
        id={`indexes-slider-${name}`}
        data-testid={`indexes-slider-${name}`}
        aria-labelledby={`indexes-slider-label-${name}`}
        track={false}
        defaultValue={currentIndex}
        marks={
          marksData
            ? marksData.marks.map((mark) => {
                return {
                  value: mark.value,
                  label: (
                    <div
                      data-testid={`index-select-mark-${mark.value}`}
                      style={{
                        fontSize: "12px",
                        rotate: "270deg",
                        position: "relative",
                        bottom: `0px`,
                        width: `10px`,
                        textAlign: "left"
                      }}
                    >
                      {mark.label}
                    </div>
                  )
                };
              })
            : []
        }
        min={marksData ? marksData.min : 0}
        max={marksData ? marksData.max : 1}
        getAriaValueText={getAriaValueText}
        valueLabelDisplay="auto"
        step={null}
        ref={setRef}
      />
    </Box>
  ) : null;
};
