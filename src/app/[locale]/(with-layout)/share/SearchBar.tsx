import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LegalDong from "./LegalDong";
import Category from "./Category";

export default function SearchBar() {
  return (
    <Card className="sticky top-2.5 bg-background/50 backdrop-blur-xs py-3">
      <CardContent className="flex gap-1 px-3">
        <LegalDong />
        <Category />
        <Input placeholder="입력" />
      </CardContent>
    </Card>
  );
}
