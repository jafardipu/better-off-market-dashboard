// components/offers/OffersTable.tsx
"use client";
import { Tag, TableProps } from "antd";
import DataTable from "@/utils/DataTable";
import Link from "next/link";
import { useGetAllOffersQuery } from "@/redux/api/offerApi";
import { IOffer } from "@/types";
import moment from "moment";
import { getOfferStatusBadge } from "@/utils/getOfferStatusBadge";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const offerStatus = {
  pending: "bg-[#FFF3E0] text-[#E65100]",
  countered: "bg-[#f5dfcb] text-[#F57F17]",
  accepted: "bg-[#E8F5E9] text-[#1B5E20]",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-[#deded4] text-[#5c5e1b]",
};

const formatAmount = (value: number) => `$${value?.toLocaleString("en-US")}`;

const handleReview = (record: IOffer) => {
  console.log("review", record);
};

const OffersTable = () => {
  const page = useSearchParams().get("page") || "1";
  const limit = useSearchParams().get("limit") || "10";

  const queries: Record<string, string> = {};

  if (page) queries.page = page;
  if (limit) queries.limit = limit;

  const { data: offersData, isLoading } = useGetAllOffersQuery(queries);

  const columns: TableProps<IOffer>["columns"] = [
    {
      title: "Buyer & Seller",
      dataIndex: "_",
      render: (_, record) => (
        <p className="font-medium text-[#191C1E]">
          {record?.buyer?.name} <span>→</span> {record.seller?.name}
        </p>
      ),
    },
    {
      title: "Property & County",
      dataIndex: "__",
      render: (_, record) => (
        <div className="max-w-[450px]">
          <Link
            href={`/listings/${record?.property?._id}`}
            className="text-[#191C1E] hover:underline"
          >{`${record.property?.propertyType} - ${record?.property?.city}, ${record?.property?.state}, ${record?.property?.zipCode}`}</Link>
          <p className="text-sm text-gray-400">{record?.property?.county}</p>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => (
        <p className="text-[#191C1E]">{moment(text).format("ll")}</p>
      ),
    },
    {
      title: "Offer Amount",
      dataIndex: "_",
      render: (value, record) => (
        <p className="font-semibold text-[#AC3400]">
          {formatAmount(record?.currentTerms?.offerAmount)}
        </p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: keyof typeof offerStatus) => (
        <div className={cn("bg0", offerStatus[status])}>
          {getOfferStatusBadge(status)}
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <Link href={`/orders/${record._id}`}>
          <button
            onClick={() => handleReview(record)}
            className="rounded-md bg-[#00214C] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
          >
            Review
          </button>
        </Link>
      ),
    },
  ];

  return (
    <div className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-6">
      <h2 className="mb-4 md:text-lg font-bold text-[#191C1E]">
        All offers — platform wide
      </h2>
      <DataTable
        columns={columns}
        data={offersData?.data}
        pageSize={Number(limit)}
        total={offersData?.meta?.total || 0}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OffersTable;
