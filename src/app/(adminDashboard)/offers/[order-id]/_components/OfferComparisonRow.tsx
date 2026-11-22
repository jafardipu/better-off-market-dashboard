import { OfferComparisonCard } from "./OfferComparisonCard";

export interface OfferSnapshot {
  amount: number;
  closingDate: string;
}

export interface OfferRoundSnapshot extends OfferSnapshot {
  round: number;
  title: string;
}

interface OfferComparisonRowProps {
  rounds: OfferRoundSnapshot[];
  selectedRound: number;
  onSelectRound: (round: number) => void;
}

export function OfferComparisonRow({
  rounds,
  selectedRound,
  onSelectRound,
}: OfferComparisonRowProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rounds.map((round, index) => {
        const previous = index > 0 ? rounds[index - 1] : undefined;

        return (
          <OfferComparisonCard
            key={round.round}
            title={round.title}
            amount={round.amount}
            previousAmount={previous?.amount}
            closingDate={round.closingDate}
            previousClosingDate={previous?.closingDate}
            closingLabel={index === 0 ? "Closing:" : "Proposed closing:"}
            badgeNumber={index > 0 ? round.round : undefined}
            highlighted={round.round === selectedRound}
            onClick={() => onSelectRound(round.round)}
          />
        );
      })}
    </div>
  );
}