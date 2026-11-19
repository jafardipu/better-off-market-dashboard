"use client";
import ImageWithFallback from "@/components/shared/image/ImageWithFallback";
import Preview from "@/components/shared/utils/image_preview_option";
import ImagePreviewer from "@/components/shared/utils/images-previewer";
import { ILocation } from "@/types";
import { LayoutGrid } from "lucide-react";
import { useState } from "react";

export default function PropertyImages({
  propertyImages,
  propertyType,
}: {
  propertyImages: string[];
  propertyType: string;
  location: ILocation;
}) {
  const [previewImgIndex, setPreviewImgIndex] = useState(-1);

  const images = propertyImages;

  return (
    <>
      <div className="w-full h-[85vw] sm:h-[90vw] lg:h-[30vw] max-h-90 sm:max-h-125  lg:max-h-125">
        <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-[2fr_1fr] lg:grid-rows-2 gap-2 sm:gap-4 h-full w-full min-h-0">
          {/* Main image */}
          <div className="col-span-2 row-span-1 lg:row-span-2 relative h-full w-full min-h-0">
            <Preview
              onClick={() => setPreviewImgIndex(0)}
              className="h-full w-full"
            >
              <ImageWithFallback
                src={propertyImages[0]}
                alt="property_image_1"
                width={1200}
                height={1200}
                className="absolute inset-0 w-full h-full object-cover  lg:rounded-l-xl lg:rounded-r-none"
              />
            </Preview>
            <span className="absolute top-3 left-3 sm:top-4.5 sm:left-5 text-xs font-bold text-primary-color bg-white py-1.5 px-3 sm:py-2 rounded-full uppercase z-10">
              {propertyType}
            </span>
          </div>

          {/* Image 2 — visible on ALL sizes */}
          <div className="col-span-1 row-start-2 lg:row-start-1 lg:col-start-3 relative h-full w-full min-h-0">
            <Preview
              onClick={() => setPreviewImgIndex(1)}
              className="h-full w-full"
            >
              <ImageWithFallback
                src={propertyImages[1]}
                alt="property_image_2"
                width={1200}
                height={1200}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </Preview>
          </div>

          {/* Image 3 — visible on ALL sizes, carries "show all" on mobile, Share on lg */}
          <div className="col-span-1 row-start-2 lg:row-start-1 lg:col-start-4 relative h-full w-full min-h-0">
            <Preview
              onClick={() => setPreviewImgIndex(2)}
              className="h-full w-full"
            >
              <ImageWithFallback
                src={propertyImages[2]}
                alt="property_image_3"
                width={1200}
                height={1200}
                className="absolute inset-0 w-full h-full object-cover lg:rounded-tr-xl"
              />
            </Preview>

            {/* Mobile/tablet: show all photos overlay */}
            <div
              onClick={() => setPreviewImgIndex(5)}
              className="lg:hidden bg-white/90 flex items-center gap-1 absolute bottom-2 right-2 px-2 py-1.5 text-xs sm:text-sm font-medium rounded-md z-50 cursor-pointer"
            >
              <LayoutGrid size={14} className="sm:w-4 sm:h-4" /> Show all photos
            </div>
          </div>

          {/* Image 4 — desktop only, keeps the 2x2 grid on the right */}
          <div className="hidden lg:block relative lg:col-start-3 lg:row-start-2 h-full w-full min-h-0">
            <Preview
              onClick={() => setPreviewImgIndex(3)}
              className="h-full w-full"
            >
              <ImageWithFallback
                src={propertyImages[3]}
                alt="property_image_4"
                width={1200}
                height={1200}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </Preview>
          </div>

          {/* Image 5 — desktop only */}
          <div className="hidden lg:block relative lg:col-start-4 lg:row-start-2 h-full w-full min-h-0">
            <Preview
              onClick={() => setPreviewImgIndex(4)}
              className="h-full w-full"
            >
              <ImageWithFallback
                src={propertyImages[4]}
                alt="property_image_5"
                width={1200}
                height={1200}
                className="absolute inset-0 w-full h-full object-cover lg:rounded-br-xl"
              />
            </Preview>
            {propertyImages[5] && (
              <div
                onClick={() => setPreviewImgIndex(0)}
                className="bg-white/90 flex items-center gap-1 absolute bottom-4 right-4 px-2 py-1.5 text-sm font-medium rounded-md z-999 cursor-pointer z-20"
              >
                <LayoutGrid size={16} /> Show all photos
              </div>
            )}
          </div>
        </div>
      </div>

      <>
        <ImagePreviewer
          imageUrls={images}
          previewImgIndex={previewImgIndex}
          setPreviewImgIndex={setPreviewImgIndex}
        />
      </>
    </>
  );
}
