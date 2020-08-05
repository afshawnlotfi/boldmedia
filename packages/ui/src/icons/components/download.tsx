import * as React from "react";

function SvgDownload(props: React.SVGProps<SVGSVGElement>) {
  return <svg height="100%" viewBox="0 0 24 24" width="100%" {...props}><path /><path d="M12 16.5l4-4h-3v-9h-2v9H8l4 4zm9-13h-6v1.99h6v14.03H3V5.49h6V3.5H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2z" /></svg>;
}

export default SvgDownload;