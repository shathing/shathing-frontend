import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { REFRESH_TOKEN } from "@/constants/auth";
import { cookies } from "next/headers";

type Sitemap = {
  url: string;
  label: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Sitemap");
  return { title: t("title") };
}

export default async function Sitemap() {
  const t = await getTranslations("Sitemap");
  const sitemap: Sitemap[] = [
    {
      url: "/",
      label: t("home"),
    },
    {
      url: "/share",
      label: t("share"),
    },
    ...((await cookies()).has(REFRESH_TOKEN)
      ? [
          {
            url: "/chat",
            label: t("chat"),
          },
          {
            url: "/post",
            label: t("post"),
          },
          {
            url: "/me",
            label: t("me"),
          },
        ]
      : []),
  ];

  return (
    <main className="flex justify-center px-4">
      <div className="w-full max-w-5xl">
        <ul>
          {sitemap.map(({ url, label }) => (
            <li key={url}>
              <Button variant="link" className="text-blue-500 p-0 text-base" asChild>
                <Link href={url}>{label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
