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
import { useShareItemPostStore } from "@/stores/useShareItemPostStore";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Category() {
  const t = useTranslations("Share");
  const [menuOpen, setMenuOpen] = useState(false);
  const selectedCategory = useShareItemPostStore((state) => state.selectedCategory);
  const setSelectedCategory = useShareItemPostStore((state) => state.setSelectedCategory);
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["categoryApi.getList"],
    queryFn: () => categoryApi.getList().then(({ data }) => data),
    enabled: menuOpen,
    staleTime: Infinity,
  });
  const categories = data ?? [];
  const selectedValue = selectedCategory?.id.toString();

  const handleValueChange = (value: string) => {
    const picked = categories.find((category) => category.id.toString() === value);
    if (picked) {
      setSelectedCategory(picked);
    }
  };

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{selectedCategory?.name ?? t("category")}</Button>
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
