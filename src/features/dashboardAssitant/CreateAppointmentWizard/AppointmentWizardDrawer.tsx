import { useCallback, useEffect } from "react";
import { X } from "lucide-react";
import {
  TREATMENT_OPTIONS,
  useAppointmentWizard,
  type WizardFormData,
} from "./useAppointmentWizard";
import {
  Step1TreatmentInfo,
  type availableDoctorsFilteredType,
} from "./Step1TreatmentInfo";
import { Step2PatientInfo } from "./Step2PatientInfo";
import { Step3ReviewSummary } from "./Step3ReviewSummary";

import { useWizardDrawer } from "../hooks/useWizardDrawer";
import StepperCustome from "./StepperCustome";
import type { AppointmentType, DoctorType } from "../types";
import { usePendingRequest } from "../hooks/usePendingRequest";

interface AppointmentWizardDrawerProps {
  doctors: DoctorType[]; //[cite: 16]
  onExecuteCreation: (newApt: AppointmentType) => void; //[cite: 16]
}

export function AppointmentWizardDrawer({
  doctors,
  onExecuteCreation,
}: AppointmentWizardDrawerProps) {
  const isWizardOpen = useWizardDrawer((state) => state.isWizardOpen);
  const onClose = useWizardDrawer((state) => state.onClose);
  const pendingRequestData = useWizardDrawer(
    (state) => state.pendingRequestData,
  ); // جلب بيانات الطلب النشط حالياً إن وجدت

  const onRemovePendingRequest = usePendingRequest(
    (state) => state.onRemovePendingRequest,
  );

  // بناء دالة وسيطة تقوم بصياغة كائن الموعد وحفظه مباشرة في الـ Grid State
  const handleSaveAppointment = useCallback(
    (wizardData?: WizardFormData) => {
      if (!wizardData) return null; //[cite: 16]
      const treatmentName =
        TREATMENT_OPTIONS.find((t) => t.id === wizardData.treatmentId)?.name || //[cite: 16]
        ""; //[cite: 16]
      console.log(wizardData.date);
      const newApt: AppointmentType = {
        id: `apt-${Date.now()}`, //[cite: 16]
        docId: wizardData.doctorId, //[cite: 16]
        title: `${wizardData.patientName} - ${treatmentName}`, //[cite: 16]
        start: wizardData.timeSlot || 0, //[cite: 16]
        end: (wizardData.timeSlot || 0) + wizardData.duration, //[cite: 16]
        status: wizardData.complexity === "urgent" ? "urgent" : "confirmed",
        treatmentId: wizardData.treatmentId,
        complexity: wizardData.complexity,
        duration: wizardData.duration,
        price: 0,
        patient: {
          name: wizardData.patientName,
          age: Number.parseInt(wizardData.patientAge),
          phone: wizardData.patientPhone,
          gender: wizardData.patientGender,
          adddress: wizardData.patientAddress,
        },
        refuseTransfer: false,
        date: wizardData.date,
      };

      onExecuteCreation(newApt); // تحديث شبكة المواعيد فوراً[cite: 16]

      // 🔥 إذا كان هذا الموعد قادماً من مراجعة طلب معلق، قم بحذفه فوراً من القائمة الجانبية
      if (pendingRequestData) {
        onRemovePendingRequest(pendingRequestData.id);
      }

      onClose(); // إغلاق الـ Drawer[cite: 16]
    },
    [onExecuteCreation, onClose, pendingRequestData, onRemovePendingRequest],
  );

  // نمرر الدالة الوسيطة handleSaveAppointment هنا بدلاً من onExecuteCreation المباشرة
  const wizard = useAppointmentWizard(doctors, handleSaveAppointment, onClose);
  // ...
  // Keyboard Navigation Bindings Rule
  useEffect(() => {
    if (!isWizardOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape")
        // handleSaveAppointment(wizard as unknown as WizardFormData);
        onClose();
      if (e.key === "Enter" && wizard.currentStep === 3)
        wizard.handleFinalSubmit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSaveAppointment, isWizardOpen, onClose, wizard, wizard.currentStep, wizard.formData]);

  if (!isWizardOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      {/* Semi-transparent Backdrop Mask Layer */}
      <div
        onClick={() => handleSaveAppointment()}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-all duration-1000 ease-in-out"
      />

      {/* Primary Control Base Plate Container */}
      <div className="relative w-[28.5%] h-[95.5%] bg-white border-l border-neutral-200/80 shadow-[0_0_50px_rgba(0,0,0,0.15)] flex flex-col justify-between z-10 transition-all duration-1000 ease-in-out m-[24px] rounded-2xl">
        {/* Header Block Section */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="text-sm font-bold text-neutral-800">
            Create New Appointment
          </h3>
        </div>
        {/* Unified 3-Step Stepper Display Track from image_319dc7.png */}
        {/* Dynamic State-Driven Stepper Track (Green = Completed, Blue = Active, Gray = Pending) */}
        <StepperCustome wizard={wizard} />

        {/* Middle Scrollable Layout Body Panel */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-neutral-200">
          {wizard.currentStep === 1 && (
            <Step1TreatmentInfo
              formData={wizard.formData}
              availableTimeSlots={wizard.availableTimeSlots}
              // عمل cast هنا لحل مشكلة عدم تطابق الـ Types بشكل مؤقت وآمن
              availableDoctorsFiltered={
                wizard.availableDoctorsFiltered as availableDoctorsFilteredType[]
              }
              searchTreatment={wizard.searchTreatment}
              setSearchTreatment={wizard.setSearchTreatment}
              handleFieldChange={wizard.handleFieldChange}
            />
          )}
          {wizard.currentStep === 2 && <Step2PatientInfo {...wizard} />}
          {wizard.currentStep === 3 && <Step3ReviewSummary {...wizard} />}
        </div>
        {/* Footer Trailing Step Controllers Tray */}
        <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between shrink-0">
          {wizard.currentStep === 1 ? (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:bg-neutral-100 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={wizard.handleBack}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-all cursor-pointer"
            >
              Back
            </button>
          )}

          {wizard.currentStep < 3 ? (
            <button
              onClick={wizard.handleNext}
              disabled={
                wizard.currentStep === 1
                  ? !wizard.isStep1Valid
                  : !wizard.isStep2Valid
              }
              className="px-5 py-2 text-xs font-bold bg-[#0066ff] hover:bg-blue-600 text-white shadow-sm disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-all active:scale-[0.99] cursor-pointer"
            >
              Next
            </button>
          ) : (
            <button
              onClick={wizard.handleFinalSubmit}
              className="px-5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm rounded-xl transition-all active:scale-[0.99] cursor-pointer"
            >
              Create Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
