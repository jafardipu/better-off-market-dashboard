"use client";
import { useMemo, useState } from "react";
import { OffersSentHeader } from "./OffersSentHeader";
import {
  ConsolidatedSentOfferCard,
  OfferRoundComparison,
} from "./ConsolidatedSentOfferCard";
import { IPropertyResponse, IUser } from "@/types";
import {
  ConsolidatedOfferData,
  OFFER_STATUS,
  OfferHistoryEntry,
  getRoundTitleForBuyer,
  mapTermsToConsolidatedOfferData,
  formatDate,
} from "./utils.offer-received";
import OfferPropertyCard from "./offer-property-card";
import { OfferComparisonRow, OfferRoundSnapshot } from "./OfferComparisonRow";

interface RawSupportingDocument {
  name: string;
  url: string;
}

interface OffersSentProps {
  property: IPropertyResponse | null;
  seller: IUser;
  buyer: IUser;
  propertyId?: string;
  propertyLabel: string;
  history: OfferHistoryEntry[];
  currentRound: number;
  supportingDocuments?: RawSupportingDocument[];
  status: (typeof OFFER_STATUS)[keyof typeof OFFER_STATUS];
  onEditOfferDetails?: () => void;
}

export function OffersSent({
  property,
  seller,
  buyer,
  propertyId,
  propertyLabel,
  history,
  currentRound,
  supportingDocuments,
  onEditOfferDetails,
}: OffersSentProps) {
  // Initially highlight/display the current round — matches currentTerms.
  const [selectedRound, setSelectedRound] = useState(currentRound);

  const rounds: OfferRoundSnapshot[] = useMemo(
    () =>
      history.map((entry) => ({
        round: entry.round,
        amount: entry.offerAmount,
        closingDate: formatDate(entry.closingDate),
        title: getRoundTitleForBuyer(entry.madeBy, entry.round),
      })),
    [history],
  );

  const foundIndex = history.findIndex((entry) => entry.round === selectedRound);
  const selectedIndex = foundIndex === -1 ? history.length - 1 : foundIndex;
  const selectedTerms = history[selectedIndex];
  // History is oldest first, so the entry before the selected one is the
  // round this counter offer answered.
  const previousTerms = selectedIndex > 0 ? history[selectedIndex - 1] : undefined;

  const selectedOfferData: ConsolidatedOfferData = useMemo(
    () => mapTermsToConsolidatedOfferData(selectedTerms, supportingDocuments),
    [selectedTerms, supportingDocuments],
  );

  const comparison: OfferRoundComparison | undefined = useMemo(
    () =>
      previousTerms
        ? {
            previous: mapTermsToConsolidatedOfferData(previousTerms),
            previousRound: previousTerms.round,
          }
        : undefined,
    [previousTerms],
  );

  return (
    <div>
      {property ? (
        <OfferPropertyCard property={property} className="mb-2" />
      ) : (
        <div className="mb-2 rounded-lg border border-[#E0E3E5] bg-[#F2F4F6] px-4 py-5 text-sm text-primary-gray">
          This listing is no longer available.
        </div>
      )}
      <OffersSentHeader propertyId={propertyId} propertyLabel={propertyLabel} />

      <OfferComparisonRow
        rounds={rounds}
        selectedRound={selectedRound}
        onSelectRound={setSelectedRound}
      />

      <ConsolidatedSentOfferCard
        seller={seller}
        buyer={buyer}
        data={selectedOfferData}
        comparison={comparison}
        onEditOfferDetails={onEditOfferDetails}
      />
    </div>
  );
}
