import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Sitemap");
  return { title: t("title") };
}

export default function Sitemap() {
  const t = useTranslations("Sitemap");
  const sitemap = [
    {
      url: "/",
      label: t("home"),
    },
  ];

  return (
    <main className="flex justify-center px-4">
      <div className="w-full max-w-5xl">
        <ul>
          {sitemap.map((site) => (
            <li key={site.url}>
              <Button variant="link" className="text-blue-500 p-0 text-base" asChild>
                <Link href={site.url}>{site.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
