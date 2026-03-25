"use client";

import { authApi } from "@/apis/auth";
import { Button } from "@/components/ui/button";
import useGetMe from "@/hooks/apis/useGetMe";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";

export default function LoginButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  const t = useTranslations("Header");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isPending } = useGetMe({ enabled: isAuthenticated });

  const logout = async () => {
    try {
      await authApi.logout();
      queryClient.removeQueries({ queryKey: ["authApi.me"] });
      router.refresh();
    } catch {}
  };

  if (!isAuthenticated) {
    return (
      <Button asChild>
        <Link href="/auth">{t("login")}</Link>
      </Button>
    );
  }

  if (isPending)
    return (
      <div className="flex items-center justify-center size-9">
        <Spinner />
      </div>
    );

  if (data) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/me">{t("profile")}</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={logout}>
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button asChild>
      <Link href="/auth">{t("login")}</Link>
    </Button>
  );
}
