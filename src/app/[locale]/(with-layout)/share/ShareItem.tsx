import type { ShareItem as ShareItemModel } from "@/types/models/share-item";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "@/i18n/navigation";
import ImageR2 from "@/components/ImageR2";

type ShareItemProps = Pick<ShareItemModel, "id" | "title" | "photoUrls" | "region"> & {
  date: string;
};

export default function ShareItem({ id, title, photoUrls, date, region }: ShareItemProps) {
  return (
    <Link className="flex flex-row sm:flex-col cursor-pointer group" href={`/share/${id.toString()}`}>
      <div className="max-sm:w-20 max-sm:min-w-20 rounded-lg overflow-hidden">
        <AspectRatio ratio={1 / 1}>
          <ImageR2
            src={photoUrls[0]}
            alt={title}
            fill
            className="w-full rounded-lg object-cover dark:brightness-80 group-hover:scale-105 transition-transform duration-300"
          />
        </AspectRatio>
      </div>
      <div className="flex gap-1 flex-col p-1 overflow-hidden">
        <h2 className="text-xl font-semibold truncate">{title}</h2>
        <div className="flex gap-1 text-sm text-muted-foreground">
          <span>{region.name}</span>
          <span>·</span>
          <time>{date}</time>
        </div>
      </div>
    </Link>
  );
}
