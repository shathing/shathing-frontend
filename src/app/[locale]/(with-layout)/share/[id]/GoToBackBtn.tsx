"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function GoToBackBtn() {
  const router = useRouter();
  const t = useTranslations("Share");

  return (
    <Button className="w-fit" size="sm" variant="ghost" onClick={() => router.back()}>
      <ChevronLeft className="size-4" />
      {t("back-to-list")}
    </Button>
  );
}
