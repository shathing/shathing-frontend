import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LegalDong from "./LegalDong";

const categories = [
  "디지털기기",
  "생활가전",
  "가구/인테리어",
  "공구",
  "생활/주방",
  "유아동",
  "여성의류",
  "여성잡화",
  "남성의류",
  "남성잡화",
  "뷰티/미용",
  "스포츠/레저",
  "취미/게임/음반",
  "도서",
  "여행/이동장비",
  "반려동물용품",
  "식물",
  "기타 공유물품",
  "빌려주세요",
];

export default function SearchBar() {
  return (
    <Card className="sticky top-2.5 bg-background/50 backdrop-blur-xs py-3">
      <CardContent className="flex gap-1 px-3">
        <LegalDong />
        <DropdownMenu>
          <DropdownMenuTrigger asChild defaultValue="디지털기기">
            <Button variant="outline">카테고리</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup>
              {categories.map((category, idx) => (
                <DropdownMenuRadioItem key={idx} value={category}>
                  {category}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input placeholder="입력" />
      </CardContent>
    </Card>
  );
}
