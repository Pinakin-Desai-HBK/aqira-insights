import {
  CursorModifier,
  IZoomPanModifierOptions,
  ModifierMouseArgs,
  RolloverModifier,
  ZoomPanModifier
} from "scichart";

export class DisableTooltipZoomPanModifier extends ZoomPanModifier {
  cursorModifiers: (CursorModifier | RolloverModifier)[];
  wasShowingTooltip: boolean[] = [];
  wasEnabled: boolean[] = [];

  constructor(cursorModifiers: (CursorModifier | RolloverModifier)[], options?: IZoomPanModifierOptions) {
    super(options);
    this.cursorModifiers = cursorModifiers;
  }

  override modifierMouseUp(args: ModifierMouseArgs) {
    super.modifierMouseUp(args);
    this.cursorModifiers.forEach((cursorModifier, i) => {
      cursorModifier.isEnabled = this.wasEnabled[i] || false;
      cursorModifier.showTooltip = this.wasShowingTooltip[i] || false;
    });
  }

  override modifierMouseDown(args: ModifierMouseArgs) {
    super.modifierMouseDown(args);

    this.wasShowingTooltip = this.cursorModifiers.map((cursorModifier) => cursorModifier.showTooltip);
    this.wasEnabled = this.cursorModifiers.map((cursorModifier) => cursorModifier.isEnabled);
    this.cursorModifiers.forEach((cursorModifier) => {
      cursorModifier.isEnabled = false;
      cursorModifier.showTooltip = false;
      cursorModifier.modifierMouseLeave(args);
    });
  }
}
