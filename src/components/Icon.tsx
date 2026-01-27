import React from "react";
import * as icons from "@/assets/svgs";

export type IconName = keyof typeof icons;

export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, "width" | "height"> {
  name: IconName;
  width?: string;
  height?: string;
  className?: string;
}

export function Icon({ name, width = "20", height = "20", className, ...restProps }: IconProps) {
  const Component = icons[name];

  return (
    <Component
      className={className}
      width={width}
      height={height}
      style={{
        width,
        minWidth: width,
        height,
        minHeight: height,
        ...restProps.style,
      }}
      {...restProps}
    />
  );
}
