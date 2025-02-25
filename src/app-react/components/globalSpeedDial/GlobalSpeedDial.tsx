import { SpeedDial, SpeedDialAction, SpeedDialIcon, SpeedDialProps } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { popoutDetails } from "src/popoutDetails";
import usePubSubManager from "src/pubsub-manager/usePubSubManager";
import { SubscriberTypes, TargetSubscriberType } from "src/redux/types/system/pub-sub";
import { OpenGlobalSpeedDialMessage, SpeedDialItem } from "src/redux/types/ui/messages";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

export const GlobalSpeedDial = () => {
  const { popoutId, isPopout } = popoutDetails;
  const subscriberType = isPopout ? SubscriberTypes.POPUP : SubscriberTypes.MAIN;
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(true);
  const [message, setMessage] = React.useState<OpenGlobalSpeedDialMessage | null>(null);
  const [currentItems, setCurrentItems] = React.useState<SpeedDialItem[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [numberOfPages, setNumberOfPages] = React.useState<number>(0);
  const [itemsPerPage] = React.useState<number>(3);
  const [direction, setDirection] = React.useState<SpeedDialProps["direction"]>("up");

  const handleOpen = (
    message: OpenGlobalSpeedDialMessage & {
      targetSubscriberType: TargetSubscriberType;
    }
  ) => {
    setMessage(message);
    setHidden(false);
    setOpen(true);
  };

  const pubSub = usePubSubManager();
  useEffect(() => {
    console.log("Subscribing to OpenGlobalSpeedDial");
    const unsubscribeCallback = pubSub.subscribe("OpenGlobalSpeedDial", handleOpen, subscriberType, popoutId);
    return () => unsubscribeCallback();
  }, [popoutId, pubSub, subscriberType]);

  const handleOnClose = useCallback(() => {
    setHidden(true);
    setOpen(false);
    setCurrentPage(0);
    if (message?.onClose) message.onClose();
  }, [message]);

  const handleOnClick = useCallback(
    (id: string) => {
      if (!id) return;
      setHidden(true);
      setOpen(false);
      setCurrentPage(0);
      if (message?.onSelection) message.onSelection(id);
    },
    [message]
  );
  useEffect(() => {
    if (!message) return;
    setNumberOfPages(Math.ceil(message.options.length / itemsPerPage));
    if (message.position.x > window.innerWidth / 2) {
      setDirection("left");
    } else {
      setDirection("right");
    }
  }, [itemsPerPage, message]);

  useEffect(() => {
    if (message) {
      const items = message.options.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage);

      console.log("items", items.length, currentPage, message.options.length);
      setCurrentItems(items);
    }
  }, [message, currentPage, itemsPerPage]);

  const [showLeftNav, setShowLeftNav] = React.useState(false);
  const [showRightNav, setShowRightNav] = React.useState(false);

  useEffect(() => {
    setShowLeftNav(
      direction === "right"
        ? numberOfPages > 1 && currentPage > 0
        : numberOfPages > 1 && currentPage < numberOfPages - 1
    );
    setShowRightNav(
      direction === "right"
        ? numberOfPages > 1 && currentPage < numberOfPages - 1
        : numberOfPages > 1 && currentPage > 0
    );
  }, [currentPage, direction, numberOfPages]);

  return message !== null && currentItems.length > 0 && direction !== undefined ? (
    <SpeedDial
      data-testid="global-speed-dial"
      ariaLabel="SpeedDial"
      icon={<SpeedDialIcon data-testid="global-speed-dial-close" />}
      onClose={handleOnClose}
      open={open}
      hidden={hidden}
      direction={direction}
      sx={{
        position: "absolute",
        bottom: message.position.y - 25,
        left: direction === "right" ? message.position.x - 25 : undefined,
        right: direction === "left" ? window.innerWidth - message.position.x - 25 : undefined,
        zIndex: 1000,
        "& .MuiSpeedDialAction-fab": { backgroundColor: "#025f7e", borderRadius: "5px" }
      }}
    >
      {/* 
      
      TO DO: 
      
      Determine if the styling can be changed or if the options can be wrapped in a container so that the options can be displayed in a grid.
      
      */}
      {showLeftNav ? (
        <SpeedDialAction
          data-testid={direction === "right" ? "previous-speed-dial" : "next-speed-dial"}
          sx={{ width: "20px" }}
          key={direction === "right" ? "previous" : "next"}
          icon={direction === "right" ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
          tooltipTitle={direction === "right" ? "Previous" : "Next"}
          onClick={() => setCurrentPage((prev) => (direction === "right" ? prev - 1 : prev + 1))}
        />
      ) : null}
      {currentItems.map((item, index) => (
        <SpeedDialAction
          data-testid={`speed-dial-item-${item.id}`}
          key={`${item.title}-${currentPage}-${index}`}
          icon={item.icon}
          tooltipTitle={item.title}
          onClick={() => handleOnClick(item.id)}
        />
      ))}
      {showRightNav ? (
        <SpeedDialAction
          data-testid={direction === "left" ? "previous-speed-dial" : "next-speed-dial"}
          sx={{ width: "20px" }}
          key={direction === "left" ? "previous" : "next"}
          icon={direction === "left" ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
          tooltipTitle={direction === "left" ? "Previous" : "Next"}
          onClick={() => setCurrentPage((prev) => (direction === "left" ? prev - 1 : prev + 1))}
        />
      ) : null}
    </SpeedDial>
  ) : null;
};
