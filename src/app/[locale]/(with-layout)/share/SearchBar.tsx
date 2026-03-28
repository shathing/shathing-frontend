import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Region from "@/components/Region";
import Category from "@/components/Category";
import { useTranslations } from "next-intl";
import type { Region as regionT } from "@/types/models/region";

export default function SearchBar({ region }: { region?: regionT }) {
  const t = useTranslations("Share");

  return (
    <Card className="sticky top-2.5 bg-background/70 backdrop-blur-lg py-3 z-10">
      <CardContent className="flex gap-1 px-3">
        <Region isSearch region={region} />
        <Category />
        <Input placeholder={t("search-placeholder")} />
      </CardContent>
    </Card>
  );
}
