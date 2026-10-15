export interface ExtraItem {
  id: string;
  name: string;
  amount: number;
}

export interface PercentageAdjustment {
  type: 'addition' | 'discount';
  percentage: number;
  name: string;
}

export interface PatientSession {
  id: string;
  clientName: string;
  phone: string;
  condition: string; // e.g. خشونة ركبة, انزلاق غضروفي, تأهيل ما بعد الجراحة, تأهيل إصابات ملاعب
  sessionDate: string; // YYYY-MM-DD
  sessionTime?: string; // HH:mm
  basePrice: number;
  extraItems: ExtraItem[];
  percentageAdjustment?: PercentageAdjustment | null;
  totalPrice: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  paidAmount: number;
  paymentMethod: 'cash' | 'transfer' | 'card';
  notes?: string;
}

export interface CenterSettings {
  centerName: string;
  defaultCurrency: string;
  defaultSessionPrice: number;
  commonConditions: string[];
  commonExtraItems: { name: string; amount: number }[];
}
