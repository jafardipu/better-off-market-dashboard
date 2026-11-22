"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { IPropertyResponse } from "@/types";
import { handlePropertiesSpecifications } from "@/utils/handlePropertiesSpecifications";
import Link from "next/link";
import Preview from "@/components/shared/utils/image_preview_option";
import ImagePreviewer from "@/components/shared/utils/images-previewer";
import ImageWithFallback from "@/components/shared/image/ImageWithFallback";
import { formatCurrency } from "./utils.offer-received";

export default function OfferPropertyCard({
  property,
  className,
}: {
  property: IPropertyResponse;
  className?: string;
}) {
  const [previewImgIndex, setPreviewImgIndex] = useState(-1);

  const images = property?.photos || [];

  const propertySpecs = handlePropertiesSpecifications(
    property?.propertyType,
    property?.specifications,
  ).filter((spec) => Boolean(spec.value));

  return (
    <>
      <div
        className={cn(
          "bg-[#F2F4F6] border border-[#E0E3E5] rounded-lg md:py-5 py-4 md:px-4 px-3 flex gap-4 items-center",
          className,
        )}
      >
        <Preview className="text-sm" onClick={() => setPreviewImgIndex(0)}>
          <ImageWithFallback
            src={images[0]}
            width={1200}
            height={1200}
            alt="property_image"
            className="rounded-md md:w-32 w-24 h-22 object-cover"
          />
        </Preview>
        <Link href={`/listings/${property?._id}`}>
          <h4 className="text-2xl font-semibold">{formatCurrency(property?.listingPrice)}</h4>
          <div className="space-x-2">
            {propertySpecs?.slice(0, 3)?.map((spec, index) => (
              <span
                key={index}
                className="text-primary-gray t"
              >
                {spec.value} {spec.suffix}{" "}
                <span className="ml-1"> {(index !== propertySpecs.length - 1 && index !== 2 ) && "-"}</span>
              </span>
            ))}
          </div>
          {/* <p className="text-primary-gray">3bd house — 1,450 sqft</p> */}
        </Link>
      </div>
      <ImagePreviewer
        imageUrls={images}
        previewImgIndex={previewImgIndex}
        setPreviewImgIndex={setPreviewImgIndex}
      />
    </>
  );
}
