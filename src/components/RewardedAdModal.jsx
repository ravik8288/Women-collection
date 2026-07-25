import { useEffect, useState } from "react";
import { AD_SLOT_PATHS, AD_SLOT_SIZES, isLocalTest } from "./AdConfig";

export default function RewardedAdModal({ isOpen, onClose }) {
  const [timeLeft, setTimeLeft] = useState(3);
  const [adStatus, setAdStatus] = useState("Loading Sponsor Ad...");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    // Reset state when opening
    setTimeLeft(3);
    setAdStatus("Loading Sponsor Ad...");
    setButtonDisabled(true);
    setIsEmpty(true);

    const googletag = window.googletag || { cmd: [] };
    let slot = null;
    const adUnitId = "div-gpt-ad-1782806472842-0";

    googletag.cmd.push(() => {
      const adPath = AD_SLOT_PATHS.rewarded;
      const adSizes = AD_SLOT_SIZES.rewarded;

      // Check if already defined
      const existingSlots = googletag.pubads().getSlots();
      const isAlreadyDefined = existingSlots.some(
        (s) => s.getSlotElementId() === adUnitId
      );

      if (isAlreadyDefined) {
        console.warn(`RewardedAdModal: Slot with ID "${adUnitId}" is already defined.`);
        return;
      }

      console.log(`RewardedAdModal: Defining rewarded ad slot`);
      slot = googletag.defineSlot(adPath, adSizes, adUnitId);
      if (slot) {
        slot.addService(googletag.pubads());
        googletag.display(adUnitId);
        googletag.pubads().refresh([slot]);
      }
    });

    // Handle render ended to see if ad was empty
    const handleSlotRender = (event) => {
      if (event.slot.getSlotElementId() === adUnitId) {
        setIsEmpty(event.isEmpty);
        if (event.isEmpty) {
          setAdStatus("No sponsor ad available. Click below to proceed.");
          setButtonDisabled(false); // Enable immediately if ad is empty
        } else {
          setAdStatus("Sponsor Ad Loaded!");
        }
      }
    };

    googletag.cmd.push(() => {
      googletag.pubads().addEventListener("slotRenderEnded", handleSlotRender);
    });

    // 3-second countdown timer
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setButtonDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerInterval);
      googletag.cmd.push(() => {
        googletag.pubads().removeEventListener("slotRenderEnded", handleSlotRender);
        if (slot) {
          console.log(`RewardedAdModal: Destroying rewarded ad slot`);
          googletag.destroySlots([slot]);
        }
      });
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div id="rewarded-ad-overlay" style={{ display: "flex" }}>
      <div className="rewarded-ad-box">
        {isEmpty && isLocalTest && (
          <div className="rewarded-test-placeholder" style={{
            width: "300px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--navy)",
            background: "rgba(185, 138, 75, 0.08)",
            border: "1.5px dashed var(--gold)",
            borderRadius: "12px",
            textAlign: "center",
            padding: "12px",
            fontFamily: "Manrope, sans-serif"
          }}>
            <strong style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "18px", color: "var(--gold)" }}>REWARDED SPONSOR SLOT</strong>
            <span style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>div-gpt-ad-1782806472842-0</span>
            <span style={{ fontSize: "9px", background: "#fff", border: "1px solid var(--gold)", color: "var(--gold)", padding: "2px 8px", borderRadius: "10px", marginTop: "8px", fontWeight: "700" }}>TEST ADVERTISING ACTIVE</span>
          </div>
        )}
        <div 
          id="div-gpt-ad-1782806472842-0" 
          style={{ 
            minWidth: "300px", 
            minHeight: "50px",
            display: isEmpty ? "none" : "block"
          }} 
        />
      </div>
      
      <div className="rewarded-title">{adStatus}</div>

      <button 
        id="rewarded-ad-close-btn"
        disabled={buttonDisabled}
        onClick={onClose}
        style={{
          marginTop: "20px",
          padding: "14px 28px",
          fontSize: "12px",
          fontWeight: "700",
          letterSpacing: "0.08em",
          color: "#ffffff",
          background: buttonDisabled ? "#4a5368" : "var(--navy, #151d30)",
          border: "1px solid var(--gold, #b98a4b)",
          borderRadius: "999px",
          cursor: buttonDisabled ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          boxShadow: buttonDisabled ? "none" : "0 10px 25px rgba(21, 29, 48, 0.2)",
          textTransform: "uppercase",
          fontFamily: "Manrope, sans-serif"
        }}
      >
        {buttonDisabled ? `Unlocking product in ${timeLeft}s...` : "Continue to Product"}
      </button>
    </div>
  );
}
