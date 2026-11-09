import ImageWithFallback from "@/components/shared/image/ImageWithFallback";
import Preview from "@/components/shared/utils/image_preview_option";
import ImagePreviewer from "@/components/shared/utils/images-previewer";
import {
  useApprovePropertyMutation,
  useDeletePropertyMutation,
  useRejectPropertyMutation,
} from "@/redux/api/propertiesApi";
import { Popconfirm, message } from "antd";
import {
  AlertCircleIcon,
  CalendarIcon,
  DockIcon,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type ActionVariant =
  | "neutral"
  | "primary"
  | "danger-outline"
  | "success-outline";

export interface ListingAction {
  label: string;
  variant: ActionVariant;
  link?: string;
  onClick?: (listing: ListingItem) => void;
}

export interface ListingItem {
  id: string | number;
  title: string;
  agentName: string;
  county: string;
  submittedDate: string;
  photoCount: number;
  documentCount: number;
  price: number;
  images: string[];
  actions: ListingAction[];
  /** Show Approve/Reject Popconfirm buttons for this listing (e.g. only on the Pending tab) */
  showApprovalActions?: boolean;
}

interface ListingQueueProps {
  status: string;
  badgeText?: string;
  badgeColorClass?: string;
  listings: ListingItem[];
  totalProperties: number;
  emptyLabel?: string;
}

const formatPrice = (value: number) => `$${value.toLocaleString("en-US")}`;

const ACTION_STYLES: Record<ActionVariant, string> = {
  neutral: "bg-gray-200 text-primary-black hover:bg-gray-300",
  primary: "bg-[#00214C] text-white hover:opacity-90",
  "danger-outline": "border border-red-500 text-red-500 hover:bg-red-50",
  "success-outline": "border border-green-500 text-green-600 hover:bg-green-50",
};

export function ListingQueue({
  status,
  badgeText,
  badgeColorClass = "bg-[#FFDBD0] text-[#832600]",
  listings,
  totalProperties,
  emptyLabel = "No listings here yet",
}: ListingQueueProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex justify-between w-full items-start">
          <h2 className="text-xl font-bold text-primary-black">
            {status} Listings
          </h2>
          <span className="bg-green-50 px-4 py-1 border border-green-200  rounded-full">
            {totalProperties} Properties {status}
          </span>
        </div>
        {badgeText && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColorClass}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {listings.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">{emptyLabel}</p>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

function ListingCard({ listing }: { listing: ListingItem }) {
  const [previewImgIndex, setPreviewImgIndex] = useState(-1);
  const [approveProperty, { isLoading: isApproving }] =
    useApprovePropertyMutation();
  const [rejectProperty, { isLoading: isRejecting }] =
    useRejectPropertyMutation();
  const [deleteProperty, { isLoading: isDeleting }] =
    useDeletePropertyMutation();

  const handleApprove = async () => {
    try {
      await approveProperty(listing.id).unwrap();
      message.success("Listing approved successfully");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to approve listing");
    }
  };

  const handleReject = async () => {
    try {
      await rejectProperty(listing.id).unwrap();
      message.success("Listing rejected");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to reject listing");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProperty(listing.id).unwrap();
      message.success("Listing deleted successfully");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete listing");
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-gray-50 p-4 sm:flex-row sm:items-center">
      <Preview onClick={() => setPreviewImgIndex(0)}>
        <ImageWithFallback
          src={listing.images?.[0]}
          alt={"property image"}
          width={1200}
          height={1200}
          className="w-[149px] h-[110px] shrink-0 rounded-lg object-cover"
        />
      </Preview>

      <div className="flex-1">
        <h3 className="font-semibold text-primary-black line-clamp-1">
          {listing.title}
        </h3>
        <p className="mt-0.5 text-sm text-[#565E74] line-clamp-1">
          {listing.agentName}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#505F76]">
          <span className="flex items-center gap-1">
            <CalendarIcon className="size-3.5" />
            Submitted {listing.submittedDate}
          </span>
          <span className="flex items-center gap-1">
            <ImageIcon className="size-3.5" />
            {listing.photoCount} photos
          </span>
          {listing.documentCount > 0 ? (
            <span className="flex items-center gap-1">
              <DockIcon className="size-3.5" />
              {listing.documentCount} document
              {listing.documentCount > 1 ? "s" : ""}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-500">
              <AlertCircleIcon className="size-3.5" />0 documents
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* Generic actions (e.g. "Review"/"View") still render as-is */}
          {listing.actions.map((action) =>
            action.link ? (
              <Link
                key={action.label}
                href={action.link}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${ACTION_STYLES[action.variant]}`}
              >
                {action.label}
              </Link>
            ) : (
              <button
                key={action.label}
                onClick={() => action.onClick?.(listing)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${ACTION_STYLES[action.variant]}`}
              >
                {action.label}
              </button>
            ),
          )}

          {/* Approve / Reject — only for pending listings, confirmed via Popconfirm */}
          {listing.showApprovalActions && (
            <>
              <Popconfirm
                title="Approve this listing?"
                description="This will make the property publicly visible to buyers."
                okText="Approve"
                cancelText="Cancel"
                okButtonProps={{ loading: isApproving }}
                onConfirm={handleApprove}
              >
                <button
                  disabled={isApproving || isRejecting || isDeleting}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${ACTION_STYLES.primary}`}
                >
                  Approve
                </button>
              </Popconfirm>

              <Popconfirm
                title="Reject this listing?"
                description="The seller will be notified their listing was rejected."
                okText="Reject"
                cancelText="Cancel"
                okButtonProps={{ danger: true, loading: isRejecting }}
                onConfirm={handleReject}
              >
                <button
                  disabled={isApproving || isRejecting || isDeleting}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${ACTION_STYLES["danger-outline"]}`}
                >
                  Reject
                </button>
              </Popconfirm>
            </>
          )}

          <Popconfirm
            title="Delete this listing?"
            description="This permanently removes the listing. This cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: isDeleting }}
            onConfirm={handleDelete}
          >
            <button
              disabled={isApproving || isRejecting || isDeleting}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${ACTION_STYLES["danger-outline"]}`}
            >
              Delete
            </button>
          </Popconfirm>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span className="text-xl font-bold text-[#00214C]">
          {formatPrice(listing.price)}
        </span>
      </div>

        <ImagePreviewer
          imageUrls={listing?.images || []}
          previewImgIndex={previewImgIndex}
          setPreviewImgIndex={setPreviewImgIndex}
        />
    </div>
  );
}
