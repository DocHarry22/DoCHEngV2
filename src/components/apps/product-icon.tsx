import Image from "next/image";
export function ProductIcon({
  slug,
  className = "",
  imageUrl,
}: {
  slug: string;
  className?: string;
  imageUrl?: string;
}) {
  if (imageUrl)
    return (
      <span aria-hidden="true" className={`product-icon ${className}`}>
        <Image src={imageUrl} alt="" width={40} height={40} unoptimized />
      </span>
    );
  const paths: Record<string, React.ReactNode> = {
    desk: (
      <>
        <rect x="5" y="5" width="22" height="22" rx="4" />
        <path d="M11 5v22M16 12h6m-6 5h6m-6 5h3" />
      </>
    ),
    resume: (
      <>
        <path d="M10 4h10l5 5v19H7V4h3m10 0v6h5M12 17h8m-8 5h8" />
        <circle cx="15" cy="11" r="2" />
      </>
    ),
    compass: (
      <>
        <circle cx="16" cy="16" r="12" />
        <path d="m21 11-3 7-7 3 3-7 7-3Z" />
      </>
    ),
    "apologia-sancta": (
      <>
        <path d="M16 3 27 7v10c0 7-11 12-11 12S5 24 5 17V7L16 3Z" />
        <path d="M16 9v14M10 14h12" />
      </>
    ),
    "thasi-etoile": (
      <path d="m16 3 3.8 8.3L29 13l-6.6 6.4L24 29l-8-4.5L8 29l1.6-9.6L3 13l9.2-1.7L16 3Z" />
    ),
    "water-nest": (
      <>
        <path d="M16 3C13 9 6 15 6 21a10 10 0 0 0 20 0c0-6-7-12-10-18Z" />
        <path d="M10 22c0 3 2 5 5 5" />
      </>
    ),
    research: (
      <>
        <circle cx="14" cy="14" r="9" />
        <path d="m21 21 8 8M10 14h8m-4-4v8" />
      </>
    ),
    paperplane: (
      <>
        <path d="m3 14 26-10-9 25-5-10-12-5Zm12 5L29 4" />
      </>
    ),
  };
  return (
    <span aria-hidden="true" className={`product-icon ${className}`}>
      <svg
        viewBox="0 0 32 32"
        width="36"
        height="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[slug] ?? (
          <>
            <circle cx="16" cy="16" r="11" />
            <path d="M16 4v24M4 16h24m-20-8 16 16M8 24 24 8" />
          </>
        )}
      </svg>
    </span>
  );
}
