"use client";
import {
  useGetSingleOfferQuery,
} from "@/redux/api/offerApi";
import { useParams } from "next/navigation";
import { OffersSent } from "./OffersSent";
import { Empty } from "antd";
import OffersDetailsPageSkeleton from "./OffersDetailsPageSkeleton";

export default function ReviewSentOfferContainer() {
  const offerId = useParams()?.["order-id"];
  const { data, isLoading } = useGetSingleOfferQuery(offerId, {
    skip: !offerId,
  });

  const offer = data?.data;

  if (isLoading) {
    return <OffersDetailsPageSkeleton />;
  }

  if (!offer) return <Empty className="mt-16" />;

  const { seller, buyer, property, history, currentRound, supportingDocuments } = offer;

  const propertyLabel = `${property.propertyType} — ${property.streetAddress},  ${property.city}, ${property.state}, ${property.zipCode}, ${property.county}`;

  return (
    <OffersSent
      property={property}
      seller={seller}
      buyer={buyer}
      propertyId={property?._id}
      propertyLabel={propertyLabel}
      history={history}
      currentRound={currentRound}
      supportingDocuments={supportingDocuments}
      status={offer.status}
    />
  );
}