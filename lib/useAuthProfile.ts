"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type Profile } from "./api";

export function useAuthProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    api<Profile>("/api/profile/me").then((res) => {
      if (!res.data) {
        router.replace("/auth");
        return;
      }
      if (!res.data.onboardingCompleted) {
        router.replace("/onboarding");
        return;
      }
      setProfile(res.data);
    });
  }, [router]);

  return profile;
}
