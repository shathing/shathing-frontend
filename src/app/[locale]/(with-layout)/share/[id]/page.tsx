import { shareApi } from "@/apis/share";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ImageR2 from "@/components/ImageR2";
import { notFound } from "next/navigation";
import GoToBackBtn from "./GoToBackBtn";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getAgo } from "@/lib/getAgo";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const { data: shareItem } = await shareApi.getById(Number(id));
  if (!shareItem) notFound();

  const locationLabel = [
    shareItem.legalDong.sidoName,
    shareItem.legalDong.sigunguName,
    shareItem.legalDong.eupMyeonDongName,
  ].join(" ");

  const { ago } = await getAgo();

  return (
    <div className="mb-5">
      <div className="pb-3">
        <GoToBackBtn />
      </div>
      <div className="sm:flex gap-5">
        <section className="w-full sm:w-1/2">
          <Carousel className="">
            <CarouselContent>
              {shareItem.photoUrls.map((url, idx) => (
                <CarouselItem key={idx}>
                  <AspectRatio ratio={1}>
                    <ImageR2
                      alt={shareItem.title}
                      className="object-cover rounded-lg"
                      fill
                      preload={idx == 1}
                      src={url}
                    />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-5" />
            <CarouselNext className="right-5" />
          </Carousel>
          <div>
            <div className="flex items-center gap-3 py-3">
              <Avatar size="lg">
                <AvatarFallback>{shareItem.member.username.trim().charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="text-sm font-semibold leading-none">{shareItem.member.username}</div>
                <div className="text-xs text-muted-foreground">{locationLabel}</div>
              </div>
            </div>
            {/* TODO: 채팅 */}
            <Button className="h-10 w-full text-base font-semibold">채팅으로 문의하기</Button>
          </div>
        </section>

        <section className="w-full sm:w-1/2">
          <article>
            <h1 className="text-2xl font-bold leading-snug tracking-tight md:text-3xl">{shareItem.title}</h1>
            <p className="text-sm text-muted-foreground">
              {shareItem.category.name} · {ago(shareItem.createdDate)}
            </p>
            <p>{shareItem.content}</p>
          </article>
        </section>
      </div>
    </div>
  );
}
