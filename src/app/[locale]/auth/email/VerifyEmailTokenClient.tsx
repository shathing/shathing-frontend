"use client";

import { authApi } from "@/apis/auth";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { ACCESS_TOKEN } from "@/constants/auth";

export default function VerifyEmailTokenClient({ token }: { token: string }) {
  const router = useRouter();
  const t = useTranslations("Auth");
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    const verifyToken = async () => {
      try {
        const { data } = await authApi.verifyToken({ token });
        if (!data.accessToken) {
          throw new Error("Access token is missing");
        }

        localStorage.setItem(ACCESS_TOKEN, data.accessToken);
        toast.success(t("success-verify-token"));
        router.replace("/");
      } catch {
        toast.error(t("fail-verify-token"));
        router.replace("/auth");
      }
    };

    void verifyToken();
  }, [router, t, token]);

  return (
    <div className="flex min-h-svh items-center justify-center p-6 text-sm text-muted-foreground">{t("verifying")}</div>
  );
}
