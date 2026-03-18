import type { ShareItem as ShareItemModel } from "@/types/models/share-item";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export default function ShareItem({ shareItem }: { shareItem: ShareItemModel }) {
  const thumbnailUrl = process.env.NEXT_PUBLIC_R2_BASE_URL + shareItem.photoUrls[0];

  return (
    <div className="flex flex-row sm:flex-col cursor-pointer group">
      <div className="max-sm:w-20 max-sm:min-w-20 rounded-lg overflow-hidden">
        <AspectRatio ratio={1 / 1}>
          <Image
            src={thumbnailUrl}
            alt={shareItem.title}
            fill
            className="w-full rounded-lg object-cover dark:brightness-80 group-hover:scale-105 transition-transform duration-300"
          />
        </AspectRatio>
      </div>
      <div className="flex gap-1 flex-col p-1 overflow-hidden">
        <h2 className="text-xl font-semibold truncate">{shareItem.title}</h2>
        <div className="flex gap-1 text-sm text-muted-foreground">
          <span>{shareItem.legalDong.eupMyeonDongName}</span>
          <span>·</span>
          <time>{dayjs(shareItem.createdDate).fromNow()}</time>
        </div>
      </div>
    </div>
  );
}
