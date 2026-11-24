"use client";
import ReadMoreText from "@/components/shared/ReadMoreText";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types";
import { getInitials } from "@/utils/getInitials";
import { Image, Modal, Tag } from "antd";
import { Mail, Phone, X } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { userProfileHref } from "@/components/(adminDashboard)/property-records/format";

const avatarColors = ["#DCE6FF", "#FFE1D6"];

interface UserDetailsModalProps {
  open: boolean;
  selectedUser: IUser;
  onClose: () => void;
}

export function UserDetailsModal({
  open,
  selectedUser,
  onClose,
}: UserDetailsModalProps) {
  const rows = [
    { label: "Name", value: selectedUser?.name },
    { label: "Location", value: selectedUser?.location || "N/A" },
    { label: "Company", value: selectedUser?.company || "N/A" },
    {
      label: "Joining Date",
      value: moment(selectedUser?.createdAt).format("MMM DD, YYYY"),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closeIcon={<X size={18} />}
      centered
      width={420}
    >
      <h2 className="mb-5 text-lg font-bold text-primary-black">
        User details
      </h2>

      {/* Profile */}
      <div className="mb-4 flex   gap-3 border-b border-gray-100 pb-4">
        <div>
          {selectedUser?.profile ? (
            <Image
              src={selectedUser?.profile}
              alt={"User profile"}
              width={60}
              height={60}
              className="size-14 shrink-0 !rounded-full object-cover"
            />
          ) : (
            <span
              style={{
                backgroundColor:
                  avatarColors[
                    Math.floor(Math.random() * avatarColors.length) %
                      avatarColors.length
                  ],
                color: "#1e3a8a",
                fontWeight: 600,
              }}
              className="flex items-center justify-center w-12 h-12 rounded-full"
            >
              {getInitials(selectedUser?.name)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-primary-black">
              {selectedUser?.name}
            </h3>
            <Tag
              className="!rounded-full !border-0 !px-3 !py-1 !text-xs !font-medium capitalize"
              style={
                selectedUser?.status === "active"
                  ? { background: "#DCFCE7", color: "#16A34A" }
                  : { background: "#FEE2E2", color: "#DC2626" }
              }
            >
              {selectedUser?.status}
            </Tag>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
            <Link
              href={`mailto:${selectedUser?.email}`}
              className="flex items-center gap-1"
            >
              <Mail size={14} />
              {selectedUser?.email}
            </Link>
            {selectedUser?.phoneNumber && (
              <Link
                href={`tel:${selectedUser?.phoneNumber}`}
                className="flex items-center gap-1"
              >
                <Phone size={14} />
                {selectedUser?.phoneNumber}
              </Link>
            )}
          </div>
        </div>
      </div>
      {selectedUser?.bio && (
        <div>
          {/* <div className="mt-2 border-b border-gray-100"></div> */}
          <span className="divide-y divide-gray-100 text-gray-500">Bio</span>
          <p className="mt-2 text-sm text-black">
            <ReadMoreText text={selectedUser?.bio} wordLimit={40} />
          </p>
          <div className="mt-2 border-b border-gray-100"></div>
        </div>
      )}

      {/* Details rows */}
      <div className="divide-y divide-gray-100">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between py-3"
          >
            <span className="text-gray-500">{row.label}</span>
            <span className="font-medium text-black">{row.value}</span>
          </div>
        ))}
      </div>

      <Link href={`/seller-profile?seller=${selectedUser?._id}`}>
        <Button className="mt-4 w-full bg-main-color hover:bg-main-color/70">
          View Seller Profile
        </Button>
      </Link>

      {/* NEW FLOW: buyer activity tab on the user's profile page. */}
      <Link href={userProfileHref(selectedUser?._id ?? "", "buyer-activity")}>
        <Button variant="outline" className="mt-3 w-full">
          View Buyer Activity
        </Button>
      </Link>
    </Modal>
  );
}
