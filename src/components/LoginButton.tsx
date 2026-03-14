"use client";

import { Button } from "@/components/ui/button";
import useGetMe from "@/hooks/apis/useGetMe";
import { Link, usePathname } from "@/i18n/navigation";
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

export default function LoginButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");
  const shouldFetchMe = isAuthenticated && !isAuthRoute;
  const { data, isPending } = useGetMe({ enabled: shouldFetchMe });

  if (!shouldFetchMe) {
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
            <DropdownMenuItem asChild>
              <Link href="/me">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
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
