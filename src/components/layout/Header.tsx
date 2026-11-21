"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/site";
import { Paw } from "@/components/ui/icons";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);

  // Hide on scroll down, reveal on scroll up; "scrolled" adds the paper backdrop.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        if (Math.abs(y - lastY) > 4) {
          setHidden(y > lastY && y > 240);
          lastY = y;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => {
    const d = menuRef.current;
    if (d?.open) d.close();
    setHidden(false);
  }, [pathname]);

  const openMenu = () => menuRef.current?.showModal();
  const closeMenu = () => {
    const d = menuRef.current;
    if (!d?.open) return;
    d.setAttribute("data-closing", "");
    window.setTimeout(() => {
      d.removeAttribute("data-closing");
      d.close();
    }, 400);
  };

  return (
    <header
      id="site-header"
      data-scrolled={scrolled}
      data-hidden={hidden}
      data-home={isHome ? "true" : undefined}
      className="tp-header fixed inset-x-0 top-0 z-50"
    >
      <div className="tp-header__bar gutter">
        <Link className="tp-header__brand" aria-label={`${site.name} — home`} href="/">
          <Image alt="" width={56} height={56} className="tp-header__logo" src="/brand/logo.png" priority />
          <span className="font-plush tp-header__name">{site.shortName}</span>
        </Link>
        <nav aria-label="Main" className="tp-header__nav">
          <ul>
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    data-active={active}
                    className="tp-nav-link"
                    href={item.href}
                  >
                    <span>{item.label}</span>
                    <Paw className="tp-nav-link__paw" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="tp-header__end">
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-header__wa">
            WhatsApp us
          </a>
          <button
            type="button"
            onClick={openMenu}
            className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-cocoa bg-milk px-4 text-[0.95rem] font-semibold lg:hidden"
            aria-haspopup="dialog"
          >
            <Paw className="size-4" />
            Menu
          </button>
          <dialog
            ref={menuRef}
            aria-label="Site menu"
            onCancel={(e) => {
              e.preventDefault();
              closeMenu();
            }}
            onClick={(e) => e.target === e.currentTarget && closeMenu()}
            className="tp-menu m-0 h-dvh max-h-none w-screen max-w-none bg-honey p-0 text-cocoa backdrop:bg-cocoa/40"
          >
            <div className="flex h-full flex-col gutter pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5">
              <div className="flex items-center justify-between">
                <span className="font-scrawl text-lg">where to, friend?</span>
                <button type="button" onClick={closeMenu} className="h-11 rounded-full bg-cocoa px-5 font-semibold text-milk">
                  Close
                </button>
              </div>
              <nav aria-label="Mobile" className="mt-10 flex-1">
                <ul className="space-y-1">
                  {nav.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          aria-current={active ? "page" : undefined}
                          data-active={active}
                          className="tp-menu-link font-plush block py-2 text-[clamp(2.4rem,11vw,3.4rem)]"
                          href={item.href}
                        >
                          <span>{item.label}</span>
                          <Paw className="tp-nav-link__paw" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="space-y-3">
                <a href={site.whatsapp} className="btn btn-whatsapp w-full" target="_blank" rel="noopener noreferrer">
                  WhatsApp us
                </a>
                <p className="text-center text-sm font-medium">{site.phone}</p>
              </div>
            </div>
          </dialog>
        </div>
      </div>
      <svg aria-hidden="true" className="tp-header__hem" width="100%" height="14" preserveAspectRatio="none">
        <defs>
          <pattern id="tp-hem" width="44" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 0H44V2A22 11 0 0 1 0 2Z" className="tp-header__hem-fill" />
            <path d="M0 2A22 11 0 0 0 44 2" className="tp-header__hem-line" />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#tp-hem)" />
      </svg>
    </header>
  );
}
