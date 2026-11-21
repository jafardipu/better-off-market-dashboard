import { Boxes, Building, Calendar, Cuboid, LandPlot } from "lucide-react";
import { AreaIcon, BedIcon, ShawarIcon } from "@/icon";
import { priceFormatter } from "@/utils/priceFormatter";

const formatCurrencySpec = (value: unknown) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? priceFormatter.format(amount) : value;
};

export const handlePropertiesSpecifications = (
  propertyType: string,
  specifications: any,
) => {
  switch (propertyType) {
    case "Residential":
      return [
        {
          icon: BedIcon,
          value: specifications?.bedrooms,
          suffix: "Beds",
          label: "Bedrooms",
        },
        {
          icon: ShawarIcon,
          value: specifications?.fullBaths,
          suffix: "Baths",
          label: "Bathrooms",
        },
        {
          icon: AreaIcon,
          value: specifications?.sqFootage,
          suffix: "Sq. Ft",
          label: "Sq. Footage",
        },
        {
          icon: Calendar,
          value: specifications?.yearBuilt,
          suffix: "",
          label: "Year Built",
        },
      ];

    case "Multi-Family":
      return [
        {
          icon: Boxes,
          value: specifications?.totalUnits,
          suffix: "Units",
          label: "Total Units",
        },
        {
          // icon: ShawarIcon,
          value: formatCurrencySpec(specifications?.totalRent),
          suffix: "Rent",
          label: "Total Rent",
        },
        {
          icon: AreaIcon,
          value: specifications?.lotSize,
          suffix: "Acres",
          label: "Lot Size",
        },
        {
          icon: Calendar,
          value: specifications?.yearBuilt,
          suffix: "",
          label: "Year Built",
        },
      ];

    case "Commercial":
      return [
        {
          icon: Building,
          value: specifications?.totalBuildings,
          suffix: "Buildings",
          label: "Total Buildings",
        },
        {
          // icon: ShawarIcon,
          value: specifications?.totalUnits,
          suffix: "Units",
          label: "Total Units",
        },
        {
          icon: AreaIcon,
          value: specifications?.totalSqFootage,
          suffix: "Sq.Ft",
          label: "Total Sq.Ft",
        },
        {
          icon: Calendar,
          value: specifications?.yearBuilt,
          suffix: "",
          label: "Year Built",
        },
      ];

    case "Land":
      return [
        {
          icon: Cuboid,
          value: specifications?.lotSize,
          suffix: "Acres",
          label: "Lot Size",
        },
        {
          icon: LandPlot,
          value: specifications?.totalParcels,
          suffix: "Parcels",
          label: "Total Parcels",
        },
      ];

    default:
      return [
        {
          icon: Cuboid,
          value: specifications?.lotSizeUnit || specifications?.lotSize,
          suffix: "Acres",
          label: "Lot Size",
        },
        {
          icon: LandPlot,
          value: specifications?.totalParcels,
          suffix: "Parcels",
        },
      ];
  }
};
