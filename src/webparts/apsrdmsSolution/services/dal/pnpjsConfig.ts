import { SPFI, spfi } from "@pnp/sp";
import { SPFx } from "@pnp/sp/presets/all";
import { WebPartContext } from "@microsoft/sp-webpart-base";


let _sp: SPFI | null = null;

// Setup the SPFI instance with SPFx context
export const setupSP = (context: WebPartContext): void => {
  _sp = spfi().using(SPFx(context));
};

export const getSPInstance = (): SPFI => {
  if (!_sp) {
    throw new Error("PnP SP is not initialized. Call setupSP(context) first.");
  }
  return _sp;
};