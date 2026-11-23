import { RiDashboardHorizontalFill } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import Link from "next/link";
import { ChartColumn, FileSignature, ListChecks, Logs, Mail, MessagesSquare, Users } from "lucide-react";

export const navLinks = [
  {
    key: "dashboard",
    icon: <RiDashboardHorizontalFill size={18} />,
    label: <Link href={"/dashboard"}>Dashboard</Link>,
  },
  {
    key: "users",
    icon: <Users size={18} />,
    label: <Link href={"/users"}>Users</Link>,
  },
  {
    key: "listings",
    icon: <ListChecks size={18} />,
    label: <Link href={"/listings"}>Listings</Link>,
  },
  {
    key: "offers",
    icon: <Logs size={18} />,
    label: <Link href={"/offers"}>Offers</Link>,
  },
  {
    key: "property-contracts",
    icon: <FileSignature size={18} />,
    label: <Link href={"/property-contracts"}>Property Contracts</Link>,
  },
  {
    key: "user-messages",
    icon: <Mail size={18} />,
    label: <Link href={"/user-messages"}> Messages</Link>,
  },
  {
    key: "messages",
    icon: <MessagesSquare size={18} />,
    label: <Link href={"/messages"}>Conversations</Link>,
  },
  {
    key: "analytics",
    icon: <ChartColumn size={18} />,
    label: <Link href={"/analytics"}>Analytics</Link>,
  },
  {
    key: "faqs",
    icon: <ListChecks size={18} />,
    label: <Link href={"/content"}>FAQs</Link>,
  },
  {
    key: "settings",
    icon: <IoSettingsOutline size={18} />,
    label: <Link href={"/settings"}>Settings</Link>,
  },
  // {
  //   key: "logout",
  //   icon: <RiLogoutCircleLine size={18} />,
  //   label: <Link href={"/login"}>Logout</Link>,
  // },
];
