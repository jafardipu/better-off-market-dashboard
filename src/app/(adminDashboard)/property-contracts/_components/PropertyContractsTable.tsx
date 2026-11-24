"use client";
import {
  BUYER_CONTACT_SOURCE_VALUES,
  contractBuyerActivityHref,
  CONTRACT_SOURCE_VALUES,
  getBuyerContactSourceLabel,
  getContractSourceLabel,
  isBuyerContactSource,
  isContractSource,
} from "@/components/(adminDashboard)/buyer-activity/buyerActivity";
import {
  ContactSourceBadge,
  NeedsReviewBadge,
} from "@/components/(adminDashboard)/buyer-activity/BuyerActivityParts";
import {
  displayValue,
  EMPTY_VALUE,
  formatDateTime,
  formatLocalDate,
  formatPrice,
  formatUtcDate,
  PROPERTY_STATUSES,
} from "@/components/(adminDashboard)/property-records/format";
import {
  PropertyStatusBadge,
  PropertySummary,
  SellerInfo,
} from "@/components/(adminDashboard)/property-records/RecordParts";
import Empty from "@/components/ui/empty-data";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { errorModification } from "@/lib/errors/errorModification";
import { useGetPropertyContractsQuery } from "@/redux/api/propertyContractApi";
import { IPropertyContract, TPropertyStatus } from "@/types";
import DataTable from "@/utils/DataTable";
import { Input, Select, TableProps } from "antd";
import { ChevronDownIcon, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ContractBuyer } from "./ContractBuyer";
import { PropertyContractDetailsModal } from "./PropertyContractDetailsModal";

const ALL = "all";

const SELECT_CLASS =
  "[&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-[#E2BFB5] [&_.ant-select-selector]:!px-4 [&_.ant-select-selector]:!py-1.5";

const STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: ALL },
  ...PROPERTY_STATUSES.map((status) => ({ label: status, value: status })),
];

// NEW FLOW: filters for the buyer-contact certification.
const SOURCE_FILTER_OPTIONS = [
  { label: "All Sources", value: ALL },
  ...CONTRACT_SOURCE_VALUES.map((source) => ({
    label: getContractSourceLabel(source),
    value: source,
  })),
];

const CONTACT_SOURCE_FILTER_OPTIONS = [
  { label: "All Seller's Answers", value: ALL },
  ...BUYER_CONTACT_SOURCE_VALUES.map((source) => ({
    label: getBuyerContactSourceLabel(source, "short"),
    value: source,
  })),
];

const NEEDS_REVIEW = "true";
const REVIEW_FILTER_OPTIONS = [
  { label: "All Contracts", value: ALL },
  { label: "Needs Review", value: NEEDS_REVIEW },
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
    : ALL;
  const contractId = searchParams.get("contractId");

  // NEW FLOW: buyer-contact certification filters.
  const sourceParam = searchParams.get("source");
  const source = isContractSource(sourceParam) ? sourceParam : ALL;
  const contactSourceParam = searchParams.get("buyerContactSource");
  const contactSource = isBuyerContactSource(contactSourceParam)
    ? contactSourceParam
    : ALL;
  const review =
    searchParams.get("needsReview") === NEEDS_REVIEW ? NEEDS_REVIEW : ALL;

  const [searchText, setSearchText] = useState(searchTerm);

  const applySearch = useDebouncedCallback((value: string) => {
    const term = value.trim();
    if (term === searchTerm) return;
    updateParams({ searchTerm: term || null, page: null });
  }, 500);

  // Any filter change goes back to page 1.
  const setFilter = (key: string) => (value: string) => {
    updateParams({ [key]: value === ALL ? null : value, page: null });
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
  if (status !== ALL) queries.status = status;
  if (source !== ALL) queries.source = source;
  if (contactSource !== ALL) queries.buyerContactSource = contactSource;
  if (review !== ALL) queries.needsReview = review;

  const { data, isFetching, isError, error } =
    useGetPropertyContractsQuery(queries);

  const contracts = isError ? [] : data?.data ?? [];
  const isFiltered =
    Boolean(searchTerm) ||
    [status, source, contactSource, review].some((value) => value !== ALL);

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
      title: "Buyer",
      dataIndex: "buyerName",
      render: (_, record) => (
        <div className="min-w-[160px]">
          <ContractBuyer contract={record} />
        </div>
      ),
    },
    // NEW FLOW: buyer-contact certification and platform activity check.
    {
      title: "Source",
      dataIndex: "source",
      render: (value) => (
        <p className="whitespace-nowrap text-[#191C1E]">
          {getContractSourceLabel(value) ?? EMPTY_VALUE}
        </p>
      ),
    },
    {
      title: "Seller's Answer",
      dataIndex: "buyerContactSource",
      render: (_, record) => (
        <div className="flex flex-col items-start gap-1.5">
          <ContactSourceBadge source={record.buyerContactSource} />
          {record.needsReview && <NeedsReviewBadge />}
        </div>
      ),
    },
    {
      title: "Certified",
      dataIndex: "certifiedAt",
      render: (certifiedAt?: string | null) => (
        <p className="whitespace-nowrap text-gray-500">
          {formatDateTime(certifiedAt)}
        </p>
      ),
    },
    {
      title: "BOM Activity",
      dataIndex: "hasPlatformActivity",
      render: (hasPlatformActivity?: boolean) => (
        <p className="text-[#191C1E]">
          {typeof hasPlatformActivity === "boolean"
            ? hasPlatformActivity
              ? "Yes"
              : "No"
            : EMPTY_VALUE}
        </p>
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
      // The table scrolls sideways; keep the actions in view.
      fixed: "right",
      render: (_, record) => (
        <div className="flex flex-col items-stretch gap-2">
          <button
            onClick={() => setContractParam(record._id)}
            className="rounded-md bg-[#00214C] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
          >
            View
          </button>
          {/* NEW FLOW: everyone who interacted with this listing. */}
          {record.property?._id && (
            <Link
              href={contractBuyerActivityHref(record)}
              className="whitespace-nowrap rounded-md border border-[#00214C] px-3 py-1.5 text-center text-xs font-semibold text-[#00214C] hover:bg-[#00214C]/5"
            >
              View buyer activity
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-section-bg rounded-lg">
      {/* Filter Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={status}
            onChange={setFilter("status")}
            options={STATUS_FILTER_OPTIONS}
            suffixIcon={<ChevronDownIcon className="size-4 text-orange-400" />}
            popupMatchSelectWidth={false}
            className={SELECT_CLASS}
          />
          {/* NEW FLOW: buyer-contact certification filters. */}
          <Select
            value={source}
            onChange={setFilter("source")}
            options={SOURCE_FILTER_OPTIONS}
            suffixIcon={<ChevronDownIcon className="size-4 text-orange-400" />}
            popupMatchSelectWidth={false}
            className={SELECT_CLASS}
          />
          <Select
            value={contactSource}
            onChange={setFilter("buyerContactSource")}
            options={CONTACT_SOURCE_FILTER_OPTIONS}
            suffixIcon={<ChevronDownIcon className="size-4 text-orange-400" />}
            popupMatchSelectWidth={false}
            className={SELECT_CLASS}
          />
          <Select
            value={review}
            onChange={setFilter("needsReview")}
            options={REVIEW_FILTER_OPTIONS}
            suffixIcon={<ChevronDownIcon className="size-4 text-orange-400" />}
            popupMatchSelectWidth={false}
            className={SELECT_CLASS}
          />
        </div>

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
