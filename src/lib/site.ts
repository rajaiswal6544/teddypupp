export const site = {
  name: "TeddyPups U.A.E.",
  shortName: "TeddyPups",
  tagline: "every puppy is family",
  description:
    "Teddy bear and teacup puppies in Dubai. Meet local puppies in our Downtown Dubai showroom or bring home a rare breed imported from trusted breeders.",
  phone: "+971 50 000 0000",
  phoneHref: "tel:+971500000000",
  email: "info@instabizweb.com",
  address: "Downtown Dubai, United Arab Emirates",
  whatsapp:
    "https://wa.me/919898124987?text=Hi%20Insta%20Biz%20Web%2C%20I'd%20like%20to%20discuss%20a%20project.",
  credit: "https://www.instabizweb.com/",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://teddypups.vercel.app",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/puppies", label: "Puppies" },
  { href: "/happy-families", label: "Happy families" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit & contact" },
] as const;
