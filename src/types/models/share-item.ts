import { Category } from "./category";
import { Region } from "./region";

export interface ShareItem {
  id: number;
  title: string;
  content: string;
  createdDate: string;
  photoUrls: string[];
  category: Category;
  member: {
    id: number;
    username: string;
  };
  region: Region;
}
