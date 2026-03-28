import SearchBar from "./SearchBar";
import { shareApi } from "@/apis/share";
import ShareItem from "./ShareItem";
import ClientShareItemList from "./ClientShareItemList";
import { getAgo } from "@/lib/getAgo";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { regionApi } from "@/apis/region";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string; regionId?: string }>;
}) {
  const t = await getTranslations("Share");
  const { categoryId, regionId } = await searchParams;
  let region = undefined;
  let shareItems = null;

  const { ago } = await getAgo();

  try {
    if (regionId) {
      try {
        const { data } = await regionApi.getRegion(Number(regionId));
        region = data;
      } catch (e) {
        console.error(e);
      }
    }
    console.log("region", region);
    const { data } = await shareApi.getList({ categoryId, regionId: region ? regionId : undefined });
    shareItems = data;
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="space-y-2.5 my-2.5 relative">
      <SearchBar region={region} />
      {shareItems ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {shareItems?.items.map((item) => (
            <ShareItem
              key={item.id}
              id={item.id}
              title={item.title}
              legalDong={item.legalDong}
              photoUrls={item.photoUrls}
              date={ago(item.createdDate)}
            />
          ))}
          <ClientShareItemList categoryId={categoryId} regionId={region?.id.toString()} />
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t("empty-title")}</EmptyTitle>
            <EmptyDescription>{t("empty-description")}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/post">{t("create-post")}</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
