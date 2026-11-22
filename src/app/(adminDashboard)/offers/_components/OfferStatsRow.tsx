"use client";
import { useGetOfferStatsQuery } from "@/redux/api/offerApi";
import { Skeleton } from "antd";
import {
  BarChart3,
  Clock,
  CheckCircle2,
  GitPullRequestClosed,
  ArrowDownWideNarrow,
} from "lucide-react";

interface StatCard {
  icon: React.ReactNode;
  iconBgClass: string;
  label: string;
  value: string | number;
}

export function OfferStatsRow() {
  const { data, isLoading } = useGetOfferStatsQuery(undefined);

  console.log("=======>", data?.data);

  const stats: StatCard[] = [
    {
      icon: <BarChart3 className="size-5 text-primary-blue" />,
      iconBgClass: "bg-blue-50",
      label: "Total Offers",
      value: data?.data?.totalOffers ?? 0,
    },
    {
      icon: <Clock className="size-5 text-orange-500" />,
      iconBgClass: "bg-orange-50",
      label: "Pending",
      value: data?.data?.pending ?? 0,
    },
    {
      icon: <CheckCircle2 className="size-5 text-green-600" />,
      iconBgClass: "bg-green-50",
      label: "Accepted",
      value: data?.data?.accepted ?? 0,
    },
    {
      icon: <ArrowDownWideNarrow className="size-5 text-yellow-500" />,
      iconBgClass: "bg-yellow-50",
      label: "Withdrawn",
      value: data?.data?.withdrawn ?? 0,
    },
    {
      icon: <GitPullRequestClosed className="size-5 text-red-600" />,
      iconBgClass: "bg-red-50",
      label: "Rejected",
      value: data?.data?.rejected ?? 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-2xl bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
        >
          <span
            className={`flex size-10 items-center justify-center rounded-lg ${stat.iconBgClass}`}
          >
            {stat.icon}
          </span>

          <p className="mt-4 text-xs font-medium tracking-wide text-gray-400">
            {stat.label.toUpperCase()}
          </p>
          {isLoading ? (
            <Skeleton.Input className="mt-1" active />
          ) : (
            <p className="mt-1 text-3xl font-bold text-primary-black">
              {stat.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
