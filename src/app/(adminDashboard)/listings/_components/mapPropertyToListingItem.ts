// components/listings/mapPropertyToListingItem.ts
import type { ListingItem, ListingAction } from "./ListingQueue";

interface RawProperty {
  _id: string;
  streetAddress: string;
  assignableContractFile: Object;
  propertyType: string;
  city: string;
  county: string;
  state: string;
  status: string;
  zipCode: string;
  seller: { name: string };
  photos: string[];
  documents: unknown[];
  listingPrice: number;
  createdAt: string;
}

function formatSubmittedDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildActionsForStatus(
  propertyId: string,
  status: string,
): ListingAction[] {
  switch (status) {
    case "Pending":
      return [
        {
          label: "Review",
          variant: "neutral",
          link: `/listings/${propertyId}`,
        },
        {
          label: "Approve",
          variant: "primary",
          onClick: () => console.log("approve", propertyId),
        },
        {
          label: "Reject",
          variant: "danger-outline",
          onClick: () => console.log("reject", propertyId),
        },
      ];
    case "Active":
    case "Under Contract":
    case "Sold":
      return [
        {
          label: "View",
          variant: "neutral",
          link: `/listings/${propertyId}`,
        },
      ];
    case "Rejected":
      return [
        {
          label: "Review Again",
          variant: "success-outline",
          link: `/listings/${propertyId}`,
        },
      ];
    default:
      return [];
  }
}

export function mapPropertyToListingItem(property: RawProperty): ListingItem {
  return {
    id: property._id,
    title:
      property?.propertyType +
      " - " +
      property.streetAddress +
      ", " +
      property?.city +
      ", " +
      property?.state +
      ", " +
      property?.zipCode,
    agentName: property.seller?.name ?? "Unknown seller",
    county: property.county,
    submittedDate: formatSubmittedDate(property.createdAt),
    photoCount: property.photos?.length ?? 0,
    documentCount: property?.assignableContractFile
      ? property.documents?.length + 1
      : (property?.documents?.length ?? 0),
    price: property.listingPrice,
    images: property.photos,
    actions: [
      {
        label: "Review",
        variant: "neutral",
        link: `/listings/${property._id}`,
      },
    ],
    showApprovalActions: property.status === "Pending",
  };
}
