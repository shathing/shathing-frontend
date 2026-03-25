import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ShareThingsWordmark from "./ShareThingsWordmark";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("Home");
  const stories = [
    {
      category: t("stories.items.camping.category"),
      title: t("stories.items.camping.title"),
      body: t("stories.items.camping.body"),
    },
    {
      category: t("stories.items.appliance.category"),
      title: t("stories.items.appliance.title"),
      body: t("stories.items.appliance.body"),
    },
    {
      category: t("stories.items.childcare.category"),
      title: t("stories.items.childcare.title"),
      body: t("stories.items.childcare.body"),
    },
    {
      category: t("stories.items.tools.category"),
      title: t("stories.items.tools.title"),
      body: t("stories.items.tools.body"),
    },
  ];
  const reasons = [
    {
      title: t("reasons.items.light-consumption.title"),
      body: t("reasons.items.light-consumption.body"),
    },
    {
      title: t("reasons.items.local-connection.title"),
      body: t("reasons.items.local-connection.body"),
    },
    {
      title: t("reasons.items.circular-use.title"),
      body: t("reasons.items.circular-use.body"),
    },
  ];

  return (
    <div className="space-y-16 py-5">
      <section>
        <Card className="py-10 md:py-12">
          <CardContent className="space-y-6">
            <p className="text-sm font-semibold tracking-[0.12em]">{t("about-sharing")}</p>
            <div className="space-y-4">
              <h1 className="text-4xl leading-[1.08] font-black tracking-tight md:text-6xl">
                <ShareThingsWordmark />
              </h1>
              <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed md:text-base">
                {t("hero-description")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/share">
                  {t("browse-items")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/post">{t("write-share-post")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-primary text-sm font-semibold">{t("stories.label")}</p>
          <h2 className="text-2xl leading-tight font-extrabold tracking-tight md:text-3xl">{t("stories.title")}</h2>
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
            <p className="text-primary text-sm font-semibold">{t("reasons.label")}</p>
            <CardTitle className="text-2xl leading-tight font-extrabold tracking-tight md:text-3xl">
              {t("reasons.title")}
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
