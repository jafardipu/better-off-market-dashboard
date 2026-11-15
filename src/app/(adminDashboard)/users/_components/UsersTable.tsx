"use client";
import { useState } from "react";
import { Select, Tag, TableProps, Input, Image } from "antd";
import DataTable from "@/utils/DataTable";
import { ChevronDownIcon, Search } from "lucide-react";
import { UserDetailsModal } from "@/components/(adminDashboard)/modals/users/UserDetailsModal";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import BlockUser from "@/components/shared/BlockUser";
import moment from "moment";
import { IUser, TStatus } from "@/types";
import Link from "next/link";
import { getInitials } from "@/utils/getInitials";

const STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Blocked", value: "blocked" },
];

const avatarColors = ["#DCE6FF", "#FFE1D6"];

const UsersTable = () => {
  const page = useSearchParams().get("page") || "1";
  const limit = useSearchParams().get("limit") || "10";
  const [searchText, setSearchText] = useState("");
  const [searchValue] = useDebounce(searchText, 500);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const queries: Record<string, string> = {};
  if (page) queries.page = page;
  if (limit) queries.limit = limit;
  if (searchValue) queries.searchTerm = searchValue;
  if (statusFilter === "all") delete queries.status;
  else queries.status = statusFilter;

  const { data: userData, isLoading } = useGetAllUsersQuery(queries);

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
              className="w-10 h-10 !rounded-full"
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
      dataIndex: "cratedAt",
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
            <Link href={`/user-messages?user=${record?._id}`}>
              <button
                className={`transition-transform duration-300 hover:scale-105 text-green-700 }`}
              >
                Messages
              </button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-section-bg rounded-lg">
      {/* Filter Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between  gap-3 px-2 pt-2">
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_FILTER_OPTIONS}
          suffixIcon={<ChevronDownIcon className="size-4 text-orange-400" />}
          popupMatchSelectWidth={false}
          className="[&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-[#E2BFB5] [&_.ant-select-selector]:!px-4 [&_.ant-select-selector]:!py-1.5"
        />

        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<Search size={18} />}
          placeholder="Search..."
          className="!max-w-72 h-9 !bg-[#F7F6F4]"
        />
      </div>

      <DataTable
        columns={columns}
        data={userData?.data}
        pageSize={Number(limit)}
        total={userData?.meta?.total}
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

export default UsersTable;
