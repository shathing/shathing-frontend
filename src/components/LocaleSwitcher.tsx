"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Locale } from "next-intl";
import { ChangeEvent } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: nextLocale },
    );
  }

  return (
    <NativeSelect defaultValue={locale} onChange={onSelectChange} className="cursor-pointer">
      {routing.locales.map((cur) => (
        <NativeSelectOption key={cur} value={cur}>
          {t("locale", { locale: cur })}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
