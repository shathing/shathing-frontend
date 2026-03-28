"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import useGetLegalDongs from "@/hooks/apis/useGetLegalDongs";
import { useShareSelectionStore } from "@/stores/share-selection";
import type { Location } from "@/types/models/location";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";

const MAX_SUB_DEPTH = 2;

export default function LegalDong() {
  const t = useTranslations("Share");
  const [menuOpen, setMenuOpen] = useState(false);
  const selected = useShareSelectionStore((state) => state.selectedLegalDong);
  const { data, isPending, isError, refetch } = useGetLegalDongs({ enabled: menuOpen });
  const legalDongs = data ?? [];

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{selected?.name ?? t("location")}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <MenuFetchState
            emptyLabel={t("location-empty-sido")}
            isError={isError}
            isPending={isPending}
            isEmpty={legalDongs.length === 0}
            onRetry={() => refetch()}
          >
            {legalDongs.map((dong) => (
              <LegalDongSubMenu depth={1} key={dong.code} parent={dong} />
            ))}
          </MenuFetchState>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LegalDongSubMenu({ parent, depth }: { parent: Location; depth: number }) {
  const t = useTranslations("Share");
  const setSelectedLegalDong = useShareSelectionStore((state) => state.setSelectedLegalDong);
  const [open, setOpen] = useState(false);
  const { data, isPending, isError, refetch } = useGetLegalDongs({
    code: parent.code,
    enabled: open,
  });
  const children = data ?? [];
  const isLeafDepth = depth >= MAX_SUB_DEPTH;

  return (
    <DropdownMenuSub onOpenChange={setOpen}>
      <DropdownMenuSubTrigger>{parent.name}</DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="max-h-(--radix-dropdown-menu-content-available-height) overflow-y-auto">
        <MenuFetchState
          emptyLabel={isLeafDepth ? t("location-empty-dong") : t("location-empty-children")}
          isError={isError}
          isPending={isPending}
          isEmpty={children.length === 0}
          onRetry={() => refetch()}
        >
          {isLeafDepth
            ? children.map((child) => (
                <DropdownMenuItem key={child.code} onSelect={() => setSelectedLegalDong(child)}>
                  {child.name}
                </DropdownMenuItem>
              ))
            : children.map((child) => <LegalDongSubMenu depth={depth + 1} key={child.code} parent={child} />)}
        </MenuFetchState>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

function MenuFetchState({
  isPending,
  isError,
  isEmpty,
  emptyLabel,
  onRetry,
  children,
}: {
  isPending: boolean;
  isError: boolean;
  isEmpty: boolean;
  emptyLabel: string;
  onRetry: () => void;
  children: ReactNode;
}) {
  if (isPending) {
    return (
      <DropdownMenuItem disabled className="justify-center">
        <Spinner />
      </DropdownMenuItem>
    );
  }

  if (isError) {
    return (
      <DropdownMenuItem variant="destructive" className="justify-center" onClick={onRetry}>
        <RotateCcw />
      </DropdownMenuItem>
    );
  }

  if (isEmpty) {
    return <DropdownMenuItem disabled>{emptyLabel}</DropdownMenuItem>;
  }

  return <>{children}</>;
}
