"use client";
import Empty from "@/components/ui/empty-data";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { errorModification } from "@/lib/errors/errorModification";
import { useGetPropertyContractsQuery } from "@/redux/api/propertyContractApi";
import { IPropertyContract, TPropertyStatus } from "@/types";
import DataTable from "@/utils/DataTable";
import { Input, Select, TableProps } from "antd";
import { ChevronDownIcon, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { PropertyStatusBadge, PropertySummary, SellerInfo } from "./ContractParts";
import { PropertyContractDetailsModal } from "./PropertyContractDetailsModal";
import {
  displayValue,
  formatLocalDate,
  formatPrice,
  formatUtcDate,
  PROPERTY_STATUSES,
} from "./contract-utils";

const ALL_STATUSES = "all";

const STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: ALL_STATUSES },
  ...PROPERTY_STATUSES.map((status) => ({ label: status, value: status })),
];

const PropertyContractsTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const updateParams = useUpdateSearchParams();

  // List state lives in the URL so search/filter changes reset ?page in a
  // single navigation, and links like ?contractId=<id> work on load.
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const searchTerm = searchParams.get("searchTerm") || "";
  const statusParam = searchParams.get("status");
  const status = PROPERTY_STATUSES.includes(statusParam as TPropertyStatus)
    ? (statusParam as TPropertyStatus)
    : ALL_STATUSES;
  const contractId = searchParams.get("contractId");

  const [searchText, setSearchText] = useState(searchTerm);

  const applySearch = useDebouncedCallback((value: string) => {
    const term = value.trim();
    if (term === searchTerm) return;
    updateParams({ searchTerm: term || null, page: null });
  }, 500);

  const handleStatusChange = (value: string) => {
    updateParams({
      status: value === ALL_STATUSES ? null : value,
      page: null,
    });
  };

  const setContractParam = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set("contractId", id);
    else params.delete("contractId");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const queries: Record<string, string> = { page, limit };
  if (searchTerm) queries.searchTerm = searchTerm;
  if (status !== ALL_STATUSES) queries.status = status;

  const { data, isFetching, isError, error } =
    useGetPropertyContractsQuery(queries);

  const contracts = isError ? [] : data?.data ?? [];
  const isFiltered = Boolean(searchTerm) || status !== ALL_STATUSES;

  let emptyText;
  if (isFetching) {
    emptyText = <div className="h-32" />;
  } else if (isError) {
    emptyText = <Empty message={errorModification(error)} className="my-8" />;
  } else {
    emptyText = (
      <Empty
        message={
          isFiltered ? "No property contracts found" : "No property contracts yet"
        }
        className="my-8"
      />
    );
  }

  const columns: TableProps<IPropertyContract>["columns"] = [
    {
      title: "Property",
      dataIndex: "property",
      render: (_, record) => (
        <div className="min-w-[240px]">
          <PropertySummary property={record.property} />
        </div>
      ),
    },
    {
      title: "Listing Price",
      dataIndex: "listingPrice",
      render: (_, record) => (
        <p className="whitespace-nowrap font-semibold text-[#191C1E]">
          {formatPrice(record.property?.listingPrice)}
        </p>
      ),
    },
    {
      title: "Seller",
      dataIndex: "seller",
      render: (_, record) => (
        <div className="min-w-[220px]">
          <SellerInfo seller={record.seller} />
        </div>
      ),
    },
    {
      title: "Buyer Name",
      dataIndex: "buyerName",
      render: (buyerName: string | null) => (
        <p className="text-[#191C1E]">{displayValue(buyerName)}</p>
      ),
    },
    {
      title: "Anticipated Closing",
      dataIndex: "closingDate",
      render: (closingDate: string | null) => (
        <p className="whitespace-nowrap text-gray-500">
          {formatUtcDate(closingDate)}
        </p>
      ),
    },
    {
      title: "Title Company",
      dataIndex: "titleCompany",
      render: (titleCompany: string | null) => (
        <p className="text-[#191C1E]">{displayValue(titleCompany)}</p>
      ),
    },
    {
      title: "Submitted On",
      dataIndex: "createdAt",
      render: (createdAt: string) => (
        <p className="whitespace-nowrap text-gray-500">
          {formatLocalDate(createdAt)}
        </p>
      ),
    },
    {
      title: "Current Status",
      dataIndex: "status",
      render: (_, record) => (
        <PropertyStatusBadge status={record.property?.status} />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <button
          onClick={() => setContractParam(record._id)}
          className="rounded-md bg-[#00214C] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="bg-section-bg rounded-lg">
      {/* Filter Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2 pt-2">
        <Select
          value={status}
          onChange={handleStatusChange}
          options={STATUS_FILTER_OPTIONS}
          suffixIcon={<ChevronDownIcon className="size-4 text-orange-400" />}
          popupMatchSelectWidth={false}
          className="[&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-[#E2BFB5] [&_.ant-select-selector]:!px-4 [&_.ant-select-selector]:!py-1.5"
        />

        <Input
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            applySearch(e.target.value);
          }}
          prefix={<Search size={18} />}
          placeholder="Search address, seller, buyer..."
          allowClear
          className="!max-w-72 h-9 !bg-[#F7F6F4]"
        />
      </div>

      <DataTable
        columns={columns}
        data={contracts}
        pageSize={Number(limit)}
        total={isError ? 0 : data?.meta?.total}
        isLoading={isFetching}
        emptyText={emptyText}
      />

      <PropertyContractDetailsModal
        contractId={contractId}
        fallback={contracts.find((contract) => contract._id === contractId)}
        onClose={() => setContractParam(null)}
      />
    </div>
  );
};

export default PropertyContractsTable;
