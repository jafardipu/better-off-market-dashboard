"use client";
// NEW FLOW: buyer activity tracking.
import {
  BUYER_ACTIVITY_FILTER_KEYS,
  getBuyerActivityArgs,
  TBuyerActivityFilterKey,
} from "@/components/(adminDashboard)/buyer-activity/buyerActivity";
import { BuyerActivityNote } from "@/components/(adminDashboard)/buyer-activity/BuyerActivityParts";
import { getBuyerActivityColumns } from "@/components/(adminDashboard)/buyer-activity/buyerActivityColumns";
import Empty from "@/components/ui/empty-data";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { errorModification } from "@/lib/errors/errorModification";
import { useGetBuyerActivitiesQuery } from "@/redux/api/buyerActivityApi";
import { IBuyerActivity } from "@/types";
import DataTable from "@/utils/DataTable";
import { Input } from "antd";
import { Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const FILTER_LABELS: Record<TBuyerActivityFilterKey, string> = {
  buyer: "Buyer",
  property: "Property",
  seller: "Seller",
};

// Name for a filter chip, taken from the loaded rows. When nothing matched,
// fall back to a shortened id.
const getFilterValueLabel = (
  key: TBuyerActivityFilterKey,
  id: string,
  rows: IBuyerActivity[],
) => {
  for (const row of rows) {
    if (key === "buyer" && row.buyer?._id === id && row.buyer.name) {
      return row.buyer.name;
    }
    if (key === "property" && row.property?._id === id) {
      if (row.property.streetAddress) return row.property.streetAddress;
    }
    if (key === "seller" && row.seller?._id === id && row.seller.name) {
      return row.seller.name;
    }
  }
  return id.length > 10 ? `…${id.slice(-6)}` : id;
};

const BuyerActivityTable = () => {
  const searchParams = useSearchParams();
  const updateParams = useUpdateSearchParams();

  // Everything lives in the URL so other pages can link to a filtered view,
  // e.g. /buyer-activity?property=<id>&buyer=<id>.
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const searchTerm = searchParams.get("searchTerm") || "";
  const activeFilters = BUYER_ACTIVITY_FILTER_KEYS.flatMap((key) => {
    const value = searchParams.get(key);
    return value ? [{ key, value }] : [];
  });

  const [searchText, setSearchText] = useState(searchTerm);

  const applySearch = useDebouncedCallback((value: string) => {
    const term = value.trim();
    if (term === searchTerm) return;
    updateParams({ searchTerm: term || null, page: null });
  }, 500);

  const { data, isFetching, isError, error } = useGetBuyerActivitiesQuery(
    getBuyerActivityArgs({
      page,
      limit,
      searchTerm,
      ...Object.fromEntries(activeFilters.map(({ key, value }) => [key, value])),
    }),
  );

  const rows = isError ? [] : data?.data ?? [];
  const isFiltered = Boolean(searchTerm) || activeFilters.length > 0;

  let emptyText;
  if (isFetching) {
    emptyText = <div className="h-32" />;
  } else if (isError) {
    emptyText = <Empty message={errorModification(error)} className="my-8" />;
  } else {
    emptyText = (
      <Empty
        message={isFiltered ? "No buyer activity found" : "No buyer activity yet"}
        className="my-8"
      />
    );
  }

  return (
    <div className="space-y-4">
      <BuyerActivityNote />

      <div className="bg-section-bg rounded-lg">
        {/* Filter Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map(({ key, value }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E2BFB5] bg-white py-1 pl-3 pr-2 text-sm text-[#191C1E]"
              >
                <span className="text-[#565E74]">{FILTER_LABELS[key]}:</span>
                <span className="max-w-56 truncate font-medium">
                  {getFilterValueLabel(key, value, rows)}
                </span>
                <button
                  type="button"
                  onClick={() => updateParams({ [key]: null, page: null })}
                  aria-label={`Remove ${FILTER_LABELS[key].toLowerCase()} filter`}
                  className="rounded-full p-0.5 text-[#565E74] hover:bg-gray-100 hover:text-[#191C1E]"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          <Input
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              applySearch(e.target.value);
            }}
            prefix={<Search size={18} />}
            placeholder="Search buyer, property, seller..."
            allowClear
            className="!max-w-72 h-9 !bg-[#F7F6F4]"
          />
        </div>

        <DataTable
          columns={getBuyerActivityColumns()}
          data={rows}
          pageSize={Number(limit)}
          total={isError ? 0 : data?.meta?.total}
          isLoading={isFetching}
          emptyText={emptyText}
        />
      </div>
    </div>
  );
};

export default BuyerActivityTable;
