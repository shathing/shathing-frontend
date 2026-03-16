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
import type { LegalDong } from "@/types/models/legal-dong";
import { RotateCcw } from "lucide-react";
import { ReactNode, useState } from "react";

const MAX_SUB_DEPTH = 2;

export default function LegalDong() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<LegalDong | null>(null);
  const { data, isPending, isError, refetch } = useGetLegalDongs({ enabled: menuOpen });
  const legalDongs = data ?? [];

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{selected?.name ?? "위치"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <MenuFetchState
            emptyLabel="선택 가능한 시/도가 없습니다."
            isError={isError}
            isPending={isPending}
            isEmpty={legalDongs.length === 0}
            onRetry={() => refetch()}
          >
            {legalDongs.map((dong) => (
              <LegalDongSubMenu depth={1} key={dong.code} parent={dong} onSelect={setSelected} />
            ))}
          </MenuFetchState>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LegalDongSubMenu({
  parent,
  depth,
  onSelect,
}: {
  parent: LegalDong;
  depth: number;
  onSelect: (dong: LegalDong) => void;
}) {
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
          emptyLabel={isLeafDepth ? "선택 가능한 동이 없습니다." : "선택 가능한 하위 지역이 없습니다."}
          isError={isError}
          isPending={isPending}
          isEmpty={children.length === 0}
          onRetry={() => refetch()}
        >
          {isLeafDepth
            ? children.map((child) => (
                <DropdownMenuItem key={child.code} onSelect={() => onSelect(child)}>
                  {child.name}
                </DropdownMenuItem>
              ))
            : children.map((child) => (
                <LegalDongSubMenu depth={depth + 1} key={child.code} parent={child} onSelect={onSelect} />
              ))}
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
