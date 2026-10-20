import { productAction, type CatalogueProduct } from "@/lib/catalogue";
import { productDownloadLinks } from "@/lib/product-links";

export function ProductAccessLinks({
  product,
  primaryClassName = "action-button",
}: {
  product: CatalogueProduct;
  primaryClassName?: string;
}) {
  const primary = productAction(product);
  const downloads = productDownloadLinks(product).filter(
    (link) => link.href !== primary.href,
  );
  const links = [
    { ...primary, className: primaryClassName },
    ...downloads.map((link) => ({ ...link, className: "text-link self-center" })),
  ];
  return (
    <>
      {links.map((link) => (
        <a
          key={link.href}
          className={link.className}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
        >
          {link.label}
        </a>
      ))}
    </>
  );
}
