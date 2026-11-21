"use client";
import { Avatar, Flex, Skeleton } from "antd";
import { IoNotificationsOutline } from "react-icons/io5";

import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "../ui/menubar";
import { FaBars } from "react-icons/fa6";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { useGetMyProfileQuery } from "@/redux/api/profileApi";
import { useGetNotificationQuery } from "@/redux/api/notificationApi";
import { useEffect, useState } from "react";
import { INotification } from "../(adminDashboard)/Notifications/NotificationContainer";
import { getInitials } from "@/utils/getInitials";

type TNavbarProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const Navbar = ({ collapsed, setCollapsed }: TNavbarProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isUnread, setIsUnread] = useState(false);
  const { data, isLoading } = useGetMyProfileQuery(undefined);
  const { data: notificationData } = useGetNotificationQuery(undefined);

  useEffect(() => {
    if (notificationData) {
      const isUnreadNotification = notificationData?.data?.some(
        (notification: INotification) => notification.read === false,
      );
      setIsUnread(isUnreadNotification);
    }
  }, [notificationData]);

  console.log(isUnread);
  return (
    <div className="flex items-center justify-between w-[97%]">
      {/* Header left side */}
      <Flex align="center" gap={10}>
        <button
          onClick={() => setCollapsed(collapsed ? false : true)}
          className="cursor-pointer hover:bg-gray-300 rounded-full duration-1000 lg:hidden flex items-center justify-center pl-2 sr-only"
        >
          {collapsed ? (
            <X size={28} color="#3A3C3B" />
          ) : (
            <FaBars size={28} color="#3A3C3B" />
          )}
        </button>
        <div className="flex-col px-4 hidden md:flex">
          <h2 className="md:text-xl text-lg  font-medium text-[#3A3C3B]">
            Welcome,{" "}
            {isLoading ? (
              <Skeleton.Input active size="small" />
            ) : (
              data?.data?.name
            )}
            <span className="block  text-xs font-normal">
              Welcome back! Here's what's happening today.
            </span>
          </h2>
        </div>
      </Flex>

      {/* Header right side */}
      <Flex align="center" gap={20}>
        {/* Notification */}
        <Link href={"/notifications"}>
          <div className="flex justify-center items-center size-12  rounded-2xl cursor-pointer relative border ">
            <IoNotificationsOutline size={24} color="#545454" />
            {isUnread && (
              <div className="absolute top-1.5 right-2.5 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </div>
        </Link>

        <Menubar className="py-6 rounded-full">
          <MenubarMenu>
            <MenubarTrigger className="shadow-none px-0 rounded-full py-2">
              {isLoading ? (
                <Skeleton.Input active size="small" />
              ) : (
                <div className="flex items-center gap-x-2  px-2 h-fit">
                  <p className="text-black">{data?.data?.name}</p>
                  <Avatar
                    src={data?.data?.profile}
                    size={40}
                    className="size-12"
                  >
                    {getInitials(data?.data?.name || "")}
                  </Avatar>
                </div>
              )}
            </MenubarTrigger>

            <MenubarContent className="text-primary-gray">
              <Link href={"/personal-information"}>
                <MenubarItem className="hover:bg-gray-100 cursor-pointer">
                  Profile{" "}
                  <MenubarShortcut>
                    <ChevronRight size={16} />
                  </MenubarShortcut>
                </MenubarItem>
              </Link>
              <MenubarSeparator />

              <MenubarItem
                onClick={() => {
                  dispatch(logout());
                  router.refresh();
                }}
                className="hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Flex>
    </div>
  );
};

export default Navbar;
