import PropertyImages from "./PropertyImages";
import { PropertyInfo } from "./PropertyInfo";
import { Documents } from "./Documents";
import { LocationMap } from "./LocationMap";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminDecisionCard } from "./AdminDecisionCard";
import { IPropertyResponse } from "@/types";
import { BasicPropertyDetails } from "./BasicPropertyDetails";
import ProfileCard from "@/components/shared/ProfileCard";

export default function PropertyContainer({
  property,
}: {
  property: IPropertyResponse;
}) {
  return (
    <div>
      <PropertyImages
        propertyImages={property?.photos}
        propertyType={property?.propertyType}
        location={property?.location}
      />
      <div className="grid lg:grid-cols-6 gap-6 mt-4">
        <div className="lg:col-span-4 space-y-6">
          <BasicPropertyDetails property={property} />
          <PropertyInfo property={property} />
          {property?.documents?.length || property?.assignableContractFile ? (
            <Documents
              documents={property?.documents}
              assignableContractFile={property?.assignableContractFile}
            />
          ) : (
            ""
          )}
          <LocationMap
            lat={property?.location?.coordinates[1]}
            lng={property?.location?.coordinates[0]}
          />
        </div>
        <div className="lg:col-span-2 md:flex flex-wrap lg:flex-col gap-4 space-y-4">
          <AdminDecisionCard property={property} />

          <ProfileCard seller={property?.seller} />
        </div>
      </div>
    </div>
  );
}
