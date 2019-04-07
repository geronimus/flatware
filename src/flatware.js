import { newSpec, specFromJSON, specFromObject, specFromTemplate } from "./spec";
import { newConf, confFromJSON, confFromObject, confFromTemplate } from "./conf";

export default Object.freeze({
  spec: Object.freeze({
    new: newSpec,
    fromObject: specFromObject,
    fromJSON: specFromJSON,
    fromTemplate: specFromTemplate
  }),

  conf: Object.freeze({
    new: newConf,
    fromObject: confFromObject,
    fromJSON: confFromJSON,
    fromTemplate: confFromTemplate
  }),
});

