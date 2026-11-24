// components/listings/PendingApprovalQueue.tsx
"use client";

import ImageWithFallback from "@/components/shared/image/ImageWithFallback";
import { AlertCircleIcon, CalendarIcon, DockIcon, ImageIcon } from "lucide-react";

interface PendingListing {
  id: string | number;
  title: string;
  agentName: string;
  county: string;
  submittedDate: string;
  photoCount: number;
  documentCount: number;
  price: number;
  imageUrl: string;
  canApprove?: boolean;
}

interface PendingApprovalQueueProps {
  awaitingCount?: number;
  listings?: PendingListing[];
}

const DEFAULT_LISTINGS: PendingListing[] = [
  {
    id: 1,
    title: "Condo — Phoenix, AZ",
    agentName: "James R.",
    county: "Warren County",
    submittedDate: "Jun 14, 2026",
    photoCount: 2,
    documentCount: 1,
    price: 175000,
    imageUrl: "/listings/phoenix-condo-1.jpg",
    canApprove: true,
  },
  {
    id: 2,
    title: "Condo — Phoenix, AZ",
    agentName: "James R.",
    county: "Warren County",
    submittedDate: "Jun 14, 2026",
    photoCount: 2,
    documentCount: 0,
    price: 175000,
    imageUrl: "/listings/phoenix-condo-2.jpg",
    canApprove: false,
  },
  {
    id: 3,
    title: "Loft — Chicago, IL",
    agentName: "Sarah L.",
    county: "Cook County",
    submittedDate: "Jun 14, 2026",
    photoCount: 2,
    documentCount: 1,
    price: 410000,
    imageUrl: "/listings/chicago-loft-1.jpg",
    canApprove: true,
  },
  {
    id: 4,
    title: "Loft — Chicago, IL",
    agentName: "Sarah L.",
    county: "Cook County",
    submittedDate: "Jun 14, 2026",
    photoCount: 2,
    documentCount: 1,
    price: 410000,
    imageUrl: "/listings/chicago-loft-2.jpg",
    canApprove: true,
  },
];

const formatPrice = (value: number) =>
  `$${value.toLocaleString("en-US")}`;

export function PendingApprovalQueue({
  awaitingCount = 5,
  listings = DEFAULT_LISTINGS,
}: PendingApprovalQueueProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        {/* <h2 className="text-xl font-bold text-primary-black">
          Pending Approval Queue
        </h2> */}
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
          {awaitingCount} ITEMS AWAITING
        </span>
      </div>

      <div className="space-y-4">
        {listings.map((listing) => (
          <PendingApprovalCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

function PendingApprovalCard({ listing }: { listing: PendingListing }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-gray-50 p-4 sm:flex-row sm:items-center">
      {/* Image */}
      <ImageWithFallback
        src={listing.imageUrl}
        alt={listing.title}
        width={128}
        height={96}
        className="h-24 w-full shrink-0 rounded-xl object-cover sm:h-24 sm:w-32"
      />

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-primary-black">{listing.title}</h3>
        <p className="mt-0.5 text-sm text-gray-500">
          {listing.agentName} · {listing.county}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <CalendarIcon className="size-3.5" />
            Submitted {listing.submittedDate}
          </span>
          <span className="flex items-center gap-1">
            <ImageIcon className="size-3.5" />
            {listing.photoCount} photos
          </span>
          {listing.documentCount > 0 ? (
            <span className="flex items-center gap-1">
              <DockIcon className="size-3.5" />
              {listing.documentCount} document
              {listing.documentCount > 1 ? "s" : ""}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-500">
              <AlertCircleIcon className="size-3.5" />0 documents
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button className="rounded-md bg-gray-200 px-4 py-1.5 text-sm font-medium text-primary-black hover:bg-gray-300">
            Review
          </button>
          {listing.canApprove && (
            <button className="rounded-md bg-primary-blue px-4 py-1.5 text-sm font-medium text-white hover:opacity-90">
              Approve
            </button>
          )}
          <button className="rounded-md border border-red-500 px-4 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50">
            Reject
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right">
        <span className="text-xl font-bold text-primary-black">
          {formatPrice(listing.price)}
        </span>
      </div>
    </div>
  );
}