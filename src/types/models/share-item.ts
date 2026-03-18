import { Category } from "./category";

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
  }
  legalDong: {
    code: string;
    sidoName: string;
    sigunguName: string;
    eupMyeonDongName: string;
  }
}