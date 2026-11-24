"use client";
// NEW FLOW: buyer activity tracking.
// The Buyer Activity table for one user or one listing, shown inside another
// page. Its page number is kept in state, not ?page, so it can't move the host
// page's own lists.
import Empty from "@/components/ui/empty-data";
import { errorModification } from "@/lib/errors/errorModification";
import { useGetBuyerActivitiesQuery } from "@/redux/api/buyerActivityApi";
import DataTable from "@/utils/DataTable";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BuyerActivityNote } from "./BuyerActivityParts";
import {
  buyerActivityHref,
  getBuyerActivityArgs,
  TBuyerActivityFilters,
} from "./buyerActivity";
import {
  getBuyerActivityColumns,
  TBuyerActivityColumn,
} from "./buyerActivityColumns";

export const EMBEDDED_BUYER_ACTIVITY_LIMIT = 10;

export function EmbeddedBuyerActivity({
  filters,
  hiddenColumns,
  emptyMessage,
}: {
  filters: TBuyerActivityFilters;
  hiddenColumns: TBuyerActivityColumn[];
  emptyMessage: string;
}) {
  const [page, setPage] = useState(1);

  // Back to page 1 when the filter changes (e.g. moving between profiles
  // without leaving the page).
  const filterKey = JSON.stringify(filters);
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setPage(1);
  }

  const hasFilter = Object.values(filters).some(Boolean);
  const { data, isFetching, isError, error } = useGetBuyerActivitiesQuery(
    getBuyerActivityArgs({
      page,
      limit: EMBEDDED_BUYER_ACTIVITY_LIMIT,
      ...filters,
    }),
    { skip: !hasFilter },
  );

  const rows = isError ? [] : data?.data ?? [];

  let emptyText;
  if (isFetching) {
    emptyText = <div className="h-32" />;
  } else if (isError) {
    emptyText = <Empty message={errorModification(error)} className="my-8" />;
  } else {
    emptyText = <Empty message={emptyMessage} className="my-8" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <BuyerActivityNote />
        </div>
        {hasFilter && (
          <Link
            href={buyerActivityHref(filters)}
            className="flex items-center gap-1 whitespace-nowrap py-3 text-sm font-semibold text-[#1F4E8B] hover:underline"
          >
            Open in Buyer Activity <ArrowUpRight size={16} />
          </Link>
        )}
      </div>

      <div className="bg-section-bg rounded-lg">
        <DataTable
          columns={getBuyerActivityColumns(hiddenColumns)}
          data={rows}
          pageSize={EMBEDDED_BUYER_ACTIVITY_LIMIT}
          total={isError ? 0 : data?.meta?.total}
          isLoading={isFetching}
          emptyText={emptyText}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
