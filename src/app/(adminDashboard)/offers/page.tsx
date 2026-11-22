import React from "react";
import { OfferStatsRow } from "./_components/OfferStatsRow";
import OffersTable from "./_components/OffersTable";

export default function OffersPage() {
  return (
    <div className="space-y-6">
      <h1 className="md:text-3xl text-xl font-semibold text-text-color mb-1">
        Offer Monitoring
      </h1>
      <OfferStatsRow />
      <OffersTable />
    </div>
  );
}
