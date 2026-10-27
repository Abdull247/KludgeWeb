"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type Profile } from "./api";
import { cachedProfile, rememberProfile } from "./cache";

export function useAuthProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(cachedProfile);

  useEffect(() => {
    if (cachedProfile()) return;
    api<Profile>("/api/profile/me").then((res) => {
      if (!res.data) {
        router.replace("/auth");
        return;
      }
      if (!res.data.onboardingCompleted) {
        router.replace("/onboarding");
        return;
      }
      rememberProfile(res.data);
      setProfile(res.data);
    });
  }, [router]);

  return profile;
}
