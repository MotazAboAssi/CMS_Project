import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

import { TOTAL_SLOTS } from "../../../data/scheduleGrid";
import { useHandleSelection } from "../../../hooks";

import {
  BackgroundGridLine,
  DoctorsColumnLayout,
  RedTimeLine,
  TimeColumn,
  TopStickyHeader,
} from "..";
import { AppointmentUpdateToast } from "../AppointmentUpdateToast";
import { DragOverlayCard } from "./DragOverlayCard";
import { useDragHandlers } from "./hooks/useDragHandlers";
import { gridCollisionStrategy } from ".";

export function DNDGrid() {
  const {
    doctors,
    activeId,
    activeType,
    activeData,
    overSlotInfo,
    isToastOpen,
    toastInfo,
    overlayMeta,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleUndoAction,
    closeToast,
  } = useDragHandlers();

  const handleSelectionCommit = useHandleSelection(
    (state) => state.handleSelectionCommit
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={gridCollisionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto whitespace-nowrap relative scrollbar-thin antialiased">
        <div className="w-full flex flex-col min-w-max">
          <SortableContext
            items={doctors.map((d) => d.id)}
            strategy={horizontalListSortingStrategy}
          >
            <TopStickyHeader doctors={doctors} />
            <div className="flex relative" onMouseUp={handleSelectionCommit}>
              <TimeColumn />
              <div
                className="flex-1 flex divide-x divide-neutral-200 relative bg-white"
                style={{ height: TOTAL_SLOTS * 80 }} // SLOT_HEIGHT = 80
              >
                <BackgroundGridLine />
                <RedTimeLine />
                <DoctorsColumnLayout doctors={doctors} overSlotInfo={overSlotInfo} />
              </div>
            </div>
          </SortableContext>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeId && activeType === "appointment" && activeData ? (
          <DragOverlayCard data={activeData} height={overlayMeta.cardHeight} />
        ) : null}
      </DragOverlay>

      <AppointmentUpdateToast
        isOpen={isToastOpen}
        patientName={toastInfo.patientName}
        newTimeLabel={toastInfo.newTimeLabel}
        onClose={closeToast}
        onUndo={handleUndoAction}
      />
    </DndContext>
  );
}