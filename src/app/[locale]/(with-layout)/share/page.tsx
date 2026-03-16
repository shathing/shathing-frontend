import SearchBar from "./SearchBar";

export default function Page() {
  return (
    <div className="space-y-2.5 my-2.5 relative">
      <SearchBar />
      <div className="bg-amber-200 h-[2000px]">컨텐츠 영역</div>
    </div>
  );
}
