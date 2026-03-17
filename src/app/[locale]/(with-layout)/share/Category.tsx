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
import type { Category } from "@/types/models/category";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

export default function Category() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["categoryApi.getList"],
    queryFn: () => categoryApi.getList().then(({ data }) => data),
    enabled: menuOpen,
    staleTime: Infinity,
  });
  const categories = data ?? [];
  const selectedValue = selected ? selected.id.toString() : undefined;

  const handleValueChange = (value: string) => {
    const picked = categories.find((category) => category.id.toString() === value);
    if (picked) {
      setSelected(picked);
    }
  };

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild defaultValue="디지털기기">
        <Button variant="outline">{selected?.name ?? "카테고리"}</Button>
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
