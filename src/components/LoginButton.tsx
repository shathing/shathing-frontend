"use client";

import { authApi } from "@/apis/auth";
import { Button } from "@/components/ui/button";
import useGetMe from "@/hooks/apis/useGetMe";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  if (isPending) return <Spinner />;

  if (data) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/me">Profile</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={logout}>
              Log out
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
