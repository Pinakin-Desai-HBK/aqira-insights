const popoutId = new URLSearchParams(window.location.search).get("id");

export const popoutDetails = {
  isPopout: popoutId !== null,
  popoutId: popoutId
};
