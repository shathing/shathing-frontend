import ChatPanel from "../ChatPanel";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <ChatPanel chatRoomId={slug} className="flex" />;
}
