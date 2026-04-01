"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Region from "@/components/Region";
import Category from "@/components/Category";
import { useTranslations } from "next-intl";
import type { Region as RegionT } from "@/types/models/region";
import type { Category as CategoryT } from "@/types/models/category";
import { useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export default function SearchBar({
  region,
  category,
  search,
}: {
  region?: RegionT;
  category?: CategoryT;
  search?: string;
}) {
  const t = useTranslations("Share");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(search ?? "");
  const submitSearch = () => {
    const nextSearch = keyword.trim();
    const currentSearch = searchParams.get("search") ?? "";
    if (nextSearch === currentSearch) return;

    const query = Object.fromEntries(searchParams.entries());
    if (nextSearch) {
      query.search = nextSearch;
    } else {
      delete query.search;
    }

    router.replace({ pathname, query });
  };

  return (
    <Card className="sticky top-2.5 bg-background/70 backdrop-blur-lg py-3 z-10">
      <CardContent className="flex gap-1 px-3">
        <Region isSearch region={region} />
        <Category isSearch category={category} />
        <Input
          placeholder={t("search-placeholder")}
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            submitSearch();
          }}
        />
        <Button type="button" onClick={submitSearch}>
          {t("search-button")}
        </Button>
      </CardContent>
    </Card>
  );
}
