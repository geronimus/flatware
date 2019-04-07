import { newSpec, specFromJSON, specFromObject, specFromTemplate } from "./spec";
import { newConf, confFromJSON, confFromObject, confFromTemplate } from "./conf";

function parseTemplate( template ) {
  
  return {
    spec: specFromTemplate( template ),
    conf: confFromTemplate( template )
  };
}

export default Object.freeze({
  parseTemplate,

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
  })
});

