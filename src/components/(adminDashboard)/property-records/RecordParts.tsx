"use client";
// Display parts shared by Property Contracts and Buyer Activity.
import ImageWithFallback from "@/components/shared/image/ImageWithFallback";
import { cn } from "@/lib/utils";
import { TPropertyStatus } from "@/types";
import { getInitials } from "@/utils/getInitials";
import { statusColor } from "@/utils/status-color";
import { Avatar } from "antd";
import Link from "next/link";
import { ReactNode } from "react";
import {
  displayValue,
  EMPTY_VALUE,
  formatCityLine,
  TPropertyAddress,
} from "./format";

export const BADGE_CLASS =
  "inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium";

export const PropertyStatusBadge = ({
  status,
}: {
  status?: TPropertyStatus | null;
}) => {
  if (!status) return <span>{EMPTY_VALUE}</span>;
  return (
    <span
      className={cn(
        BADGE_CLASS,
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
  href,
  children,
}: {
  property?: TPropertyAddress | null;
  size?: "sm" | "lg";
  // Makes the street address a link.
  href?: string;
  // Rendered under the address.
  children?: ReactNode;
}) => {
  const isLarge = size === "lg";
  const street = displayValue(property?.streetAddress);
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
        {href ? (
          <Link
            href={href}
            className="font-semibold text-[#191C1E] hover:underline"
          >
            {street}
          </Link>
        ) : (
          <p className="font-semibold text-[#191C1E]">{street}</p>
        )}
        <p className="text-sm text-[#565E74]">{formatCityLine(property)}</p>
        {children}
      </div>
    </div>
  );
};

type TPerson = {
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  profile?: string | null;
};

// Avatar, name and contact details of a user.
export const PersonInfo = ({
  person,
  removedText,
  href,
  showPhone = false,
}: {
  person?: TPerson | null;
  // Shown when the account record no longer exists.
  removedText: string;
  // Makes the name a link.
  href?: string;
  showPhone?: boolean;
}) => {
  if (!person) {
    return <p className="text-sm italic text-[#565E74]">{removedText}</p>;
  }

  const name = displayValue(person.name);

  return (
    <div className="flex items-center gap-3">
      <Avatar
        src={person.profile || undefined}
        size={40}
        className="shrink-0 !bg-[#DCE6FF] !font-semibold !text-[#1e3a8a]"
      >
        {getInitials(person.name ?? "")}
      </Avatar>
      <div className="min-w-0">
        {href ? (
          <Link
            href={href}
            className="font-semibold text-[#191C1E] hover:underline"
          >
            {name}
          </Link>
        ) : (
          <p className="font-semibold text-[#191C1E]">{name}</p>
        )}
        {person.email ? (
          <Link
            href={`mailto:${person.email}`}
            className="block text-sm text-[#565E74]"
          >
            {person.email}
          </Link>
        ) : (
          <p className="text-sm text-[#565E74]">{EMPTY_VALUE}</p>
        )}
        {showPhone &&
          (person.phoneNumber ? (
            <Link
              href={`tel:${person.phoneNumber}`}
              className="block text-sm text-[#565E74]"
            >
              {person.phoneNumber}
            </Link>
          ) : (
            <p className="text-sm text-[#565E74]">{EMPTY_VALUE}</p>
          ))}
      </div>
    </div>
  );
};

export const SellerInfo = ({ seller }: { seller?: TPerson | null }) => (
  <PersonInfo person={seller} removedText="Seller account removed" showPhone />
);
