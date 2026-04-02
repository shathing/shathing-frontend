"use client";

import { shareApi } from "@/apis/share";
import useGetMe from "@/hooks/apis/useGetMe";
import { useRouter } from "@/i18n/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import StartChatButton from "./StartChatButton";

type ShareActionButtonsProps = {
  shareItemId: number;
  ownerMemberId: number;
  chatLabel: string;
  editLabel: string;
  deleteLabel: string;
  deleteConfirmMessage: string;
  deleteSuccessMessage: string;
  deleteErrorMessage: string;
};

export default function ShareActionButtons({
  shareItemId,
  ownerMemberId,
  chatLabel,
  editLabel,
  deleteLabel,
  deleteConfirmMessage,
  deleteSuccessMessage,
  deleteErrorMessage,
}: ShareActionButtonsProps) {
  const router = useRouter();
  const { data: me } = useGetMe();
  const meRecord = (typeof me === "object" && me !== null ? me : undefined) as Record<string, unknown> | undefined;
  const toNumericValue = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return undefined;
  };
  const myMemberId =
    toNumericValue(meRecord?.memberId) ?? toNumericValue(meRecord?.id) ?? toNumericValue(meRecord?.userId);
  const isMine = typeof myMemberId === "number" && myMemberId === ownerMemberId;

  const { mutate: deleteSharedItem, isPending: isDeleting } = useMutation({
    mutationFn: () => shareApi.delete(shareItemId),
    onSuccess: () => {
      toast.success(deleteSuccessMessage);
      router.push("/share");
    },
    onError: () => {
      toast.error(deleteErrorMessage);
    },
  });

  const handleDelete = () => {
    if (!window.confirm(deleteConfirmMessage)) return;
    deleteSharedItem();
  };

  if (!isMine) {
    return <StartChatButton label={chatLabel} otherMemberId={ownerMemberId} />;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        className="h-10 text-base font-semibold"
        variant="outline"
        onClick={() => router.push(`/post?id=${shareItemId}`)}
      >
        {editLabel}
      </Button>
      <Button
        className="h-10 text-base font-semibold"
        variant="destructive"
        disabled={isDeleting}
        onClick={handleDelete}
      >
        {deleteLabel}
      </Button>
    </div>
  );
}
