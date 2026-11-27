"use client";
import {
  useApprovePropertyMutation,
  useDeletePropertyMutation,
  useRejectPropertyMutation,
  useUpdatePropertyMutation,
} from "@/redux/api/propertiesApi";
import { IPropertyResponse, TPropertyStatus } from "@/types";
import { message, Popconfirm } from "antd";
import {
  BadgeDollarSign,
  CheckCircle2,
  Handshake,
  RotateCcw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface StatusAction {
  status: TPropertyStatus;
  label: string;
  confirmTitle: string;
  confirmDescription: string;
  icon: ReactNode;
  className: string;
}

const FILLED_BUTTON =
  "bg-main-color text-white hover:bg-main-color/90 shadow-[0_4px_10px_0_rgba(0,33,76,0.25)]";

// Same status options the seller has on their listing page.
const STATUS_ACTIONS: Partial<Record<TPropertyStatus, StatusAction[]>> = {
  Active: [
    {
      status: "Under Contract",
      label: "Mark Under Contract",
      confirmTitle: "Mark this listing Under Contract?",
      confirmDescription: "Buyers will see this listing as Under Contract.",
      icon: <Handshake size={18} />,
      className: FILLED_BUTTON,
    },
  ],
  "Under Contract": [
    {
      status: "Active",
      label: "Mark as Active",
      confirmTitle: "Mark this listing as Active?",
      confirmDescription: "The listing goes back on the market as Active.",
      icon: <RotateCcw size={18} />,
      className: "border border-green-700 text-green-800 hover:bg-green-50",
    },
    {
      status: "Sold",
      label: "Mark as Sold",
      confirmTitle: "Mark this listing as Sold?",
      confirmDescription: "Buyers will see this listing as Sold.",
      icon: <BadgeDollarSign size={18} />,
      className: FILLED_BUTTON,
    },
  ],
};

interface AdminDecisionCardProps {
  title?: string;
  property: IPropertyResponse;
}

export function AdminDecisionCard({
  title = "Admin Actions",
  property,
}: AdminDecisionCardProps) {
  const router = useRouter();
  const isPending = property?.status === "Pending";

  const [approveProperty, { isLoading: isApproving }] =
    useApprovePropertyMutation();
  const [rejectProperty, { isLoading: isRejecting }] =
    useRejectPropertyMutation();
  const [deleteProperty, { isLoading: isDeleting }] =
    useDeletePropertyMutation();
  const [
    updateProperty,
    { isLoading: isUpdatingStatus, originalArgs: statusArgs },
  ] = useUpdatePropertyMutation();

  const isBusy = isApproving || isRejecting || isDeleting || isUpdatingStatus;
  const statusActions = STATUS_ACTIONS[property?.status] ?? [];

  const handleStatusChange = async (action: StatusAction) => {
    try {
      await updateProperty({
        id: property?._id,
        status: action.status,
      }).unwrap();
      message.success(`Listing marked ${action.status}`);
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update listing status");
    }
  };

  const handleApprove = async () => {
    try {
      await approveProperty(property?._id).unwrap();
      message.success("Listing approved successfully");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to approve listing");
    }
  };

  const handleReject = async () => {
    try {
      await rejectProperty(property?._id).unwrap();
      message.success("Listing rejected");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to reject listing");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProperty(property?._id).unwrap();
      message.success("Listing deleted successfully");
      router.push("/listings");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete listing");
    }
  };

  return (
    <div className="rounded-md border  bg-white p-5 shadow-[0_10px_30px_0_rgba(15,23,42,0.05)]">
      <p className="mb-4 text-xs font-semibold tracking-wide text-gray-400">
        {title.toUpperCase()}
      </p>

      <div className="space-y-3">
        {isPending && (
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
                disabled={isBusy}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-800 py-3 text-sm font-medium text-white shadow-[0_4px_10px_0_rgba(22,101,52,0.25)] hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 size={18} />
                Approve listing
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
                disabled={isBusy}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <XCircle size={18} />
                Reject listing
              </button>
            </Popconfirm>
          </>
        )}

        {statusActions.length > 0 && (
          <div
            className={
              statusActions.length > 1 ? "grid grid-cols-2 gap-3" : undefined
            }
          >
            {statusActions.map((action) => (
              <Popconfirm
                key={action.status}
                title={action.confirmTitle}
                description={action.confirmDescription}
                okText="Confirm"
                cancelText="Cancel"
                okButtonProps={{
                  loading:
                    isUpdatingStatus && statusArgs?.status === action.status,
                }}
                onConfirm={() => handleStatusChange(action)}
              >
                <button
                  disabled={isBusy}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-2 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 ${action.className}`}
                >
                  {action.icon}
                  {action.label}
                </button>
              </Popconfirm>
            ))}
          </div>
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
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={18} />
            Delete listing
          </button>
        </Popconfirm>
      </div>
    </div>
  );
}
