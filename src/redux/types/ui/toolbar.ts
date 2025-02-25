import { TimeSeriesKey, VisTypes, HistogramKey, Histogram3DKey } from "src/redux/types/schemas/dashboardVisualizations";
import { MapDiscriminatedUnion, typedObjectKeys } from "src/redux/types/typeUtils";
import { ResetZoomAction } from "src/components/dashboard-visualization/toolbar/actions/ResetZoomAction";
import { DeselectAllDataSeriesAction } from "src/components/dashboard-visualization/toolbar/actions/DeselectAllDataSeriesAction";
import { SelectAllDataSeriesAction } from "src/components/dashboard-visualization/toolbar/actions/SelectAllDataSeriesAction";
import { ControlSummaryAction } from "src/components/dashboard-visualization/toolbar/actions/ControlSummaryAction";
import { ShowMarkersAction } from "src/components/dashboard-visualization/toolbar/actions/ShowMarkersAction";
import { HideMarkersAction } from "src/components/dashboard-visualization/toolbar/actions/HideMarkersAction";
import { Context } from "react";
import { ShowLinesAndPointsAction } from "src/components/dashboard-visualization/toolbar/actions/ShowLinesAndPointsAction";
import { LinesAndPointsDisabledAction } from "src/components/dashboard-visualization/toolbar/actions/LinesAndPointsDisabledAction";
import { BinsDisabledAction } from "src/components/dashboard-visualization/toolbar/actions/BinsDisabledAction";
import { LinesDisabledAction } from "src/components/dashboard-visualization/toolbar/actions/LinesDisabledAction";
import { ShowBinsAction } from "src/components/dashboard-visualization/toolbar/actions/ShowBinsAction";
import { ShowLinesAction } from "src/components/dashboard-visualization/toolbar/actions/ShowLinesAction";
import { ShowLinearScaleAction } from "src/components/dashboard-visualization/toolbar/actions/ShowLinearScaleAction";
import { ShowLogarithmicScaleAction } from "src/components/dashboard-visualization/toolbar/actions/ShowLogarithmicScaleAction";
import { DisableTooltipsAction } from "src/components/dashboard-visualization/toolbar/actions/DisableTooltipsAction";
import { EnableTooltipsAction } from "src/components/dashboard-visualization/toolbar/actions/EnableTooltipsAction";
import { HideMinimapAction } from "src/components/dashboard-visualization/toolbar/actions/HideMinimapAction";
import { ShowMinimapAction } from "src/components/dashboard-visualization/toolbar/actions/ShowMinimapAction";

type ToolbarActionTypesEnum =
  | "ResetZoom"
  | "SelectAllDataSeries"
  | "DeselectAllDataSeries"
  | "DoSomething"
  | "ControlSummary"
  | "ShowMarkers"
  | "HideMarkers"
  | "ControlSummary"
  | "ShowLinesAndPoints"
  | "LinesAndPointsDisabled"
  | "ShowLines"
  | "LinesDisabled"
  | "ShowBins"
  | "BinsDisabled"
  | "ShowLinearScale"
  | "ShowLogarithmicScale"
  | "EnableTooltips"
  | "DisableTooltips"
  | "HideMinimap"
  | "ShowMinimap";

type ToolbarActionTypes = ToolbarActionTypesEnum;

type ToolbarVisTargetTypes = VisTypes;

type ToolbarCanvasTargetTypes = "None" | "Some" | "All";

export type ToolbarTargetTypes = ToolbarVisTargetTypes | ToolbarCanvasTargetTypes;

export type ToolbarTypes = "ViewModeCanvas" | "EditModeCanvas" | "ViewModeNode" | "EditModeNode";

export type CanvasTypes = "NetworkCanvas" | "DashboardCanvas";

// Definition Types

export type ToolbarActionDefinition<A = ToolbarActionTypes> = {
  icon: React.ReactNode;
  name: string;
  actionType: A;
};

