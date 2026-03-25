import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LegalDong from "@/components/LegalDong";
import Category from "@/components/Category";
import { useTranslations } from "next-intl";

export default function SearchBar() {
  const t = useTranslations("Share");

  return (
    <Card className="sticky top-2.5 bg-background/70 backdrop-blur-lg py-3 z-10">
      <CardContent className="flex gap-1 px-3">
        <LegalDong />
        <Category />
        <Input placeholder={t("search-placeholder")} />
      </CardContent>
    </Card>
  );
}
