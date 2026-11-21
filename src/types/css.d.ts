import "react";

declare module "react" {
  // Allow CSS custom properties such as { "--tilt": "3deg" } in style props.
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
