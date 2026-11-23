import React from "react";
import PropertyContractsTable from "./_components/PropertyContractsTable";

export default function PropertyContractsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="md:text-3xl text-xl font-semibold text-text-color mb-1">
          Property Contracts
        </h1>
        <p className="text-[#565E74] md:text-base text-sm font-normal">
          Contract details sellers submit when they mark a listing Under
          Contract.
        </p>
      </div>
      <PropertyContractsTable />
    </div>
  );
}
