"use client";
import {
  contractBuyerActivityHref,
  getBuyerContactSourceLabel,
  getContractSourceLabel,
} from "@/components/(adminDashboard)/buyer-activity/buyerActivity";
import {
  ActivityTimeline,
  NeedsReviewBadge,
} from "@/components/(adminDashboard)/buyer-activity/BuyerActivityParts";
import {
  displayValue,
  EMPTY_VALUE,
  formatDateTime,
  formatLocalDate,
  formatPrice,
  formatUtcDate,
} from "@/components/(adminDashboard)/property-records/format";
import {
  PropertyStatusBadge,
  PropertySummary,
  SellerInfo,
} from "@/components/(adminDashboard)/property-records/RecordParts";
import { Button } from "@/components/ui/button";
import Empty from "@/components/ui/empty-data";
import { errorModification } from "@/lib/errors/errorModification";
import { useGetSinglePropertyContractQuery } from "@/redux/api/propertyContractApi";
import { IPropertyContract } from "@/types";
import { Modal, Skeleton } from "antd";
import { X } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { ContractBuyer } from "./ContractBuyer";

interface PropertyContractDetailsModalProps {
  // Driven by ?contractId= in the URL; null means closed.
  contractId: string | null;
  // The matching table row, if it is on the current page, so the modal can
  // render immediately while the single-contract request completes.
  fallback?: IPropertyContract;
  onClose: () => void;
}

export function PropertyContractDetailsModal({
  contractId,
  fallback,
  onClose,
}: PropertyContractDetailsModalProps) {
  // Keep the last opened id after closing, so the content doesn't flash to a
  // skeleton during the close animation.
  const [shownId, setShownId] = useState(contractId);
  if (contractId && contractId !== shownId) setShownId(contractId);

  const { currentData, isError, error } = useGetSinglePropertyContractQuery(
    shownId ?? "",
    { skip: !shownId },
  );
  // Fetched fields win; the row fills any the single endpoint leaves out.
  const contract = currentData?.data
    ? { ...fallback, ...currentData.data }
    : fallback;

  let body: ReactNode;
  if (isError) {
    body = <Empty message={errorModification(error)} className="my-8" />;
  } else if (!contract) {
    body = <Skeleton active avatar paragraph={{ rows: 8 }} />;
  } else {
    body = <ContractDetails contract={contract} />;
  }

  return (
    <Modal
      open={Boolean(contractId)}
      onCancel={onClose}
      footer={null}
      closeIcon={<X size={18} />}
      centered
      width={600}
    >
      <h2 className="mb-5 text-lg font-bold text-[#191C1E]">
        Property contract details
      </h2>
      {body}
    </Modal>
  );
}

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <span className="text-gray-500">{label}</span>
    <span className="text-right font-medium text-black">{value}</span>
  </div>
);

const getOfferId = (offer: IPropertyContract["offer"]) =>
  typeof offer === "string" ? offer : offer?._id;

const ContractDetails = ({ contract }: { contract: IPropertyContract }) => {
  const { property, seller } = contract;
  const offerId = getOfferId(contract.offer);

  const rows: { label: string; value: ReactNode }[] = [
    { label: "Listing price", value: formatPrice(property?.listingPrice) },
    { label: "Property type", value: displayValue(property?.propertyType) },
    { label: "County", value: displayValue(property?.county) },
    // NEW FLOW: linked to the account when the buyer is a BetterOffMarket user.
    { label: "Buyer", value: <ContractBuyer contract={contract} align="right" /> },
    {
      label: "Source",
      value: getContractSourceLabel(contract.source) ?? EMPTY_VALUE,
    },
    {
      label: "Anticipated closing date",
      value: formatUtcDate(contract.closingDate),
    },
    { label: "Title company", value: displayValue(contract.titleCompany) },
    {
      label: "Status change",
      value: `${displayValue(contract.previousStatus)} → Under Contract`,
    },
    {
      label: "Current status",
      value: <PropertyStatusBadge status={property?.status} />,
    },
    { label: "Submitted on", value: formatLocalDate(contract.createdAt) },
    // NEW FLOW: platform activity check.
    {
      label: "BOM activity",
      value:
        typeof contract.hasPlatformActivity === "boolean"
          ? contract.hasPlatformActivity
            ? "Yes"
            : "No"
          : EMPTY_VALUE,
    },
  ];

  return (
    <div>
      {/* Property */}
      <div className="border-b border-gray-100 pb-4">
        <PropertySummary property={property} size="lg" />
      </div>

      {/* Contract details */}
      <div className="divide-y divide-gray-100 border-b border-gray-100">
        {rows.map((row) => (
          <DetailRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>

      {/* NEW FLOW: seller's answer and certification. */}
      <div className="space-y-2 border-b border-gray-100 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-gray-500">Seller&apos;s answer</p>
          {contract.needsReview && <NeedsReviewBadge />}
        </div>
        <p className="font-medium text-black">
          {getBuyerContactSourceLabel(contract.buyerContactSource, "full") ??
            EMPTY_VALUE}
        </p>
        <p className="text-sm text-[#565E74]">
          {contract.certifiedAt
            ? `Seller certified the information is accurate and complete — ${formatDateTime(contract.certifiedAt)}`
            : `Certified: ${EMPTY_VALUE}`}
        </p>
      </div>

      {/* NEW FLOW: this buyer's activity on this listing. */}
      <div className="border-b border-gray-100 py-4">
        <p className="mb-1 text-gray-500">Buyer activity on this listing</p>
        {contract.buyer?._id ? (
          <ActivityTimeline activity={contract.buyerActivity} />
        ) : (
          <p className="text-sm text-[#565E74]">
            The buyer was entered as a typed name, so they can&apos;t be matched
            to a BetterOffMarket account. Use &quot;View buyer activity&quot; to
            see everyone who interacted with this listing.
          </p>
        )}
      </div>

      {/* Seller */}
      <div className="py-4">
        <p className="mb-3 text-gray-500">Seller</p>
        <SellerInfo seller={seller} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {property?._id && (
          <Button asChild className="bg-main-color hover:bg-main-color/70">
            <Link href={`/listings/${property._id}`}>View listing</Link>
          </Button>
        )}
        {seller?._id && (
          <Button asChild variant="outline">
            <Link href={`/seller-profile?seller=${seller._id}`}>
              View seller profile
            </Link>
          </Button>
        )}
        {/* NEW FLOW: buyer activity and the accepted offer. */}
        {property?._id && (
          <Button asChild variant="outline">
            <Link href={contractBuyerActivityHref(contract)}>
              View buyer activity
            </Link>
          </Button>
        )}
        {offerId && (
          <Button asChild variant="outline">
            <Link href={`/orders/${offerId}`}>View accepted offer</Link>
          </Button>
        )}
      </div>
    </div>
  );
};
