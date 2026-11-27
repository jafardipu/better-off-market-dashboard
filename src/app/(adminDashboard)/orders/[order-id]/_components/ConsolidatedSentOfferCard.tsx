import {
  AlertCircle,
  Search,
  BadgeCheck,
  Calendar,
  Download,
  MessageSquareText,
  UserRound,
} from "lucide-react";
import { DocIcon, DollarIcon, PersonalPropertyIcon } from "@/icon";
import Link from "next/link";

import { IUser } from "@/types";
import { SummaryField } from "./SummaryField";
import { ContingencyItem } from "./ContingencyItem";
import { Pill } from "./Pill";
import { OfferSubSection } from "./OfferSubSection";
import {
  type ConsolidatedOfferData,
  type OfferDiffKey,
  diffItems,
  EMPTY_TERM,
  getOfferChanges,
  getOfferDisplayValues,
  OFFER_DIFF_LABELS,
  splitToList,
} from "./utils.offer-received";
import ProfileCard from "@/components/shared/ProfileCard";
import { cn } from "@/lib/utils";

/** The round before the one shown; its values are what changes are measured against. */
export interface OfferRoundComparison {
  previous: ConsolidatedOfferData;
  previousRound: number;
}

interface ConsolidatedSentOfferCardProps {
  seller: IUser;
  buyer: IUser;
  data: ConsolidatedOfferData;
  /** Set for counter offers: changed fields show the previous value struck through. */
  comparison?: OfferRoundComparison;
  onEditOfferDetails?: () => void;
}

function PillList({ diff }: { diff: ReturnType<typeof diffItems> }) {
  if (diff.items.length === 0 && diff.removed.length === 0) {
    return <span className="text-sm text-muted-foreground">None specified</span>;
  }
  return (
    <>
      {diff.items.map((item, index) => (
        <Pill
          key={`${item}-${index}`}
          variant={diff.added.has(item) ? "added" : "default"}
        >
          {item}
        </Pill>
      ))}
      {diff.removed.map((item, index) => (
        <Pill key={`removed-${item}-${index}`} variant="removed">
          {item}
        </Pill>
      ))}
    </>
  );
}

