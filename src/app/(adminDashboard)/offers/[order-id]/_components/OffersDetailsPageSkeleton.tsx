// components/skeleton/OffersReceivedSkeleton.tsx
export default function OffersDetailsPageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-6 w-4/5 rounded bg-gray-200" />
        <div className="h-6 w-2/5 rounded bg-gray-200" />
      </div>
      <div className="mb-5 mt-3 flex items-center justify-between">
        <div className="h-4 w-28 rounded bg-gray-200" />
        <div className="h-8 w-28 rounded-lg bg-gray-200" />
      </div>

      {/* Comparison card(s) */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-3/4">
        <div className="rounded-lg bg-[#F2F4F6] p-4 space-y-3">
          <div className="h-4 w-20 rounded bg-gray-300" />
          <div className="h-6 w-16 rounded bg-gray-300" />
          <div className="h-3.5 w-40 rounded bg-gray-300" />
        </div>
      </div>

      {/* ConsolidatedOfferCard */}
      <div className="border border-[#E6E8EA] bg-card p-5 shadow-[0_10px_30px_0_rgba(15,23,42,0.05)] sm:p-6 rounded-lg space-y-4">
        {/* "Offer from ..." title */}
        <div className="h-7 w-56 rounded bg-gray-200" />

        {/* Offer Details */}
        <SubSectionSkeleton>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <FieldSkeleton key={i} />
            ))}
          </div>
        </SubSectionSkeleton>

        {/* Personal Property */}
        <SubSectionSkeleton>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-gray-200" />
              <div className="h-6 w-28 rounded-full bg-gray-200" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-gray-200" />
              <div className="h-6 w-32 rounded-full bg-gray-200" />
            </div>
          </div>
        </SubSectionSkeleton>

        {/* Contingencies */}
        <SubSectionSkeleton>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />
                <div className="space-y-1.5">
                  <div className="h-3 w-16 rounded bg-gray-200" />
                  <div className="h-4 w-20 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </SubSectionSkeleton>

        {/* Real Estate Agent */}
        <SubSectionSkeleton>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <FieldSkeleton key={i} />
            ))}
          </div>
        </SubSectionSkeleton>

        {/* Closing Terms */}
        <SubSectionSkeleton>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <FieldSkeleton key={i} />
            ))}
          </div>
        </SubSectionSkeleton>

        {/* Documents */}
        <SubSectionSkeleton>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-11 w-full rounded-xl border border-border bg-muted/40"
              />
            ))}
          </div>
        </SubSectionSkeleton>

        {/* Additional Terms */}
        <SubSectionSkeleton>
          <div className="h-12 w-full rounded-lg bg-gray-100" />
        </SubSectionSkeleton>

        {/* Notes to Seller */}
        <SubSectionSkeleton>
          <div className="h-12 w-full rounded-lg bg-gray-100" />
        </SubSectionSkeleton>
      </div>

      {/* Action bar */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
        <div className="h-10 w-full sm:w-32 rounded-md bg-gray-200" />
        <div className="h-10 w-full sm:w-32 rounded-md bg-gray-200" />
        <div className="h-10 w-full sm:w-36 rounded-md bg-gray-200" />
        <div className="h-10 w-full sm:w-24 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

function SubSectionSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-5 shadow-[0_10px_30px_0_rgba(15,23,42,0.05)] border border-primary-border-color rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded bg-gray-200" />
        <div className="h-5 w-32 rounded bg-gray-200" />
      </div>
      {children}
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="space-y-1.5">
      <div className="h-3 w-20 rounded bg-gray-200" />
      <div className="h-4.5 w-24 rounded bg-gray-200" />
    </div>
  );
}