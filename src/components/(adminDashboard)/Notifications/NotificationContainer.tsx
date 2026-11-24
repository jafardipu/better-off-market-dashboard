"use client";
import moment from "moment";
import { Bell } from "lucide-react";
import {
  useGetNotificationQuery,
  useReadNotificationMutation,
} from "@/redux/api/notificationApi";
import PaginationSection from "@/components/shared/PaginationSection";
import { useSearchParams } from "next/navigation";
import NotificationListSkeleton from "./NotificationListSkeleton";
import Empty from "@/components/ui/empty-data";
import { useEffect } from "react";
import Link from "next/link";
import { Tooltip } from "antd";
import { getNotificationLink } from "@/utils/notificationLink";

export interface INotification {
  _id: string;
  type?: string;
  message: string;
  description: string;
  read: boolean;
  link: string;
  metadata?: { contractId?: string; propertyId?: string };
  createdAt: string;
}

const NotificationContainer = () => {
  const page = useSearchParams().get("page") || "1";
  const limit = useSearchParams().get("limit") || "10";

  const queries: Record<string, string | number> = { page, limit };
  const { data, isLoading } = useGetNotificationQuery(queries);
  const [makeRedNotification] = useReadNotificationMutation();

  useEffect(() => {
    makeRedNotification({});
  }, [makeRedNotification]);

  return (
    <div>
      <div className="min-h-[80vh]  p-7">
        <h1 className="text-2xl text-text-color  mb-2">Notifications</h1>
        <hr />

        {data?.meta?.total === 0 && !isLoading && (
          <Empty message="No notification found" className="mt-10" />
        )}

        {/* notification list */}
        {data?.meta?.total !== 0 && isLoading ? (
          <div className="xl:mt-8 mt-6 xl:px-10 px-6 text-text-color">
            <NotificationListSkeleton />
          </div>
        ) : (
          <div className="xl:mt-8 mt-6 xl:px-10 px-6 text-text-color">
            {/* showing today notification */}
            <div className="space-y-5">
              {data?.data?.map((notification: INotification) => (
                <Link
                  key={notification?._id}
                  href={
                    getNotificationLink({
                      link: notification?.link,
                      type: notification?.type,
                      contractId: notification?.metadata?.contractId,
                    }) ?? "#"
                  }
                  className="block"
                >
                  <div className="flex items-center gap-x-4">
                    <div className="bg-main-color size-10 flex justify-center items-center rounded-full cursor-pointer">
                      <Bell color="white" />
                    </div>

                    <div className="bg-white border border-gray-400 rounded-lg p-3 flex-1">
                      <div className="flex justify-between gap-x-2 items-center">
                        <h5 className="font-medium md:text-lg">
                          {notification?.message}
                        </h5>
                        <Tooltip placement="topRight" title={moment(notification?.createdAt).format("llll")}>
                           <p>{moment(notification?.createdAt).fromNow()}</p>
                        </Tooltip>
                       
                      </div>
                      <p className="text-gray-500">
                        {notification?.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* pagination */}
      <PaginationSection
        total={data?.meta?.total}
        current={Number(page)}
        pageSize={Number(limit)}
      />
    </div>
  );
};

export default NotificationContainer;
