import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const commonT = useTranslations("Common");

  return (
    <>
      {/* not-found.tsx 파일 내에서는 metadata 로 title 이 설정되지 않아서 title 컴포넌트(React19) 사용 */}
      <title>{`${t("title")} - ${commonT("service-name")}`}</title>
      <main className="h-[calc(100dvh-64px)] flex flex-col items-center justify-center gap-10">
        <h1 className="text-4xl font-bold whitespace-pre-line text-center">{t("description")}</h1>
        <Button asChild>
          <Link href="/">{t("go-to-home")}</Link>
        </Button>
        <Button asChild variant="link" className="text-blue-500">
          <Link href="/sitemap">{t("or-see-our-site-map")}</Link>
        </Button>
      </main>
    </>
  );
}
