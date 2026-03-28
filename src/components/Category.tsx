"use client";

import { categoryApi } from "@/apis/category";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useShareItemPostStore } from "@/stores/useShareItemPostStore";
import type { Category } from "@/types/models/category";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Category({ isSearch, category }: { isSearch?: boolean; category?: Category }) {
  const t = useTranslations("Share");
  const [menuOpen, setMenuOpen] = useState(false);
  const selectedCategory = useShareItemPostStore((state) => state.selectedCategory);
  const setSelectedCategory = useShareItemPostStore((state) => state.setSelectedCategory);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const countryCode = locale == "ko" ? "KR" : "US";
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["categoryApi.getList", countryCode],
    queryFn: () => categoryApi.getList(countryCode).then(({ data }) => data),
    enabled: menuOpen,
    staleTime: Infinity,
  });
  const categories = data ?? [];
  const selectedValue = isSearch ? category?.id.toString() : selectedCategory?.id.toString();
  const categoryText = isSearch ? (category?.name ?? t("category")) : (selectedCategory?.name ?? t("category"));

  const handleValueChange = (value: string) => {
    const picked = categories.find((category) => category.id.toString() === value);
    if (!picked) return;
    if (isSearch) {
      const prevQuery = Object.fromEntries(searchParams.entries());
      router.push({ pathname, query: { ...prevQuery, categoryId: picked.id } });
    } else {
      setSelectedCategory(picked);
    }
  };

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{categoryText}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={selectedValue} onValueChange={handleValueChange}>
          {isPending ? (
            <DropdownMenuItem disabled className="justify-center">
              <Spinner />
            </DropdownMenuItem>
          ) : isError ? (
            <DropdownMenuItem variant="destructive" className="justify-center" onClick={() => refetch()}>
              <RotateCcw />
            </DropdownMenuItem>
          ) : (
            categories.map((category) => (
              <DropdownMenuRadioItem key={category.id} value={category.id.toString()}>
                {category.name}
              </DropdownMenuRadioItem>
            ))
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
