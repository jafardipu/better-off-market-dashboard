"use client";
import { useMemo, useState } from "react";
import { OffersSentHeader } from "./OffersSentHeader";
import { ConsolidatedSentOfferCard } from "./ConsolidatedSentOfferCard";
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
  property: IPropertyResponse;
  seller: IUser;
  buyer: IUser;
  propertyId: string;
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

  const selectedTerms =
    history.find((entry) => entry.round === selectedRound) ??
    history[history.length - 1];

  const selectedOfferData: ConsolidatedOfferData = useMemo(
    () => mapTermsToConsolidatedOfferData(selectedTerms, supportingDocuments),
    [selectedTerms, supportingDocuments],
  );

  return (
    <div>
      <OfferPropertyCard property={property} className="mb-2" />
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
        onEditOfferDetails={onEditOfferDetails}
      />
    </div>
  );
}
