// Environment detection
export const isLocalTest =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "" ||
  window.location.protocol === "file:";

// Ad slot paths mapped according to environments
export const AD_SLOT_PATHS = isLocalTest
  ? {
      banner1: "/6355419/Travel/Europe/France/Paris",
      banner2: "/6355419/Travel/Europe/France",
      banner3: "/6355419/Travel/Europe",
      interstitial: "/6355419/Travel/Europe/Italy",
      anchor: "/6355419/Travel",
      rewarded: "/22601054/gift-cards",
    }
  : {
      banner1: "/22846411849,23358456112/JBM_parivahanindia.com_Banner1_new",
      banner2: "/22846411849,23358456112/JBM_parivahanindia.com_Banner2_new",
      banner3: "/22846411849,23358456112/JBM_parivahanindia.com_Banner2_new", // Re-uses Banner 2 path for banner3
      interstitial: "/22846411849,23358456112/JBM_parivahanindia.com_Inter_new",
      anchor: "/22846411849,23358456112/JBM_parivahanindia.com_Anchor_new",
      rewarded: "/22846411849,23358456112/JBM_parivahanindia.com_Rewarded_new",
    };

// Pre-defined size configs for slots
export const AD_SLOT_SIZES = {
  banner1: [[300, 250], "fluid", [336, 280]],
  banner2: [[300, 250], "fluid", [336, 280]],
  banner3: [[300, 250], "fluid", [336, 280]],
  interstitial: [[1, 1], [300, 250], [320, 480], [480, 320], [336, 280]],
  anchor: [1, 1],
  rewarded: [[480, 320], [300, 100], [300, 75], [300, 50], [320, 480]],
};
