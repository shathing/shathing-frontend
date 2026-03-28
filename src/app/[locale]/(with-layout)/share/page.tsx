import SearchBar from "./SearchBar";
import { shareApi } from "@/apis/share";
import ShareItem from "./ShareItem";
import ClientShareItemList from "./ClientShareItemList";
import { getAgo } from "@/lib/getAgo";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { regionApi } from "@/apis/region";
import { categoryApi } from "@/apis/category";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string; regionId?: string }>;
}) {
  const t = await getTranslations("Share");
  const { categoryId, regionId } = await searchParams;
  let region = undefined;
  let category = undefined;
  let shareItems = null;
  const locale = await getLocale();

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
    if (categoryId) {
      try {
        const { data } = await categoryApi.getCategory({
          categoryId: Number(categoryId),
          countryCode: locale == "ko" ? "KR" : "US",
        });
        category = data;
      } catch (e) {
        console.error(e);
      }
    }
    const { data } = await shareApi.getList({
      categoryId: category ? categoryId : undefined,
      regionId: region ? regionId : undefined,
    });
    shareItems = data;
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="space-y-2.5 my-2.5 relative">
      <SearchBar region={region} category={category} />
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
