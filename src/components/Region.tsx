"use client";

import { regionApi } from "@/apis/region";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cn } from "@/lib/utils";
import { useShareItemPostStore } from "@/stores/useShareItemPostStore";
import type { Region } from "@/types/models/region";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export default function Region() {
  const t = useTranslations("Share");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue<string>(search, 300);
  const selectedRegion = useShareItemPostStore((state) => state.selectedRegion);
  const setSelectedRegion = useShareItemPostStore((state) => state.setSelectedRegion);
  const locale = useLocale();
  const countryCode = locale == "ko" ? "KR" : "US";

  const { data, isPending } = useQuery({
    queryKey: ["regionApi.getList", countryCode, debouncedSearch],
    enabled: open,
    queryFn: () => regionApi.getList({ countryCode, search: debouncedSearch || undefined }).then(({ data }) => data),
  });
  const regions = data ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{selectedRegion?.name ?? t("region")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("region-change-title")}</DialogTitle>
        </DialogHeader>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search-placeholder")} />
        <div className="h-80 overflow-y-auto rounded-md border">
          {isPending ? (
            <div className="flex items-center justify-center py-6 text-muted-foreground">
              <Spinner />
            </div>
          ) : regions.length === 0 ? (
            <div className="px-3 py-4 text-sm text-muted-foreground">{t("region-empty")}</div>
          ) : (
            regions.map((region) => {
              const isSelected = selectedRegion?.id === region.id;
              return (
                <button
                  type="button"
                  key={region.id}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent cursor-pointer",
                    isSelected && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => {
                    setSelectedRegion(region);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <span>{region.fullName}</span>
                  {isSelected && <CheckIcon className="size-4 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
