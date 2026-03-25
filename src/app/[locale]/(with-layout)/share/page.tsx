import SearchBar from "./SearchBar";
import { shareApi } from "@/apis/share";
import ShareItem from "./ShareItem";
import ClientShareItemList from "./ClientShareItemList";
import { getAgo } from "@/lib/getAgo";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("Share");
  let shareItems = null;

  const { ago } = await getAgo();

  try {
    const { data } = await shareApi.getList();
    shareItems = data;
  } catch {}

  return (
    <div className="space-y-2.5 my-2.5 relative">
      <SearchBar />
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
          <ClientShareItemList />
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
