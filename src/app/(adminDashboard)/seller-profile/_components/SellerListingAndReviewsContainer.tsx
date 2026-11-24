"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SellerListing from "./SellerListing";
import SellerReview from "./SellerReview";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetSellerPropertiesQuery } from "@/redux/api/propertiesApi";
import { useGetSellerReviewsQuery } from "@/redux/api/reviewsApi";
// NEW FLOW: buyer activity tab.
import { getBuyerActivityArgs } from "@/components/(adminDashboard)/buyer-activity/buyerActivity";
import {
  EMBEDDED_BUYER_ACTIVITY_LIMIT,
  EmbeddedBuyerActivity,
} from "@/components/(adminDashboard)/buyer-activity/EmbeddedBuyerActivity";
import { useGetBuyerActivitiesQuery } from "@/redux/api/buyerActivityApi";

const BUYER_ACTIVITY_TAB = "buyer-activity";

const INITIAL_REVIEW_LIMIT = 6;
const REVIEW_LIMIT_STEP = 5;

export default function SellerListingAndReviewsContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sellerId = searchParams.get("seller");
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "6";
  const reviewLimit =
    Number(searchParams.get("reviewLimit")) || INITIAL_REVIEW_LIMIT;

  const queries: Record<string, string | number | string[]> = { page, limit };

  const { data: sellerListingData, isLoading: sellerListingLoading } =
    useGetSellerPropertiesQuery(
      { id: sellerId, ...queries },
      { skip: !sellerId },
    );

  const {
    data: sellerReviewData,
    isLoading: sellerReviewLoading,
    isFetching: sellerReviewFetching,
  } = useGetSellerReviewsQuery(
    { id: sellerId, limit: reviewLimit },
    { skip: !sellerId },
  );

  // NEW FLOW: only for the tab's count. Same args as the tab's first page, so
  // RTK Query sends a single request for both.
  const { data: buyerActivityData } = useGetBuyerActivitiesQuery(
    getBuyerActivityArgs({
      page: 1,
      limit: EMBEDDED_BUYER_ACTIVITY_LIMIT,
      buyer: sellerId,
    }),
    { skip: !sellerId },
  );

  // Bumps reviewLimit only — every other existing query param (seller, page, limit) stays untouched
  const handleSeeMoreReviews = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("reviewLimit", String(reviewLimit + REVIEW_LIMIT_STEP));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      <Tabs
        // NEW FLOW: ?tab=buyer-activity opens the buyer activity tab.
        defaultValue={
          searchParams.get("tab") === BUYER_ACTIVITY_TAB
            ? BUYER_ACTIVITY_TAB
            : "listings"
        }
        className="w-full mt-5"
      >
        <TabsList className="bg-transparent.0">
          <TabsTrigger
            value="listings"
            className="data-active:bg-transparent data-active:text-primary-color border-l-0 border-r-0 border-t-0 data-active:border-b-2 data-active:border-primary-color rounded-none cursor-pointer px-4 py-2.5 mr-1"
          >
            Listings ({sellerListingData?.meta?.total || 0})
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="data-active:bg-transparent data-active:text-primary-color border-l-0 border-r-0 border-t-0 data-active:border-b-2 data-active:border-primary-color rounded-none cursor-pointer px-4 py-2.5 mr-1"
          >
            Reviews ({sellerReviewData?.data?.summary?.totalReviews || 0})
          </TabsTrigger>
          {/* NEW FLOW: buyer activity tab. */}
          <TabsTrigger
            value={BUYER_ACTIVITY_TAB}
            className="data-active:bg-transparent data-active:text-primary-color border-l-0 border-r-0 border-t-0 data-active:border-b-2 data-active:border-primary-color rounded-none cursor-pointer px-4 py-2.5 mr-1"
          >
            Buyer activity ({buyerActivityData?.meta?.total || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="w-full">
          <SellerListing
            listingData={sellerListingData}
            isLoading={sellerListingLoading}
            page={Number(page)}
            limit={Number(limit)}
          />
        </TabsContent>

        <TabsContent value="reviews">
          <SellerReview
            sellerReviewData={sellerReviewData?.data}
            isLoading={sellerReviewLoading}
            isFetching={sellerReviewFetching}
            onSeeMore={handleSeeMoreReviews}
          />
        </TabsContent>

        {/* NEW FLOW: this user's activity as a buyer. */}
        <TabsContent value={BUYER_ACTIVITY_TAB} className="w-full">
          {sellerId && (
            <EmbeddedBuyerActivity
              filters={{ buyer: sellerId }}
              hiddenColumns={["buyer"]}
              emptyMessage="This user has no buyer activity yet"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
