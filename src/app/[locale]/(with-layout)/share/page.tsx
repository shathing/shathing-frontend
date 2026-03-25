import SearchBar from "./SearchBar";
import { shareApi } from "@/apis/share";
import ShareItem from "./ShareItem";
import ClientShareItemList from "./ClientShareItemList";
import { getAgo } from "@/lib/getAgo";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function Page() {
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
            <EmptyTitle>아직 공유된 물건이 없습니다.</EmptyTitle>
            <EmptyDescription>직접 등록해 보는건 어떠신가요?</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/share/post">등록하기</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
