"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";

export default function GoToBackBtn() {
  const router = useRouter();

  return (
    <Button className="w-fit" size="sm" variant="ghost" onClick={() => router.back()}>
      <ChevronLeft className="size-4" />
      목록
    </Button>
  );
}
