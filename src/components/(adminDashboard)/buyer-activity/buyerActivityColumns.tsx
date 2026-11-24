"use client";
// NEW FLOW: buyer activity tracking.
import {
  PersonInfo,
  PropertyStatusBadge,
  PropertySummary,
} from "@/components/(adminDashboard)/property-records/RecordParts";
import {
  displayValue,
  EMPTY_VALUE,
  formatDateTime,
  userProfileHref,
} from "@/components/(adminDashboard)/property-records/format";
import { IBuyerActivity } from "@/types";
import { TableProps } from "antd";
import Link from "next/link";
import { ContactSourceBadge } from "./BuyerActivityParts";
import { ACTIVITY_MILESTONES } from "./buyerActivity";

// Columns a view can hide when every row shares the same value.
export type TBuyerActivityColumn = "buyer" | "property" | "seller";

type TColumns = NonNullable<TableProps<IBuyerActivity>["columns"]>;

export const getBuyerActivityColumns = (
  hidden: TBuyerActivityColumn[] = [],
): TColumns => {
  const optional: Record<TBuyerActivityColumn, TColumns[number]> = {
    buyer: {
      key: "buyer",
      title: "Buyer",
      render: (_, record) => (
        <div className="min-w-[220px]">
          <PersonInfo
            person={record.buyer}
            removedText="Buyer account removed"
            href={
              record.buyer?._id
                ? userProfileHref(record.buyer._id, "buyer-activity")
                : undefined
            }
          />
        </div>
      ),
    },
    property: {
      key: "property",
      title: "Property",
      render: (_, record) => (
        <div className="min-w-[240px]">
          <PropertySummary
            property={record.property}
            href={
              record.property?._id
                ? `/listings/${record.property._id}`
                : undefined
            }
          >
            <div className="mt-1">
              <PropertyStatusBadge status={record.property?.status} />
            </div>
          </PropertySummary>
        </div>
      ),
    },
    seller: {
      key: "seller",
      title: "Seller",
      render: (_, record) =>
        record.seller ? (
          <div className="min-w-[180px]">
            <p className="font-semibold text-[#191C1E]">
              {displayValue(record.seller.name)}
            </p>
            {record.seller.email ? (
              <Link
                href={`mailto:${record.seller.email}`}
                className="block text-sm text-[#565E74]"
              >
                {record.seller.email}
              </Link>
            ) : (
              <p className="text-sm text-[#565E74]">{EMPTY_VALUE}</p>
            )}
          </div>
        ) : (
          <p className="text-sm italic text-[#565E74]">
            Seller account removed
          </p>
        ),
    },
  };

  const columns: TColumns = [
    ...(["buyer", "property", "seller"] as const)
      .filter((key) => !hidden.includes(key))
      .map((key) => optional[key]),
    ...ACTIVITY_MILESTONES.map(({ key, label }) => ({
      key,
      title: label,
      dataIndex: key,
      render: (value: string | null) => (
        <p className="whitespace-nowrap text-gray-500">
          {formatDateTime(value)}
        </p>
      ),
    })),
    {
      key: "sellerAnswer",
      title: "Seller's answer",
      render: (_, record) => (
        <ContactSourceBadge source={record.contract?.buyerContactSource} />
      ),
    },
  ];

  return columns;
};
