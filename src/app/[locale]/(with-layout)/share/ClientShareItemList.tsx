"use client";

import { shareApi } from "@/apis/share";
import { useInfiniteQuery } from "@tanstack/react-query";
import ShareItem from "./ShareItem";
import { Button } from "@/components/ui/button";
import { useAgo } from "@/hooks/useAgo";

const PAGE_SIZE = 20;

export default function ClientShareItemList() {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["shareApi.getList"],
    queryFn: ({ pageParam }) =>
      shareApi.getList({ page: pageParam, size: PAGE_SIZE }).then((response) => response.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    gcTime: 0,
  });

  const shareItems = data?.pages.flatMap((page) => page.items) ?? [];

  const { ago } = useAgo();

  return (
    <>
      {shareItems.map((item) => (
        <ShareItem
          key={item.id}
          id={item.id}
          title={item.title}
          legalDong={item.legalDong}
          photoUrls={item.photoUrls}
          date={ago(item.createdDate)}
        />
      ))}
      {hasNextPage && (
        <div className="col-span-full flex justify-center py-2">
          <Button disabled={isFetchingNextPage} onClick={() => fetchNextPage()} variant="outline">
            {isFetchingNextPage ? "불러오는 중..." : "더보기"}
          </Button>
        </div>
      )}
    </>
  );
}
