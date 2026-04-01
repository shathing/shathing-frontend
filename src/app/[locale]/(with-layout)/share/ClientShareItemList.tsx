"use client";

import { shareApi } from "@/apis/share";
import { useInfiniteQuery } from "@tanstack/react-query";
import ShareItem from "./ShareItem";
import { Button } from "@/components/ui/button";
import { useAgo } from "@/hooks/useAgo";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";

const PAGE_SIZE = 20;

export default function ClientShareItemList({
  categoryId,
  regionId,
  search,
}: {
  categoryId?: string;
  regionId?: string;
  search?: string;
}) {
  const t = useTranslations("Share");
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["shareApi.getList", categoryId, regionId, search],
    queryFn: ({ pageParam }) =>
      shareApi
        .getList({ page: pageParam, size: PAGE_SIZE, categoryId, regionId, search })
        .then((response) => response.data),
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
          region={item.region}
          photoUrls={item.photoUrls}
          date={ago(item.createdDate)}
        />
      ))}
      {hasNextPage && (
        <div className="col-span-full flex justify-center py-2">
          <Button disabled={isFetchingNextPage} onClick={() => fetchNextPage()} variant="outline">
            {isFetchingNextPage ? <Spinner /> : t("load-more")}
          </Button>
        </div>
      )}
    </>
  );
}
