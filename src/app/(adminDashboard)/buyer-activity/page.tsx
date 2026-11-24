// NEW FLOW: buyer activity tracking.
import React from "react";
import BuyerActivityTable from "./_components/BuyerActivityTable";

export default function BuyerActivityPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="md:text-3xl text-xl font-semibold text-text-color mb-1">
          Buyer Activity
        </h1>
        <p className="text-[#565E74] md:text-base text-sm font-normal">
          The first time each buyer viewed, saved, RSVP&apos;d to, messaged
          about, made an offer on and negotiated on each listing.
        </p>
      </div>
      <BuyerActivityTable />
    </div>
  );
}
