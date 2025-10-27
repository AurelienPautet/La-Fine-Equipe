import React from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import Popover from "./Popover";
import "cally";

interface DateTimePickerProps {
  label: string;
  value: Date | undefined | null;
  onChange: (date: Date) => void;
  className?: string;
  hasTime?: boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  className = "",
  hasTime = true,
}) => {
  const ensureValidDate = (date: Date | undefined | null): Date => {
    if (!date) return new Date();
    const d = new Date(date);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const formatTime = (date: Date | undefined | null): string => {
    const d = ensureValidDate(date);
    return `${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const updateDateTime = (updates: {
    hours?: number;
    minutes?: number;
    date?: Date;
  }) => {
    const currentDate = ensureValidDate(value);

    if (updates.date) {
      const nd = new Date(updates.date);
      currentDate.setFullYear(nd.getFullYear(), nd.getMonth(), nd.getDate());
    }

    if (updates.hours !== undefined) currentDate.setHours(updates.hours);
    if (updates.minutes !== undefined) currentDate.setMinutes(updates.minutes);

    onChange(currentDate);
  };

  const popoverId = `cally-popover-${React.useId()}`;
  const anchorId = `cally-anchor-${React.useId()}`;
  const anchorName = `--${anchorId}`;

  return (
    <div className={`form-control ${className}`}>
      <label className="label">
        <span className="label-text font-semibold flex items-center gap-2">
          <FaCalendarAlt className="w-4 h-4" />
          {label}
        </span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Date Picker */}
        <div className="w-full">
          <button
            popoverTarget={popoverId}
            className="input input-bordered input-primary w-full text-left flex items-center gap-2"
            id={anchorId}
            style={{ "anchor-name": anchorName } as any}
            type="button"
          >
            <FaCalendarAlt className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="truncate">
              {value
                ? ensureValidDate(value).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Choisir une date"}
            </span>
          </button>
          <div
            popover=""
            id={popoverId}
            className="dropdown bg-base-100 rounded-box shadow-lg border border-base-300"
            style={{ "position-anchor": anchorName } as any}
          >
            <calendar-date
              className="cally"
              onchange={(e: any) => {
                updateDateTime({ date: e.target.value });
              }}
              value={ensureValidDate(value).toISOString().split("T")[0]}
            >
              <svg
                aria-label="Previous"
                className="fill-current size-4"
                slot="previous"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                {...({} as any)}
              >
                <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
              </svg>
              <svg
                aria-label="Next"
                className="fill-current size-4"
                slot="next"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                {...({} as any)}
              >
                <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
              </svg>
              <calendar-month></calendar-month>
            </calendar-date>
          </div>
        </div>

        {/* Time Picker */}
        <div className={`w-44 ${hasTime ? "block" : "hidden"}`}>
          <Popover
            trigger={
              <div className="input input-bordered input-primary w-full text-left flex items-center gap-2">
                <FaClock className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{formatTime(value)}</span>
              </div>
            }
            dropdownClassName="bg-base-100 rounded-box shadow-lg border-2 border-primary/20 p-4 mt-1"
            className="w-full"
          >
            <div className="grid grid-cols-2 gap-4 h-fit">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Heures</span>
                </label>
                <select
                  className="select select-bordered select-primary w-full"
                  value={ensureValidDate(value).getHours()}
                  onChange={(e) =>
                    updateDateTime({
                      hours: parseInt(e.target.value),
                    })
                  }
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Minutes</span>
                </label>
                <select
                  className="select select-bordered select-primary w-full"
                  value={ensureValidDate(value).getMinutes()}
                  onChange={(e) =>
                    updateDateTime({
                      minutes: parseInt(e.target.value),
                    })
                  }
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
