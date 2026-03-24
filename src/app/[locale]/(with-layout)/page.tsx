import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ShareThingsWordmark from "./ShareThingsWordmark";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

const stories = [
  {
    category: "캠핑용품 공유",
    title: "필요할 때만 빌려 쓰니 짐이 줄었어요",
    body: "캠핑 의자, 랜턴처럼 자주 쓰지 않는 물건은 동네에서 빌려 쓰고 바로 반납해요. 집도 가벼워지고 비용 부담도 줄었어요.",
  },
  {
    category: "생활가전 공유",
    title: "잠깐 필요한 가전, 구매 없이 해결",
    body: "행사 시즌에만 쓰는 음식 건조기나 스팀다리미를 공유해 쓰니, 비싸게 사두고 묵히는 일이 없어졌어요.",
  },
  {
    category: "육아용품 공유",
    title: "짧게 쓰는 용품을 이웃과 순환해요",
    body: "사용 기간이 짧은 유아용품을 동네에서 나눠 쓰면서 서로 필요한 시점에 자연스럽게 도움이 돼요.",
  },
  {
    category: "공구 공유",
    title: "한 번 쓸 공구를 쉽게 찾게 됐어요",
    body: "전동드릴처럼 가끔 필요한 물건을 주변에서 바로 빌릴 수 있어서, 작은 집수리도 훨씬 빨라졌어요.",
  },
];

const reasons = [
  {
    title: "가벼운 소비",
    body: "소유보다 사용에 집중하면, 같은 물건으로도 더 많은 사람이 필요한 순간을 해결할 수 있어요.",
  },
  {
    title: "가까운 연결",
    body: "동네 안에서 빌리고 반납하는 흐름이 자리 잡으면, 신뢰 있는 관계가 자연스럽게 생겨요.",
  },
  {
    title: "지속 가능한 순환",
    body: "물건 하나가 여러 사람에게 쓰이며 수명이 늘어나고, 불필요한 구매와 폐기를 줄일 수 있어요.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16 py-5">
      <section>
        <Card className="py-10 md:py-12">
          <CardContent className="space-y-6">
            <p className="text-sm font-semibold tracking-[0.12em]">ABOUT SHARING</p>
            <div className="space-y-4">
              <h1 className="text-4xl leading-[1.08] font-black tracking-tight md:text-6xl">
                <ShareThingsWordmark />
              </h1>
              <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed md:text-base">
                필요한 물건을 빌려쓰고, 당장 필요하지 않은 물건을 빌려줘 보세요.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/share">
                  물건 보러가기
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/share/post">공유 글 작성하기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-primary text-sm font-semibold">사용자 이야기</p>
          <h2 className="text-2xl leading-tight font-extrabold tracking-tight md:text-3xl">
            물건 공유를 만나고 달라진 일상
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {stories.map((story) => (
            <Card key={story.title} className="py-5">
              <CardHeader className="px-5">
                <p className="text-primary text-xs font-semibold">{story.category}</p>
                <CardTitle className="text-lg leading-snug">{story.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{story.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Card className="bg-muted/40 py-8">
          <CardHeader className="space-y-2">
            <p className="text-primary text-sm font-semibold">전문가에게 묻다</p>
            <CardTitle className="text-2xl leading-tight font-extrabold tracking-tight md:text-3xl">
              우리에게 물건 공유가 필요한 이유
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {reasons.map((reason) => (
                <Card key={reason.title} className="py-4">
                  <CardHeader className="px-5">
                    <CardTitle className="text-base font-bold">{reason.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{reason.body}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
