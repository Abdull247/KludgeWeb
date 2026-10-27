"use client";

import { useEffect, useState } from "react";
import { api, type Profile } from "./api";

export function useSession() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [known, setKnown] = useState(false);

  useEffect(() => {
    let live = true;
    api<Profile>("/api/profile/me").then((res) => {
      if (!live) return;
      setProfile(res.data ?? null);
      setKnown(true);
    });
    return () => {
      live = false;
    };
  }, []);

  return { profile, known };
}
