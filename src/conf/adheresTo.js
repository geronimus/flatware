import confConformsWith from "./conformsWith";
import { confReport } from "./report";
import { validateSpec } from "../spec/validate";

function confAdheresTo( spec, conf ) {
  
  const report = confConformsWith( spec, conf );

  if (
    report.missing.length > 0 ||
      Object.keys( report.extra ).length > 0
  )
    report.result = false;

  return report;
}

export default confAdheresTo;

