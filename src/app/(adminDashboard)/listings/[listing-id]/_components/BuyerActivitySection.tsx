"use client";
// NEW FLOW: every buyer who interacted with this listing. Matters most when the
// seller marked it Under Contract manually and the buyer is only a typed name.
import { EmbeddedBuyerActivity } from "@/components/(adminDashboard)/buyer-activity/EmbeddedBuyerActivity";
import { Activity } from "lucide-react";

export function BuyerActivitySection({ propertyId }: { propertyId: string }) {
  return (
    <div className="p-6 bg-[#F2F4F6] rounded-lg border border-[#EFEAE8]">
      <h1 className="text-2xl font-semibold mb-4 text-primary-black flex items-center gap-1.5">
        <Activity color="#00214C" /> Buyer activity
      </h1>
      <EmbeddedBuyerActivity
        filters={{ property: propertyId }}
        hiddenColumns={["property", "seller"]}
        emptyMessage="No buyer activity on this listing yet"
      />
    </div>
  );
}
