import Link from "next/link";

interface OffersReceivedHeaderProps {
  propertyId: string;
  propertyLabel: string;
}

export function OffersSentHeader({
  propertyId,
  propertyLabel,
}: OffersReceivedHeaderProps) {

  return (
    <div>
      <h1 className=" font-semibold text-primary-black lg:text-2xl sm:text-xl text-base mb-1">
        <Link
          href={`/listings/${propertyId}`}
          className="hover:text-blue-800 hover:underline duration-200 ease-in-out "
        >
          Offers sent — on {propertyLabel}{" "}
        </Link>
      </h1>
    </div>
  );
}
