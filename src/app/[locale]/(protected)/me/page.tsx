"use client";

import { authApi } from "@/apis/auth";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data } = useQuery({
    queryKey: ["authApi.me"],
    queryFn: async () => {
      const { data } = await authApi.me();
      return data;
    },
  });

  const email = data?.email;
  console.log(email);

  return <div>{email}</div>;
}
