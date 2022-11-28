import React, { ReactNode } from "react";
// displays a page header

interface HeaderProps {
  link: string
  title: string
  subTitle: string
  children: ReactNode
}

export default function Header({ link, title, subTitle, ...props }: HeaderProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1.2rem" }}>
      {props.children}
    </div>
  );
}

Header.defaultProps = {
  link: "https://github.com/austintgriffith/scaffold-eth",
  title: "🏗 scaffold-eth",
  subTitle: "forkable Ethereum dev stack focused on fast product iteration",
};