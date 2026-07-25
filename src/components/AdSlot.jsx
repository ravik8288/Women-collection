import { useEffect, useState } from "react";
import { AD_SLOT_PATHS, AD_SLOT_SIZES, isLocalTest } from "./AdConfig";

export default function AdSlot({ type, id, style, className }) {
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    // Ensure googletag is defined
    const googletag = window.googletag || { cmd: [] };
    let slot = null;

    googletag.cmd.push(() => {
      const adPath = AD_SLOT_PATHS[type];
      const adSizes = AD_SLOT_SIZES[type];
      
      if (!adPath || !adSizes) {
        console.warn(`AdSlot: Missing configuration for type "${type}"`);
        return;
      }

      // Check if slot with this ID has already been defined to avoid collisions
      const existingSlots = googletag.pubads().getSlots();
      const isAlreadyDefined = existingSlots.some(
        (s) => s.getSlotElementId() === id
      );

      if (isAlreadyDefined) {
        console.warn(`AdSlot: Slot with ID "${id}" is already defined. Skipping.`);
        return;
      }

      console.log(`AdSlot: Defining slot for ${type} with ID ${id}`);
      slot = googletag.defineSlot(adPath, adSizes, id);
      if (slot) {
        slot.addService(googletag.pubads());
        
        // Display slot
        googletag.display(id);
        
        // Request the ad immediately
        googletag.pubads().refresh([slot]);
      }
    });

    // Event listener to check if ad slot loaded successfully or returned empty
    const handleSlotRender = (event) => {
      if (event.slot.getSlotElementId() === id) {
        console.log(`AdSlot: Render ended for ${id}, empty: ${event.isEmpty}`);
        setIsEmpty(event.isEmpty);
      }
    };

    googletag.cmd.push(() => {
      googletag.pubads().addEventListener("slotRenderEnded", handleSlotRender);
    });

    return () => {
      googletag.cmd.push(() => {
        googletag.pubads().removeEventListener("slotRenderEnded", handleSlotRender);
        if (slot) {
          console.log(`AdSlot: Destroying slot ${id}`);
          googletag.destroySlots([slot]);
        }
      });
    };
  }, [type, id]);

  // Render container
  return (
    <div 
      className={`ad-container-outer ${className || ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        margin: "24px 0",
      }}
    >
      {/* If it's empty and we are testing locally, show a beautiful developer placeholder */}
      {isEmpty && isLocalTest && (
        <div 
          className="test-ad-placeholder"
          style={{
            border: "1.5px dashed var(--gold, #b98a4b)",
            borderRadius: "16px",
            background: "rgba(185, 138, 75, 0.05)",
            padding: "20px",
            textAlign: "center",
            width: "320px",
            minHeight: "250px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(21, 29, 48, 0.04)",
          }}
        >
          <span className="eyebrow gold" style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>
            Test Advertisement
          </span>
          <h4 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "19px", fontWeight: "600", margin: "0 0 6px 0", color: "var(--navy)" }}>
            {type.toUpperCase()}
          </h4>
          <p style={{ margin: "4px 0", fontSize: "11px", color: "var(--muted)", wordBreak: "break-all" }}>
            <b>ID:</b> {id}
          </p>
          <p style={{ margin: "2px 0", fontSize: "10px", color: "var(--muted)", opacity: 0.8 }}>
            Sizes: {JSON.stringify(AD_SLOT_SIZES[type])}
          </p>
          <span style={{ marginTop: "12px", display: "inline-block", padding: "4px 10px", borderRadius: "999px", background: "#fff", border: "1px solid #e8cda8", fontSize: "10px", color: "var(--gold)" }}>
            Local Test Active
          </span>
        </div>
      )}

      {/* Actual Google Ad Manager Target Element */}
      <div 
        id={id} 
        style={{ 
          ...style, 
          display: isEmpty ? "none" : "block",
          margin: "0 auto"
        }} 
      />
    </div>
  );
}
