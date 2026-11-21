"use client";
import { Avatar, Tag, TableProps, Image } from "antd";
import DataTable from "@/utils/DataTable";
import Link from "next/link";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { IUser, TStatus } from "@/types";
import { getInitials } from "@/utils/getInitials";
import moment from "moment";
import BlockUser from "@/components/shared/BlockUser";
import { useState } from "react";
import { UserDetailsModal } from "@/components/(adminDashboard)/modals/users/UserDetailsModal";

const avatarColors = ["#DCE6FF", "#FFE1D6"];

const RecentUserTable = () => {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { data: userData, isLoading } = useGetAllUsersQuery({ limit: "5" });

  const columns: TableProps<IUser>["columns"] = [
    {
      title: "User",
      dataIndex: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {record.profile ? (
            <Image
              src={record.profile}
              alt={record.name}
              width={40}
              height={40}
              className="w-10 h-10 !rounded-full object-cover"
            />
          ) : (
            <span
              style={{
                backgroundColor: record.profile
                  ? undefined
                  : avatarColors[
                      Math.floor(Math.random() * avatarColors.length) %
                        avatarColors.length
                    ],
                color: "#1e3a8a",
                fontWeight: 600,
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full"
            >
              {getInitials(record.name)}
            </span>
          )}

          <div>
            <p className="font-semibold text-[#191C1E]">{record.name}</p>
            <Link
              href={`mailto:${record.email}`}
              className="text-sm text-[#565E74]"
            >
              {record.email}
            </Link>
          </div>
        </div>
      ),
    },

    {
      title: "Location",
      dataIndex: "location",
      render: (text) => <p className="text-gray-500">{text || "N/A"}</p>,
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      render: (text) => (
        <p className="text-gray-500">{moment(text).format("MMM DD, YYYY")}</p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: TStatus) => (
        <Tag
          className="!rounded-full !border-0 !px-3 !py-1 !text-xs !font-medium capitalize"
          style={
            status === "active"
              ? { background: "#DCFCE7", color: "#16A34A" }
              : { background: "#FEE2E2", color: "#DC2626" }
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => {
        return (
          <div className="flex items-center gap-3 text-sm font-semibold">
            <button
              onClick={() => {
                setSelectedUser(record);
                setIsOpen(true);
              }}
              className={`transition-transform duration-300 hover:scale-105 text-[#1674A3] }`}
            >
              View
            </button>
            <BlockUser id={record?._id} isActive={record.status === "active"} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-section-bg rounded-3xl">
      <div className="flex items-center justify-between px-2 pt-2 mb-2">
        <h2 className="text-lg font-bold text-[#191C1B]">Recent users</h2>
        <Link href="/users">
          <button className="text-xs font-semibold tracking-wide text-[#0F5238]">
            VIEW ALL
          </button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={userData?.data}
        isLoading={isLoading}
      />

      <UserDetailsModal
        open={isOpen}
        selectedUser={selectedUser}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default RecentUserTable;
