import type { KeyboardEvent } from "react";

type CountsByDate = Record<string, number>;

interface Props {
  countsByDate: CountsByDate;
  selectedDate: string;
  today: string;
  onSelectDate: (date: string) => void;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toDateKey(date: Date): string {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
}

function getLevel(count: number): number {
  if (count <= 0) return 0;
  return Math.min(count, 4);
}

export default function PaperHeatmap({ countsByDate, selectedDate, today, onSelectDate }: Props) {
  const end = parseDateKey(today);
  const start = new Date(end.getTime() - 364 * DAY_MS);
  const leadingBlanks = start.getUTCDay();
  const days = Array.from({ length: 365 }, (_, index) => {
    const date = new Date(start.getTime() + index * DAY_MS);
    return toDateKey(date);
  });

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7
    };
    const offset = offsets[event.key];
    const targetIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? days.length - 1
        : offset === undefined
          ? index
          : Math.min(days.length - 1, Math.max(0, index + offset));
    if (targetIndex === index && offset === undefined && !["Home", "End"].includes(event.key)) return;
    event.preventDefault();
    event.currentTarget.parentElement
      ?.querySelector<HTMLButtonElement>(`button[data-day-index="${targetIndex}"]`)
      ?.focus();
  }

  return (
    <section className="paper-heatmap" aria-labelledby="paper-heatmap-heading">
      <div className="paper-heatmap__header">
        <div>
          <p className="eyebrow">Activity</p>
          <h2 id="paper-heatmap-heading">Last 365 days</h2>
        </div>
        <div className="paper-heatmap__legend" aria-label="Heatmap intensity legend">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span className={`paper-heatmap__legend-cell paper-heatmap-cell--level-${level}`} key={level} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="paper-heatmap__scroller">
        <div className="paper-heatmap__grid" role="group" aria-label="Paper reading activity by date">
          {Array.from({ length: leadingBlanks }, (_, index) => (
            <span className="paper-heatmap__blank" aria-hidden="true" key={`blank-${index}`} />
          ))}
          {days.map((date, index) => {
            const count = countsByDate[date] ?? 0;
            const level = getLevel(count);
            const label = `${date}: ${count} paper${count === 1 ? "" : "s"}`;
            const isSelected = selectedDate === date;

            return (
              <button
                type="button"
                className={`paper-heatmap__cell paper-heatmap-cell--level-${level}${isSelected ? " is-selected" : ""}`}
                aria-label={label}
                aria-pressed={isSelected}
                title={label}
                data-day-index={index}
                tabIndex={isSelected || (!selectedDate && date === today) ? 0 : -1}
                onClick={() => onSelectDate(isSelected ? "" : date)}
                onKeyDown={(event) => moveFocus(event, index)}
                key={date}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
