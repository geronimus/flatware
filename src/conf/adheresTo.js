import { confReport } from "./report";
import { validateSpec } from "../spec/validate";

function confAdheresTo( spec, conf ) {
  
  validateSpec( spec );

  const report = confReport( conf, spec );

  if (
    report.missing.length > 0 ||
      Object.keys( report.extra ).length > 0 ||
      Object.keys( report.illegal ).length > 0
  )
    report.result = false;
  else
    report.result = true;

  return report;
}

export default confAdheresTo;

