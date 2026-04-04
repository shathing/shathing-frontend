"use client";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function NavBtn({ href, title }: { href: string; title: string }) {
  const pathname = usePathname();
  const isCurrent = pathname.startsWith(href);

  return (
    <Button asChild variant="ghost" className={cn(isCurrent && "bg-accent")}>
      <Link href={href}>{title}</Link>
    </Button>
  );
}
