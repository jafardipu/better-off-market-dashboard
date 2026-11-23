"use client";
import { Button } from "@/components/ui/button";
import Empty from "@/components/ui/empty-data";
import { errorModification } from "@/lib/errors/errorModification";
import { useGetSinglePropertyContractQuery } from "@/redux/api/propertyContractApi";
import { IPropertyContract } from "@/types";
import { Modal, Skeleton } from "antd";
import { X } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { PropertyStatusBadge, PropertySummary, SellerInfo } from "./ContractParts";
import {
  displayValue,
  formatLocalDate,
  formatPrice,
  formatUtcDate,
} from "./contract-utils";

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
  const contract = currentData?.data ?? fallback;

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
      width={560}
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

const ContractDetails = ({ contract }: { contract: IPropertyContract }) => {
  const { property, seller } = contract;

  const rows: { label: string; value: ReactNode }[] = [
    { label: "Listing price", value: formatPrice(property?.listingPrice) },
    { label: "Property type", value: displayValue(property?.propertyType) },
    { label: "County", value: displayValue(property?.county) },
    { label: "Buyer name", value: displayValue(contract.buyerName) },
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

      {/* Seller */}
      <div className="py-4">
        <p className="mb-3 text-gray-500">Seller</p>
        <SellerInfo seller={seller} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {property?._id && (
          <Button
            asChild
            className="flex-1 bg-main-color hover:bg-main-color/70"
          >
            <Link href={`/listings/${property._id}`}>View listing</Link>
          </Button>
        )}
        {seller?._id && (
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/seller-profile?seller=${seller._id}`}>
              View seller profile
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
