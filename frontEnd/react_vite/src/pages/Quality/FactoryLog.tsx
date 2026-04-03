import React from "react";

import {  DDSLink } from '@dds/react';

const FactoryLog: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <DDSLink href="https://rptpwpenweb01.apac.dell.com:8444/">
  Factory Log Analysis Tool
</DDSLink>
<h4>Demo:</h4>
<DDSLink href="https://dell.sharepoint.com/sites/GCSAutomationTransformationProgram/_layouts/15/stream.aspx?id=%2Fsites%2FGCSAutomationTransformationProgram%2FShared%20Documents%2FGeneral%2FDemo%20Library%2FAutomation%20tool%20for%20Factory%20Log%20Analysis%2Emp4&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2Ee9bac71e%2D7d7c%2D4a94%2Da5ae%2D2236bf3c70b6">
  Automation tool for Factory Log Analysis
</DDSLink>
    </div>
  );
};

export default FactoryLog;