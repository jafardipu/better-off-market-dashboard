"use client";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import logoIcon from "@/assets/logo-icon.png";
import { navLinks } from "@/utils/navLinks";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV_KEYS = new Set(navLinks.map((link) => link.key));

// First URL segment → sidebar key, for routes whose segment isn't the key.
const ROUTE_NAV_KEYS: Record<string, string> = {
  orders: "offers", // offer detail pages live under /orders
  content: "faqs",
  "personal-information": "settings",
  "privacy-policy": "settings",
  "terms-condition": "settings",
};

const getNavKey = (pathname: string) => {
  const segment = pathname.split("/")[1] ?? "";
  const key = ROUTE_NAV_KEYS[segment] ?? segment;
  return NAV_KEYS.has(key) ? key : undefined;
};

const SidebarContainer = ({ collapsed }: { collapsed: boolean }) => {
  const currentPath = usePathname();
  const routeKey = getNavKey(currentPath);

  // Pages without their own item (notifications, seller profile, ...) keep
  // the last highlighted item, so the sidebar still shows where you came from.
  const [lastKey, setLastKey] = useState(routeKey);
  if (routeKey && routeKey !== lastKey) setLastKey(routeKey);
  const selectedKey = routeKey ?? lastKey;

  return (
    <Sider
      width={300}
      theme="light"
      collapsible
      collapsed={collapsed}
      trigger={null}
      style={{
        paddingInline: `${collapsed ? "5px" : "10px"}`,
        backgroundColor: "#E0E3E5",
        maxHeight: "100vh",
        overflow: "auto",
        borderBottom: "1px solid #e8e8e8",
      }}
    >
      <div className="demo-logo-vertical" />
      {/* logo  */}
      <div className=" flex flex-col justify-center items-center gap-y-5 my-5 max-h-28">
        {collapsed ? (
          <Link href={"/"}>
            <Image src={logoIcon} alt="logo_Image_icon"  className="max-h-24 w-auto"/>
          </Link>
        ) : (
          <Link href={"/"}>
            <Image src={logo} alt="logo_Image" className="max-h-24 w-auto" />
          </Link>
        )}
      </div>
      <Menu
        selectedKeys={selectedKey ? [selectedKey] : []}
        mode="inline"
        className="sidebar-menu text-lg bg-main-color"
        items={navLinks}
      />
    </Sider>
  );
};

export default SidebarContainer;
