import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import React from "react";
import { INITIAL_DOCTORS, TOTAL_SLOTS, SLOT_HEIGHT } from "../../data/scheduleGrid";
import { useHandleSelection } from "../../hooks";
import { BackgroundGridLine, DoctorsColumnLayout, RedTimeLine, TimeColumn, TopStickyHeader } from ".";

export function DNDGrid() {
  const [doctors, setDoctors] = React.useState(INITIAL_DOCTORS);
  const handleSelectionCommit = useHandleSelection(
    (state) => state.handleSelectionCommit,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDoctors((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto whitespace-nowrap relative scrollbar-thin antialiased">
        <div className="w-full flex flex-col min-w-max">
          {/* Top Sticky Header */}
          <TopStickyHeader doctors={doctors} />

          {/* Grid Area */}
          <div className="flex relative" onMouseUp={handleSelectionCommit}>
            {/* Time Column */}
            <TimeColumn />

            {/* Appointment Cell Matrix */}
            <div
              className="flex-1 flex divide-x divide-neutral-200 relative bg-white"
              style={{ height: TOTAL_SLOTS * SLOT_HEIGHT }}
            >
              {/* Background Grid Lines */}
              <BackgroundGridLine />

              {/* Timeline indicator line */}
              <RedTimeLine />

              {/* Doctor columns layout mapping */}
              <DoctorsColumnLayout doctors={doctors} />
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}