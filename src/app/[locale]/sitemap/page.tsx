import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Locale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Sitemap" });
  const commonT = await getTranslations({ locale, namespace: "Common" });

  return {
    title: t("title") + " - " + commonT("service-name"),
  };
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
