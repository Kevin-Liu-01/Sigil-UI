"use client";

import { useState } from "react";
import { Calendar, SegmentedControl, SegmentedControlItem, SplitButton } from "@sigil-ui/components";

export function CalendarPreview() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 4, 12));
  return <div className="sigil-docs-example">
    <Calendar mode="single" defaultMonth={new Date(2026, 4, 1)} selected={date} onSelect={setDate} />
    <p role="status" className="sigil-docs-example-output">{date ? `Selected: ${date.toLocaleDateString("en-US", { dateStyle: "long" })}` : "Choose a date."}</p>
  </div>;
}

export function SegmentedControlPreview() {
  const [period, setPeriod] = useState("Week");
  return <div className="sigil-docs-example">
    <SegmentedControl value={period} onValueChange={setPeriod} aria-label="Report period">
      {["Day", "Week", "Month"].map((value) => <SegmentedControlItem key={value} value={value}>{value}</SegmentedControlItem>)}
    </SegmentedControl>
    <p role="status" className="sigil-docs-example-output">Showing the {period.toLowerCase()} report.</p>
  </div>;
}

export function SplitButtonPreview() {
  const [message, setMessage] = useState("Choose an action.");
  return <div className="sigil-docs-example">
    <div><SplitButton onClick={() => setMessage("Project saved.")} onDropdownClick={() => setMessage("Save a copy selected.")} dropdownLabel="Save a copy">Save project</SplitButton></div>
    <p role="status" className="sigil-docs-example-output">{message}</p>
  </div>;
}
