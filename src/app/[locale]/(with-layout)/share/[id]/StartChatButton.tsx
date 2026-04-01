"use client";

import { chatApi } from "@/apis/chat";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

type StartChatButtonProps = {
  otherMemberId: number;
  label: string;
};

export default function StartChatButton({ otherMemberId, label }: StartChatButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const onClick = async () => {
    if (isPending) return;

    setIsPending(true);
    try {
      const { data } = await chatApi.createRoom({ otherMemberId });
      router.push(`/chat/${data.id}`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button className="h-10 w-full text-base font-semibold" disabled={isPending} onClick={onClick}>
      {label}
    </Button>
  );
}
