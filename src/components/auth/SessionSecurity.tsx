import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const MAX_SESSION_MS = 8 * 60 * 60 * 1000;
const SESSION_STARTED_AT_KEY = "primeiro-reino-session-started-at";

export async function signOutEverywhere() {
  await supabase.auth.signOut({ scope: "global" });
  window.location.replace("/auth");
}

export function SessionSecurity() {
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let maxSessionTimer: ReturnType<typeof setTimeout> | undefined;
    let currentUserId: string | undefined;

    const clearTimers = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (maxSessionTimer) clearTimeout(maxSessionTimer);
    };

    const signOutForInactivity = async () => {
      clearTimers();
      await supabase.auth.signOut({ scope: "local" });
      window.location.replace("/auth");
    };

    const scheduleTimers = (userId: string) => {
      currentUserId = userId;
      const storedValue = localStorage.getItem(SESSION_STARTED_AT_KEY);
      const [storedUserId, storedStartedAtValue] = storedValue?.split(":") ?? [];
      const storedStartedAt = storedUserId === userId ? Number(storedStartedAtValue) : 0;
      const startedAt =
        Number.isFinite(storedStartedAt) && storedStartedAt > 0 ? storedStartedAt : Date.now();
      localStorage.setItem(SESSION_STARTED_AT_KEY, `${userId}:${startedAt}`);

      clearTimers();
      idleTimer = setTimeout(signOutForInactivity, IDLE_TIMEOUT_MS);
      maxSessionTimer = setTimeout(
        signOutForInactivity,
        Math.max(0, MAX_SESSION_MS - (Date.now() - startedAt)),
      );
    };

    const handleActivity = () => {
      if (!currentUserId) return;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(signOutForInactivity, IDLE_TIMEOUT_MS);
    };

    const activityEvents = ["pointerdown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true }),
    );

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.id) scheduleTimers(data.session.user.id);
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        clearTimers();
        currentUserId = undefined;
        localStorage.removeItem(SESSION_STARTED_AT_KEY);
      } else if (session?.user.id) {
        scheduleTimers(session.user.id);
      }
    });
    const authSubscription = data.subscription;

    return () => {
      clearTimers();
      activityEvents.forEach((event) => window.removeEventListener(event, handleActivity));
      authSubscription?.unsubscribe();
    };
  }, []);

  return null;
}
