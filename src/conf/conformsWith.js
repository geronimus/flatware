import { confReport } from "./report";
import { validateSpec } from "../spec/validate";

function confConformsWith( spec, conf ) {

  validateSpec( spec );

  const report = confReport( conf, spec );

  if (
    Object.keys( report.illegal ).length > 0
  )
    report.result = false;
  else
    report.result = true;

  return report;
}

export default confConformsWith;

