// "use client";

// import { useEffect, useCallback } from "react";
// import { useAuthStore } from "@/store/useAuthStore";

// export default function ActivityTracker({ children }: { children: React.ReactNode }) {
//   const { resetInactivityTimer, user } = useAuthStore();

//   // Memoize the callback to prevent unnecessary useEffect reruns
//   const handleActivity = useCallback(() => {
//     if (user) resetInactivityTimer();
//   }, [resetInactivityTimer, user]);

//   useEffect(() => {
//     if (!user) return;

//     // Add event listeners
//     window.addEventListener("mousemove", handleActivity);
//     window.addEventListener("keydown", handleActivity);
//     window.addEventListener("click", handleActivity);
//     window.addEventListener("touchstart", handleActivity);

//     // Start timer initially
//     handleActivity();

//     return () => {
//       window.removeEventListener("mousemove", handleActivity);
//       window.removeEventListener("keydown", handleActivity);
//       window.removeEventListener("click", handleActivity);
//       window.removeEventListener("touchstart", handleActivity);
//     };
//   }, [handleActivity, user]);

//   return <>{children}</>;
// }
