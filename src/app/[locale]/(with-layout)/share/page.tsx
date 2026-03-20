import SearchBar from "./SearchBar";
import { shareApi } from "@/apis/share";
import ShareItem from "./ShareItem";
import ClientShareItemList from "./ClientShareItemList";
import { getAgo } from "@/lib/getAgo";

export default async function Page() {
  const { data } = await shareApi.getList();
  const { ago } = await getAgo();

  return (
    <div className="space-y-2.5 my-2.5 relative">
      <SearchBar />
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.items.map((item) => (
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
    </div>
  );
}
