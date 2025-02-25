import { Icon } from "../Icon";
import FeedbackRatingIconUnselected1Svg from "./feedback-rating-icon-unselected-1.svg";
import FeedbackRatingIconUnselected2Svg from "./feedback-rating-icon-unselected-2.svg";
import FeedbackRatingIconUnselected3Svg from "./feedback-rating-icon-unselected-3.svg";
import FeedbackRatingIconUnselected4Svg from "./feedback-rating-icon-unselected-4.svg";
import FeedbackRatingIconUnselected5Svg from "./feedback-rating-icon-unselected-5.svg";
import FeedbackRatingIconSelected1Svg from "./feedback-rating-icon-selected-1.svg";
import FeedbackRatingIconSelected2Svg from "./feedback-rating-icon-selected-2.svg";
import FeedbackRatingIconSelected3Svg from "./feedback-rating-icon-selected-3.svg";
import FeedbackRatingIconSelected4Svg from "./feedback-rating-icon-selected-4.svg";
import FeedbackRatingIconSelected5Svg from "./feedback-rating-icon-selected-5.svg";

const FeedbackRatingIcon = ({ index, selected }: { index: number; selected: boolean }) => {
  let icon: string;

  switch (index) {
    case 1:
      icon = selected ? FeedbackRatingIconSelected1Svg : FeedbackRatingIconUnselected1Svg;
      break;
    case 2:
      icon = selected ? FeedbackRatingIconSelected2Svg : FeedbackRatingIconUnselected2Svg;
      break;
    case 3:
      icon = selected ? FeedbackRatingIconSelected3Svg : FeedbackRatingIconUnselected3Svg;
      break;
    case 4:
      icon = selected ? FeedbackRatingIconSelected4Svg : FeedbackRatingIconUnselected4Svg;
      break;
    case 5:
      icon = selected ? FeedbackRatingIconSelected5Svg : FeedbackRatingIconUnselected5Svg;
      break;
    default:
      icon = selected ? FeedbackRatingIconSelected1Svg : FeedbackRatingIconUnselected1Svg;
  }

  return <Icon src={icon} style={{ width: "90px" }} inverted={false} />;
};

export default FeedbackRatingIcon;
