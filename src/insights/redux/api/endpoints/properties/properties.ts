import { AIEndpointBuilder } from "src/insights/redux/types/redux/redux";
import { getPropertiesBuilder } from "./queries/getPropertiesBuilder";
import { getPropertiesDataBuilder } from "./queries/getPropertiesDataBuilder";
import { getMinimumDimensionsBuilder } from "./queries/getMinimumDimensionsBuilder";
import { updatePropertyBuilder } from "./mutations/updatePropertyBuilder";
import { updatePropertyExpressionBuilder } from "./mutations/updatePropertyExpressionBuilder";

export const getPropertiesApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getPropertiesBuilder(builder),
  ...getPropertiesDataBuilder(builder),
  ...getMinimumDimensionsBuilder(builder),
  ...updatePropertyBuilder(builder),
  ...updatePropertyExpressionBuilder(builder)
});
