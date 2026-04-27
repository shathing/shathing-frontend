import { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { host } from "@/config";
import { routing } from "@/i18n/routing";
import Providers from "@/providers";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export async function generateMetadata(
	props: Omit<LayoutProps<"/[locale]">, "children">,
): Promise<Metadata> {
	const { locale } = await props.params;

	const t = await getTranslations({
		locale: locale as Locale,
		namespace: "Common",
	});

	const title = t("service-name");
	const description = t("service-description");
	const keywords = t("service-keywords");

	return {
		metadataBase: host,
		title: {
			default: title,
			template: `%s - ${title}`,
		},
		applicationName: title,
		description,
		keywords,
		openGraph: {
			title,
			siteName: title,
			description,
			url: `${host}/${locale}`,
			type: "website",
			locale,
			images: [
				{
					url: "/images/shathing.png",
					alt: title,
				},
			],
		},
	};
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params,
}: LayoutProps<"/[locale]">) {
	// Ensure that the incoming `locale` is valid
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	// Enable static rendering
	setRequestLocale(locale);

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				{/* <!-- Google tag (gtag.js) --> */}
				<script
					async
					src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
				/>
				<script>
					{`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_ID}');`}
				</script>
			</head>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