export function ConsolidatedSentOfferCard({
  seller,
  buyer,
  data,
  comparison,
  onEditOfferDetails,
}: ConsolidatedSentOfferCardProps) {
  const current = getOfferDisplayValues(data);
  const changes = getOfferChanges(
    current,
    comparison ? getOfferDisplayValues(comparison.previous) : undefined,
  );
  const changedKeys = Object.keys(changes) as OfferDiffKey[];
  const prev = (key: OfferDiffKey) => changes[key];
  // Agent details are only compared when both rounds had an agent; otherwise
  // the "Working with an agent" change says it all.
  const agentPrev = (key: OfferDiffKey) =>
    changes.hasAgent ? undefined : changes[key];

  const includedItems = diffItems(
    data.personalProperty.included,
    comparison?.previous.personalProperty.included,
  );
  const itemsToRemove = diffItems(
    splitToList(data.personalProperty.itemsToRemove),
    comparison
      ? splitToList(comparison.previous.personalProperty.itemsToRemove)
      : undefined,
  );
  const previousAdditionalTerms = prev("additionalTerms");

  return (
    <div className="border border-primary-border-color bg-card p-3 shadow-[0_10px_30px_0_rgba(15,23,42,0.05)] sm:p-6 rounded-lg">
      <h4 className="lg:text-2xl md:text-xl text-lg font-semibold">
        {" "}
        <Link
          href={`/seller-profile?seller=${seller?._id}`}
          className="hover:text-blue-800 hover:underline duration-200 ease-in-out "
        >
          Offer to {seller?.name}{" "}
        </Link>
      </h4>

      {comparison ? (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-primary-black">
          {changedKeys.length > 0 ? (
            <>
              <p>
                <span className="font-semibold">
                  {changedKeys.length}{" "}
                  {changedKeys.length === 1 ? "term" : "terms"} changed from
                  Round {comparison.previousRound}:
                </span>{" "}
                {changedKeys.map((key) => OFFER_DIFF_LABELS[key]).join(", ")}.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Previous values are struck through; new values are highlighted.
              </p>
            </>
          ) : (
            <p>No terms changed from Round {comparison.previousRound}.</p>
          )}
        </div>
      ) : null}

      <section className="rounded-xl md:mt-5 mt-3 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2 space-y-4">
          <OfferSubSection
            title="Offer Details"
            icon={<DollarIcon />}
            onEdit={onEditOfferDetails}
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <SummaryField
                label="Offer amount"
                value={current.offerAmount}
                previousValue={prev("offerAmount")}
              />
              <SummaryField
                label="Earnest money"
                value={current.earnestMoney}
                previousValue={prev("earnestMoney")}
              />
              <SummaryField
                label="Financing type"
                value={current.financingType}
                previousValue={prev("financingType")}
              />
              {data.financingTerms || prev("financingTerms") ? (
                <SummaryField
                  label="Financing Terms"
                  value={current.financingTerms}
                  previousValue={prev("financingTerms")}
                />
              ) : null}
              <SummaryField
                label="Closing costs"
                value={current.closingCosts}
                previousValue={prev("closingCosts")}
              />
            </div>
          </OfferSubSection>

          <OfferSubSection
            title="Personal Property"
            icon={<PersonalPropertyIcon />}
          >
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#594139]">
                  Included items
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <PillList diff={includedItems} />
                </div>
              </div>
              {itemsToRemove.items.length > 0 ||
              itemsToRemove.removed.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#594139]">
                    Items to be removed
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <PillList diff={itemsToRemove} />
                  </div>
                </div>
              ) : null}
            </div>
          </OfferSubSection>

          <OfferSubSection
            title="Contingencies"
            icon={<AlertCircle size={20} />}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ContingencyItem
                icon={<Search size={16} />}
                label="Inspection"
                value={current.inspection}
                previousValue={prev("inspection")}
              />
              <ContingencyItem
                icon={<BadgeCheck size={16} />}
                label="Appraisal"
                value={current.appraisal}
                previousValue={prev("appraisal")}
              />
            </div>
          </OfferSubSection>

          <OfferSubSection
            title="Real Estate Agent"
            icon={<UserRound size={18} />}
          >
            {prev("hasAgent") ? (
              <SummaryField
                label="Working with an agent"
                value={current.hasAgent}
                previousValue={prev("hasAgent")}
                className="mb-4"
              />
            ) : null}
            {data?.agent?.hasAgent ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                <SummaryField
                  label="Agent name"
                  value={current.agentName}
                  previousValue={agentPrev("agentName")}
                />
                <SummaryField
                  label="Brokerage name"
                  value={current.brokerageName}
                  previousValue={agentPrev("brokerageName")}
                />
                <SummaryField
                  label="Commission"
                  value={current.commission}
                  previousValue={agentPrev("commission")}
                />
                <SummaryField
                  label="Paid by"
                  value={current.paidBy}
                  previousValue={agentPrev("paidBy")}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Buyer is not working with a real estate agent.
              </p>
            )}
          </OfferSubSection>

          <OfferSubSection title="Closing Terms" icon={<Calendar size={18} />}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <SummaryField
                label="Title company"
                value={current.titleCompany}
                previousValue={prev("titleCompany")}
              />
              <SummaryField
                label="Closing date"
                value={current.closingDate}
                previousValue={prev("closingDate")}
              />
              <SummaryField
                label="Possession"
                value={current.possession}
                previousValue={prev("possession")}
              />
              <SummaryField
                label="Seller post-closing occupancy"
                value={current.sellerPostClosingDays}
                previousValue={prev("sellerPostClosingDays")}
              />
            </div>
          </OfferSubSection>
        </div>
        <div className="space-y-4">
          {data.documents && data.documents.length > 0 ? (
            <OfferSubSection title="Documents" icon={<DocIcon />}>
              <ul className="flex flex-col gap-2">
                {data.documents.map((doc) => (
                  <li key={doc.url}>
                    <a
                      href={doc.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-md border border-primary-border-color/60 bg-muted/50 px-3 py-2.5 text-sm text-foreground hover:border-primary/50"
                    >
                      <span className="truncate">{doc.name}</span>
                      <Download className="shrink-0 text-muted-foreground hover:bg-gray-200 size-5 p-0.5 rounded-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </OfferSubSection>
          ) : null}

          {data.additionalTerms || previousAdditionalTerms ? (
            <OfferSubSection
              title="Additional Terms / Conditions"
              icon={<MessageSquareText color="#00214C" size={18} />}
            >
              {previousAdditionalTerms &&
              previousAdditionalTerms !== EMPTY_TERM ? (
                <p className="mb-2 rounded-lg bg-[#F2F4F6] p-3 leading-relaxed text-muted-foreground line-through">
                  &ldquo;{previousAdditionalTerms}&rdquo;
                </p>
              ) : null}
              {data.additionalTerms ? (
                <p
                  className={cn(
                    "rounded-lg text-[#594139] p-3 italic leading-relaxed",
                    previousAdditionalTerms ? "bg-amber-100" : "bg-[#F2F4F6]",
                  )}
                >
                  &ldquo;{data.additionalTerms}&rdquo;
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Removed in this round.
                </p>
              )}
            </OfferSubSection>
          ) : null}

          {data.notesToSeller ? (
            <OfferSubSection
              title="Notes to Seller"
              icon={<MessageSquareText color="#00214C" size={18} />}
            >
              <p className="rounded-lg bg-[#F2F4F6] text-[#594139] p-3  italic leading-relaxed">
                &ldquo;{data.notesToSeller}&rdquo;
              </p>
            </OfferSubSection>
          ) : null}

          {data.notesToBuyer ? (
            <OfferSubSection
              title="Notes to Buyer"
              icon={<MessageSquareText color="#00214C" size={18} />}
            >
              <p className="rounded-lg bg-[#F2F4F6] text-[#594139] p-3  italic leading-relaxed">
                &ldquo;{data.notesToBuyer}&rdquo;
              </p>
            </OfferSubSection>
          ) : null}

          {seller && <ProfileCard seller={seller} title="Seller" />}
          {buyer && <ProfileCard seller={buyer} title="Buyer" />}
        </div>
      </section>
    </div>
  );
}
