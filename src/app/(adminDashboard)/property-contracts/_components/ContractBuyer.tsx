"use client";
// NEW FLOW: the contract's buyer. A BetterOffMarket user (accepted offer)
// links to their account; otherwise only the name the seller typed is known.
import {
  displayValue,
  userProfileHref,
} from "@/components/(adminDashboard)/property-records/format";
import { IPropertyContract } from "@/types";
import Link from "next/link";

export const ContractBuyer = ({
  contract,
  align = "left",
}: {
  contract: IPropertyContract;
  align?: "left" | "right";
}) => {
  const { buyer, buyerName } = contract;
  const alignClass = align === "right" ? "text-right" : "";

  if (!buyer?._id) {
    return (
      <p className={`text-[#191C1E] ${alignClass}`}>{displayValue(buyerName)}</p>
    );
  }

  return (
    <div className={alignClass}>
      <Link
        href={userProfileHref(buyer._id)}
        className="font-semibold text-[#1F4E8B] hover:underline"
      >
        {displayValue(buyer.name || buyerName)}
      </Link>
      {buyer.email && (
        <p className="text-sm font-normal text-[#565E74]">{buyer.email}</p>
      )}
    </div>
  );
};