type KeyType<C = CanvasTypes, T = ToolbarTypes, V = ToolbarTargetTypes> = `${string & C}-${string & T}-${string & V}`;

type ToolbarsActionMap<
  C extends CanvasTypes,
  T extends ToolbarTypes,
  V extends ToolbarTargetTypes,
  A extends ToolbarActionTypes[]
> = {
  key: KeyType<C, T, V>;
  actionMap: {
    [K in A[number]]: ToolbarActionDefinition<K>;
  };
  actionOrder: {
    [K in A[number]]: number;
  };
};

// Action map
type ToolbarActionsType =
  | ToolbarsActionMap<"DashboardCanvas", "EditModeNode", TimeSeriesKey, []>
  | ToolbarsActionMap<
      "DashboardCanvas",
      "ViewModeNode",
      HistogramKey,
      [
        | "ResetZoom"
        | "ShowLinesAndPoints"
        | "LinesAndPointsDisabled"
        | "ShowLines"
        | "LinesDisabled"
        | "ShowBins"
        | "BinsDisabled"
        | "ShowLinearScale"
        | "ShowLogarithmicScale"
        | "ControlSummary"
        | "EnableTooltips"
        | "DisableTooltips"
        | "HideMinimap"
        | "ShowMinimap"
      ]
    >
  | ToolbarsActionMap<"DashboardCanvas", "EditModeNode", HistogramKey, []>
  | ToolbarsActionMap<
      "DashboardCanvas",
      "ViewModeNode",
      TimeSeriesKey,
      [
        (
          | "ResetZoom"
          | "DeselectAllDataSeries"
          | "SelectAllDataSeries"
          | "ControlSummary"
          | "ShowMarkers"
          | "HideMarkers"
          | "EnableTooltips"
          | "DisableTooltips"
          | "HideMinimap"
        ),
        "ShowMinimap"
      ]
    >
  | ToolbarsActionMap<"DashboardCanvas", "EditModeNode", Histogram3DKey, []>
  | ToolbarsActionMap<"DashboardCanvas", "ViewModeNode", Histogram3DKey, ["ControlSummary"]>;

const toolbarMap: ToolbarTargetActionsType = {
  "DashboardCanvas-ViewModeNode-TimeSeries": {
    key: "DashboardCanvas-ViewModeNode-TimeSeries",
    actionMap: {
      ResetZoom: ResetZoomAction,
      DeselectAllDataSeries: DeselectAllDataSeriesAction,
      SelectAllDataSeries: SelectAllDataSeriesAction,
      ControlSummary: ControlSummaryAction,
      ShowMarkers: ShowMarkersAction,
      HideMarkers: HideMarkersAction,
      DisableTooltips: DisableTooltipsAction,
      EnableTooltips: EnableTooltipsAction,
      HideMinimap: HideMinimapAction,
      ShowMinimap: ShowMinimapAction
    },
    actionOrder: {
      ResetZoom: 1,
      DeselectAllDataSeries: 2,
      SelectAllDataSeries: 3,
      ShowMarkers: 4,
      HideMarkers: 5,
      DisableTooltips: 6,
      EnableTooltips: 7,
      HideMinimap: 8,
      ShowMinimap: 9,
      ControlSummary: 10
    }
  },
  "DashboardCanvas-EditModeNode-TimeSeries": {
    key: "DashboardCanvas-EditModeNode-TimeSeries",
    actionMap: {},
    actionOrder: {}
  },
  "DashboardCanvas-EditModeNode-Histogram": {
    key: "DashboardCanvas-EditModeNode-Histogram",
    actionMap: {},
    actionOrder: {}
  },
  "DashboardCanvas-ViewModeNode-Histogram": {
    key: "DashboardCanvas-ViewModeNode-Histogram",
    actionMap: {
      ResetZoom: ResetZoomAction,
      ShowBins: ShowBinsAction,
      BinsDisabled: BinsDisabledAction,
      ShowLines: ShowLinesAction,
      LinesDisabled: LinesDisabledAction,
      ShowLinesAndPoints: ShowLinesAndPointsAction,
      LinesAndPointsDisabled: LinesAndPointsDisabledAction,
      ShowLinearScale: ShowLinearScaleAction,
      ShowLogarithmicScale: ShowLogarithmicScaleAction,
      ControlSummary: ControlSummaryAction,
      DisableTooltips: DisableTooltipsAction,
      EnableTooltips: EnableTooltipsAction,
      HideMinimap: HideMinimapAction,
      ShowMinimap: ShowMinimapAction
    },
    actionOrder: {
      ResetZoom: 1,
      ShowBins: 2,
      BinsDisabled: 3,
      ShowLines: 4,
      LinesDisabled: 5,
      ShowLinesAndPoints: 6,
      LinesAndPointsDisabled: 7,
      ShowLinearScale: 8,
      ShowLogarithmicScale: 9,
      DisableTooltips: 10,
      EnableTooltips: 11,
      HideMinimap: 12,
      ShowMinimap: 13,
      ControlSummary: 14
    }
  },
  "DashboardCanvas-EditModeNode-Histogram3D": {
    key: "DashboardCanvas-EditModeNode-Histogram3D",
    actionMap: {},
    actionOrder: {}
  },
  "DashboardCanvas-ViewModeNode-Histogram3D": {
    key: "DashboardCanvas-ViewModeNode-Histogram3D",
    actionMap: {
      ControlSummary: ControlSummaryAction
    },
    actionOrder: {
      ControlSummary: 1
    }
  }
};

