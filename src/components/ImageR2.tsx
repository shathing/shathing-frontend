import Image from "next/image";
import type { ImageProps } from "next/image";

type ImageR2Props = Omit<ImageProps, "alt" | "src"> & {
  alt: ImageProps["alt"];
  src: ImageProps["src"];
};

const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_BASE_URL as string;

export default function ImageR2({ src, alt, ...props }: ImageR2Props) {
  return <Image {...props} alt={alt} src={R2_BASE_URL + src} />;
}
