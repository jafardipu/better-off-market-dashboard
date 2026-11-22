import Link from "next/link";

interface OffersReceivedHeaderProps {
  propertyId?: string;
  propertyLabel: string;
}

export function OffersSentHeader({
  propertyId,
  propertyLabel,
}: OffersReceivedHeaderProps) {
  const title = (
    <>
      Offers sent — on {propertyLabel}{" "}
    </>
  );

  return (
    <div>
      <h1 className=" font-semibold text-primary-black lg:text-2xl sm:text-xl text-base mb-1">
        {propertyId ? (
          <Link
            href={`/listings/${propertyId}`}
            className="hover:text-blue-800 hover:underline duration-200 ease-in-out "
          >
            {title}
          </Link>
        ) : (
          <span>{title}</span>
        )}
      </h1>
    </div>
  );
}
