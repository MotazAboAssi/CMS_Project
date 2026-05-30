import { useRedLine } from "../../hooks/useRedLine";
import { useHandleSelection } from "../../hooks/useHandleSelection";
import { DNDGrid, InformationPanel } from ".";
import React from "react";

export function ScheduleGrid() {
  // red line
  const computeLinePosition = useRedLine((state) => state.computeLinePosition);

  // selection
  const handleKeyDown = useHandleSelection((state) => state.handleKeyDown);

  // Esc Key listener toSelectionType dismiss active persistent selection
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  React.useEffect(() => {
    computeLinePosition();
    const interval = setInterval(computeLinePosition, 500);
    return () => clearInterval(interval);
  }, [computeLinePosition]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative bg-white border border-neutral-200 shadow-xs select-none">
      <DNDGrid />
      <InformationPanel />
    </div>
  );
}


























