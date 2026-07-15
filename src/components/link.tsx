"use client";

import { useRouter } from "@/hooks/use-router";
import { cn } from "@/lib/utils";
import type { MouseEventHandler } from "react";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

/** Hash-router aware link. */
export function Link({ to, onClick, className, children, ...rest }: LinkProps) {
  const { navigate, path } = useRouter();
  const href = to.startsWith("#") ? to : `#${to}`;
  const isActive = path === to || (to !== "/" && path.startsWith(to));

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    navigate(to);
    onClick?.(e);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      data-active={isActive}
      className={cn(className)}
      {...rest}
    >
      {children}
    </a>
  );
}
