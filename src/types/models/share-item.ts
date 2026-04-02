import { Category } from "./category";
import { Member } from "./member";
import { Region } from "./region";

export interface ShareItem {
  id: number;
  title: string;
  content: string;
  createdDate: string;
  photoUrls: string[];
  category: Category;
  member: Omit<Member, "email">
  region: Region;
}
