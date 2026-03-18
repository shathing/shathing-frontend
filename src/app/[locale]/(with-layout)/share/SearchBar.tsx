import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LegalDong from "./LegalDong";
import Category from "./Category";

export default function SearchBar() {
  return (
    <Card className="sticky top-2.5 bg-background/70 backdrop-blur-lg py-3 z-10">
      <CardContent className="flex gap-1 px-3">
        <LegalDong />
        <Category />
        <Input placeholder="입력" />
      </CardContent>
    </Card>
  );
}
