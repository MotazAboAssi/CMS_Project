import { useState, useMemo, useEffect } from "react";
import type { DoctorWithApts } from "@/features/dashboardAssitant/types";
import { useWizardDrawer } from "../hooks/useWizardDrawer";
import { START_TIME_MINUTES } from "../data/scheduleGrid";

export interface TreatmentOption {
  id: string;
  name: string;
  baseDuration: number;
  basePrice: number;
}

export type ComplexityType = "standard" | "complex" | "elderly" | "urgent";

// Patient Profile Database Schema Interface
export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  phone: string;
  address: string;
}

export interface WizardFormData {
  treatmentId: string;
  complexity: ComplexityType;
  date: Date | null;
  timeSlot: number | null;
  doctorId: string;
  isLockedToDoctor: boolean;
  notes: string;
  // Step 2 Form Attributes upgraded from image_312683.png
  patientName: string;
  patientPhone: string;
  patientAge: string;
  patientGender: "Male" | "Female" | null;
  patientAddress: string;
  isExistingPatient: boolean; // Tracks if profile was linked from DB
  duration: number; // حقل جديد للمدة
}

const INITIAL_FORM_DATA: WizardFormData = {
  treatmentId: "",
  complexity: "standard",
  date: null,
  timeSlot: null,
  doctorId: "",
  isLockedToDoctor: false,
  notes: "",
  patientName: "",
  patientPhone: "",
  patientAge: "",
  patientGender: null,
  patientAddress: "",
  isExistingPatient: false,
  duration: 15,
};

// Sample Database for Autocomplete Queries
const MOCK_PATIENT_DATABASE: PatientProfile[] = [
  {
    id: "p1",
    name: "Mohammad Ahmad",
    age: 28,
    gender: "Male",
    phone: "+963 99 123 4567",
    address: "Damascus, Sahnaya",
  },
  {
    id: "p2",
    name: "Mohammad Ali",
    age: 34,
    gender: "Female",
    phone: "+963 93 444 5555",
    address: "Damascus, Malki",
  },
  {
    id: "p3",
    name: "Mohammad Hassan",
    age: 52,
    gender: "Male",
    phone: "+963 95 777 8888",
    address: "Rif Dimashq",
  },
  {
    id: "p4",
    name: "Ali Ahmad",
    age: 22,
    gender: "Male",
    phone: "+963 99 111 2222",
    address: "Damascus",
  },
];

export const TREATMENT_OPTIONS: TreatmentOption[] = [
  { id: "t1", name: "Follow-up Visit", baseDuration: 30, basePrice: 100000 },
  {
    id: "t2",
    name: "Initial Consultation",
    baseDuration: 45,
    basePrice: 150000,
  },
  { id: "t3", name: "Routine Check-up", baseDuration: 15, basePrice: 75000 },
];

