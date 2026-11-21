import type { Media } from "@/lib/data";
import { focal } from "@/lib/data";

type Props = {
  media: Media;
  priority?: boolean;
  className?: string;
  alt?: string;
};

/**
 * Fills its (relatively positioned) parent, cropped around the photo's focal
 * point, with the dominant colour as a placeholder while it loads.
 */
export function MediaImg({ media, priority, className, alt }: Props) {
  const src = media.kind === "video" && media.poster ? media.poster : media;
  const pos = focal(src);
  return (
    <img
      alt={alt ?? src.alt}
      src={src.url}
      width={src.width}
      height={src.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        height: "100%",
        width: "100%",
        objectFit: "cover",
        objectPosition: pos,
        backgroundColor: src.color,
      }}
    />
  );
}
