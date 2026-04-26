'use client';
import { useEffect,useRef} from 'react';

const useTradingViewWidget = (scriptUrl: string,config: Record<string, unknown> ,height=600) => {
  const containerRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.dataset.loaded) return; // Prevent multiple loads
    containerRef.current.innerHTML=`<div class="tradingview-widget-container__widget" style="height: ${height}px; width: 100%;"></div>`
    
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.innerHTML = JSON.stringify(config);

    containerRef.current.appendChild(script);
    containerRef.current.dataset.loaded = "true"; // Mark as loaded

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""; // Clean up on unmount
        delete containerRef.current.dataset.loaded; // Reset loaded state
      }
    };

    
  }, [scriptUrl,config,height]);

  
  return containerRef;

}

export default useTradingViewWidget

// video at 52:00 mark