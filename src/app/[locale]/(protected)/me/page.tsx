"use client";

import { authApi } from "@/apis/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data, isPending } = useQuery({
    queryKey: ["authApi.me"],
    queryFn: () => authApi.me().then(({ data }) => data),
  });

  const email = data?.email ?? "-";
  const username = data?.username ?? "-";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>내정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">유저네임</p>
              <p className="text-sm font-medium break-all">{isPending ? <Spinner /> : username}</p>
            </div>
            <Separator orientation="horizontal" />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">이메일</p>
              <p className="text-sm font-medium break-all">{isPending ? <Spinner /> : email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