type ToolbarTargetActionsType = MapDiscriminatedUnion<ToolbarActionsType, "key">;

export type ToolbarTargetActionsKeys = keyof ToolbarTargetActionsType;

export type ToolbarActionCallbacks = {
  onClick: (() => void) | null;
  isVisible: (() => boolean) | null;
};

export type ToolbarActions<T> = T extends ToolbarTargetActionsKeys ? ToolbarTargetActionsType[T] : never;

type ActionMapKey<T> = T extends ToolbarTargetActionsKeys ? keyof ToolbarTargetActionsType[T]["actionMap"] : never;

export type ToolbarActionsHandlers<T = ToolbarTargetActionsKeys> = {
  [K in ActionMapKey<T>]: ToolbarActionCallbacks;
};

export type ToolbarSetActionsHandlers<T> = T extends ToolbarTargetActionsKeys
  ? {
      [K in keyof ToolbarTargetActionsType[T]["actionMap"] as `set${string & K}`]: (params: {
        callbacks: ToolbarActionCallbacks;
      }) => void;
    }
  : never;

export type ToolbarContextData<K extends ToolbarTargetActionsKeys> = {
  key: K;
  actions: ToolbarActions<K>;
  handlers: ToolbarActionsHandlers<K>;
  handlerSetters: ToolbarSetActionsHandlers<K>;
};

export type UseDashboardToolbarContextType<
  C extends CanvasTypes,
  T extends ToolbarTypes,
  V extends ToolbarTargetTypes
> = (canvasType: C, toolbarType: T, targetType: V) => ToolbarContextData<ToolbarTargetActionsKeys> | null;

export const toolbarTargetActions: ToolbarTargetActionsType = typedObjectKeys(toolbarMap).reduce((result, key) => {
  const entry = toolbarMap[key];
  return entry
    ? {
        ...result,
        [`${entry.key}`]: entry
      }
    : result;
}, {} as ToolbarTargetActionsType);

export type NodeToolbarProps = {
  show: boolean;
  actions: ToolbarActions<ToolbarTargetActionsKeys>;
  handlers: ToolbarActionsHandlers<ToolbarTargetActionsKeys>;
  name: string;
  locked: boolean;
  selected: boolean;
};

export type NodeToolbarContextType = Context<ToolbarContextData<ToolbarTargetActionsKeys>>;
