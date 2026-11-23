"use client";
import ImageWithFallback from "@/components/shared/image/ImageWithFallback";
import { cn } from "@/lib/utils";
import {
  IPropertyContractProperty,
  IPropertyContractSeller,
  TPropertyStatus,
} from "@/types";
import { getInitials } from "@/utils/getInitials";
import { statusColor } from "@/utils/status-color";
import { Avatar } from "antd";
import Link from "next/link";
import { displayValue, EMPTY_VALUE, formatCityLine } from "./contract-utils";

export const PropertyStatusBadge = ({
  status,
}: {
  status?: TPropertyStatus | null;
}) => {
  if (!status) return <span>{EMPTY_VALUE}</span>;
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium",
        statusColor[status] ?? "bg-gray-100 text-gray-700",
      )}
    >
      {status}
    </span>
  );
};

export const PropertySummary = ({
  property,
  size = "sm",
}: {
  property?: IPropertyContractProperty | null;
  size?: "sm" | "lg";
}) => {
  const isLarge = size === "lg";
  return (
    <div className="flex items-center gap-3">
      <ImageWithFallback
        src={property?.photos?.[0]}
        alt={property?.streetAddress || "Property photo"}
        width={isLarge ? 112 : 64}
        height={isLarge ? 84 : 48}
        className={cn(
          "shrink-0 rounded-md object-cover",
          isLarge ? "h-[84px] w-28" : "h-12 w-16",
        )}
      />
      <div className="min-w-0">
        <p className="font-semibold text-[#191C1E]">
          {displayValue(property?.streetAddress)}
        </p>
        <p className="text-sm text-[#565E74]">{formatCityLine(property)}</p>
      </div>
    </div>
  );
};

export const SellerInfo = ({
  seller,
}: {
  seller?: IPropertyContractSeller | null;
}) => {
  if (!seller) {
    return (
      <p className="text-sm italic text-[#565E74]">Seller account removed</p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar
        src={seller.profile || undefined}
        size={40}
        className="shrink-0 !bg-[#DCE6FF] !font-semibold !text-[#1e3a8a]"
      >
        {getInitials(seller.name)}
      </Avatar>
      <div className="min-w-0">
        <p className="font-semibold text-[#191C1E]">
          {displayValue(seller.name)}
        </p>
        {seller.email ? (
          <Link
            href={`mailto:${seller.email}`}
            className="block text-sm text-[#565E74]"
          >
            {seller.email}
          </Link>
        ) : (
          <p className="text-sm text-[#565E74]">{EMPTY_VALUE}</p>
        )}
        {seller.phoneNumber ? (
          <Link
            href={`tel:${seller.phoneNumber}`}
            className="block text-sm text-[#565E74]"
          >
            {seller.phoneNumber}
          </Link>
        ) : (
          <p className="text-sm text-[#565E74]">{EMPTY_VALUE}</p>
        )}
      </div>
    </div>
  );
};