export function useAppointmentWizard(
  doctors: DoctorWithApts[],
  onSave: (data?: WizardFormData & { price: number }) => void,
  onClose: () => void,
) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_FORM_DATA);
  const [searchTreatment, setSearchTreatment] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDuplicatePhone, setIsDuplicatePhone] = useState(false);
  // const initialData = useWizardDrawer((state) => state.initialData);
  const isWizardOpen = useWizardDrawer((state) => state.isWizardOpen);

  const pendingRequestData = useWizardDrawer(
    (state) => state.pendingRequestData,
  );
  // بوابة التحويل والمزامنة عند فتح الـ Wizard عبر النقر على خلية الجدول
  useEffect(() => {
    if (isWizardOpen && pendingRequestData) {
      // التحقق من هوية الطبيب بربط الاسم بالـ ID إن أمكن، أو تركها فارغة ليختارها المستخدم في الخطوة الأولى
      const matchedDoctor = doctors.find(
        (doc) => doc.name === pendingRequestData.doctorName,
      );

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({
        ...prev,
        // الخطوة الأولى: بيانات الموعد
        doctorId: matchedDoctor ? matchedDoctor.id : "",
        date: new Date(), // تعيين اليوم كافتراضي أو استخدام Date.parse إن كان متوافقاً
        treatmentId: "t1", // تفضيل "Follow-up Visit" كافتراضي
        timeSlot: START_TIME_MINUTES + 60, // توقيت افتراضي أو يمكن تركه فارغاً ليعبئه المستخدم
        duration: 15,

        // الخطوة الثانية: بيانات المريض القادمة من الـ Request 🔥
        patientName: pendingRequestData.patientName,
        patientPhone: "0900 000 000", // أو أي حقل افتراضي للهاتف إذا لم يتوفر في الـ PendingRequest
        patientAge: "30", // عمر افتراضي للتخطي
        patientGender: "Male",
        patientAddress: "Damascus",
        isExistingPatient: false,
        notes: `Created via Pending Request assigned on ${pendingRequestData.date} ${pendingRequestData.time}`,
      }));
    }
  }, [isWizardOpen, pendingRequestData, doctors]);

  const selectedTreatment = useMemo(() => {
    return TREATMENT_OPTIONS.find((t) => t.id === formData.treatmentId) || null;
  }, [formData.treatmentId]);

  // استبدل الـ computedDuration القديم بهذا الـ Memo
  const computedDuration = useMemo(() => {
    // الاعتماد الآن على القيمة المخزنة في الـ state مباشرة
    return formData.duration;
  }, [formData.duration]);

  const computedPrice = useMemo(() => {
    if (!selectedTreatment) return 0;
    return selectedTreatment.basePrice;
  }, [selectedTreatment]);

  // Real-time Autocomplete Filter Matching Engine
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return MOCK_PATIENT_DATABASE.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const handleFieldChange = <K extends keyof WizardFormData>(
    field: K,
    value: WizardFormData[K],
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      if (
        field === "treatmentId" ||
        field === "complexity" ||
        field === "date"
      ) {
        next.timeSlot = null;
        next.doctorId = "";
      }
      if (field === "timeSlot") {
        next.doctorId = "";
      }

      // Real-time Duplicate Phone Detection Loop
      if (field === "patientPhone") {
        const cleanedPhone = (value as string).replace(/\s+/g, "");
        const holdsDuplicate = MOCK_PATIENT_DATABASE.some(
          (p) =>
            p.phone.replace(/\s+/g, "") === cleanedPhone &&
            p.name !== prev.patientName,
        );
        setIsDuplicatePhone(next.isExistingPatient ? false : holdsDuplicate);
      }

      return next;
    });
  };

  // Instant Autofill Execution Routine
  const selectPatientFromSearch = (patient: PatientProfile) => {
    setFormData((prev) => ({
      ...prev,
      patientName: patient.name,
      patientPhone: patient.phone,
      patientAge: patient.age.toString(),
      patientGender: patient.gender,
      patientAddress: patient.address,
      isExistingPatient: true,
    }));
    setSearchQuery("");
    setIsDuplicatePhone(false);
  };

  // Step 1 Validation Gate
  const isStep1Valid = useMemo(() => {
    return !!(
      formData.treatmentId &&
      formData.complexity &&
      formData.date &&
      formData.timeSlot !== null &&
      formData.doctorId
    );
  }, [formData]);

  // Comprehensive Step 2 Field Validation Errors Tracker
  const step2Errors = useMemo(() => {
    const ageValue = parseInt(formData.patientAge, 10);
    return {
      nameEmpty: formData.patientName.trim().length === 0,
      ageInvalid: isNaN(ageValue) || ageValue < 0 || ageValue > 120,
      genderEmpty: !formData.patientGender,
      phoneEmpty: formData.patientPhone.trim().length < 7 || isDuplicatePhone,
    };
  }, [formData, isDuplicatePhone]);

  // Strict Step 2 State Validation Gate
  const isStep2Valid = useMemo(() => {
    return !Object.values(step2Errors).some(Boolean);
  }, [step2Errors]);

  const availableTimeSlots = useMemo(() => {
    if (!formData.date || computedDuration === 0) return [];
    const slots: number[] = [];
    const DAY_START = START_TIME_MINUTES;
    const DAY_END = 1080;

    for (let time = DAY_START; time + computedDuration <= DAY_END; time += 15) {
      const isAnyDoctorFree = doctors.some((doc) => {
        const appointments = doc.appointments || [];
        return !appointments.some(
          (apt) =>
            Math.max(time, apt.start) <
            Math.min(time + computedDuration, apt.end),
        );
      });
      if (isAnyDoctorFree) slots.push(time);
    }
    return slots;
  }, [formData.date, computedDuration, doctors]);

  const availableDoctorsFiltered = useMemo(() => {
    // 1. إذا لم يقم المستخدم باختيار وقت بعد، نعرض جميع الأطباء
    if (!formData.date || formData.timeSlot === null) return doctors;

    // 2. تحويل وقت المستخدم (المطلق) إلى وقت نسبي (Grid Relative) لمقارنته بمواعيد الطبيب الحالية المسجلة في الجدول
    const relativeStartTime = formData.timeSlot - START_TIME_MINUTES;
    const relativeEndTime = relativeStartTime + computedDuration;

    return (
      doctors
        .map((doc) => {
          // جمع كل مواعيد الطبيب لليوم (تأكد من استخدام الخاصية الصحيحة سواء كانت appointments أو columnAppointments)
          const docAppointments =
            doc.appointments || doc.columnAppointments || [];

          const dailyCount = docAppointments.length;

          // 3. الفحص الدقيق للتضارب:
          // يكون هناك تضارب إذا كان وقت بداية الموعد الجديد أصغر من وقت نهاية موعد حالي
          // **و** وقت نهاية الموعد الجديد أكبر من وقت بداية الموعد الحالي.
          const hasConflict = docAppointments.some(
            (apt) => relativeStartTime < apt.end && relativeEndTime > apt.start,
          );

          return {
            ...doc,
            appointmentsTodayCount: dailyCount,
            isAvailableAtSlot: !hasConflict, // الطبيب متوفر إذا لم يكن هناك تضارب
            // افتراض أن الطبيب متاح للعمل بشكل عام (isAvailable) ما لم يكن لديك حقل صريح في الواجهة الخلفية ينفي ذلك
            isAvailable: true,
          };
        })
        // 4. تصفية القائمة النهائية: إظهار الأطباء المتاحين في هذا الوقت المحدد فقط
        .filter((doc) => doc.isAvailableAtSlot && doc.isAvailable)
    );
  }, [formData.date, formData.timeSlot, computedDuration, doctors]);

  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid) setCurrentStep(2);
    else if (currentStep === 2 && isStep2Valid) setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep === 2) setCurrentStep(1);
    else if (currentStep === 3) setCurrentStep(2);
  };
  const handleFinalSubmit = () => {
    if (isStep1Valid && isStep2Valid) {
      // تحويل الوقت المطلق من منتصف الليل رجوعاً إلى دقائق نسبية خاصة بالجدول للحفاظ على أبعاد الرسم البياني
      const relativeTimeSlot =
        formData.timeSlot !== null ? formData.timeSlot - START_TIME_MINUTES : 0;

      onSave({
        ...formData,
        timeSlot: relativeTimeSlot, // إرسال التوقيت النسبي المصحح (0-based)
        duration: computedDuration,
        price: computedPrice,
      });

      setFormData(INITIAL_FORM_DATA);
      setCurrentStep(1);
      onClose();
    }
  };

  const handleDurationChange = (newDuration: number) => {
    setFormData((prev) => ({ ...prev, duration: Math.max(15, newDuration) }));
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    computedDuration,
    computedPrice,
    selectedTreatment,
    availableTimeSlots,
    availableDoctorsFiltered,
    isStep1Valid,
    isStep2Valid,
    step2Errors,
    isDuplicatePhone,
    searchTreatment,
    setSearchTreatment,
    searchDoctor,
    setSearchDoctor,
    searchQuery,
    setSearchQuery,
    filteredPatients,
    selectPatientFromSearch,
    handleFieldChange,
    handleNext,
    handleBack,
    handleFinalSubmit,
    handleDurationChange,
  };
}
