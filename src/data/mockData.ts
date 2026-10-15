import { PatientSession, CenterSettings } from '../types';

export const initialSettings: CenterSettings = {
  centerName: 'مركز الشفاء المتخصص للعلاج الطبيعي والتأهيل',
  defaultCurrency: 'جنيه',
  defaultSessionPrice: 350,
  commonConditions: [
    'تأهيل خشونة الركبة والمفاصل',
    'انزلاق غضروفي وعلاج آلام الظهر',
    'تأهيل ما بعد جراحة الرباط الصليبي',
    'إصابات الملاعب والعضلات',
    'تأهيل الجلطات والدماغ العصبي',
    'علاج طبيعي للأطفال وتأهيل الحركة'
  ],
  commonExtraItems: [
    { name: 'جلسة علاج بالليزر البارد', amount: 150 },
    { name: 'أشرطة طبية لاصقة (Kinesio Tape)', amount: 75 },
    { name: 'جلسة أجهزة تنبيه كهربائي إضافية', amount: 100 },
    { name: 'حزام طبي للظهر/الركبة', amount: 250 },
    { name: 'استشارة طبية متقدمة', amount: 200 }
  ]
};

// Generate dates relative to current date (October 2026)
const today = new Date();
const formatDate = (daysAgo: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const initialSessions: PatientSession[] = [
  {
    id: 's-1',
    clientName: 'أحمد محمود حسن',
    phone: '01012345678',
    condition: 'تأهيل خشونة الركبة والمفاصل',
    sessionDate: formatDate(0), // Today
    sessionTime: '10:00',
    basePrice: 400,
    extraItems: [{ id: 'e-1', name: 'جلسة علاج بالليزر البارد', amount: 150 }],
    percentageAdjustment: { type: 'discount', percentage: 10, name: 'خصم عميل دائم (10%)' },
    totalPrice: 495, // (400 + 150) - 10%
    paymentStatus: 'paid',
    paidAmount: 495,
    paymentMethod: 'cash',
    notes: 'تحسن ملحوظ في مدى الحركة مع انخفاض التورم.'
  },
  {
    id: 's-2',
    clientName: 'سارة إبراهيم محمد',
    phone: '01298765432',
    condition: 'انزلاق غضروفي وعلاج آلام الظهر',
    sessionDate: formatDate(1), // Yesterday
    sessionTime: '12:30',
    basePrice: 450,
    extraItems: [{ id: 'e-2', name: 'أشرطة طبية لاصقة (Kinesio Tape)', amount: 75 }],
    percentageAdjustment: null,
    totalPrice: 525,
    paymentStatus: 'paid',
    paidAmount: 525,
    paymentMethod: 'transfer',
    notes: 'جلسة شد فقرات قطنية وتمرينات تقوية.'
  },
  {
    id: 's-3',
    clientName: 'محمود عبد الله الشريف',
    phone: '01155544332',
    condition: 'تأهيل ما بعد جراحة الرباط الصليبي',
    sessionDate: formatDate(2),
    sessionTime: '16:00',
    basePrice: 500,
    extraItems: [{ id: 'e-3', name: 'جلسة أجهزة تنبيه كهربائي إضافية', amount: 100 }],
    percentageAdjustment: { type: 'addition', percentage: 5, name: 'خدمة منزلية (5%)' },
    totalPrice: 630, // (500 + 100) * 1.05
    paymentStatus: 'partial',
    paidAmount: 400,
    paymentMethod: 'card',
    notes: 'تم دفع جزء والباقي الجلسة القادمة.'
  },
  {
    id: 's-4',
    clientName: 'منى حسين علي',
    phone: '01533322119',
    condition: 'إصابات الملاعب والعضلات',
    sessionDate: formatDate(4),
    sessionTime: '11:00',
    basePrice: 350,
    extraItems: [],
    percentageAdjustment: null,
    totalPrice: 350,
    paymentStatus: 'pending',
    paidAmount: 0,
    paymentMethod: 'cash',
    notes: 'جلسة تأهيل عضلة الفخذ الخلفية.'
  },
  {
    id: 's-5',
    clientName: 'خالد مصطفى وهران',
    phone: '01099887766',
    condition: 'تأهيل الجلطات والدماغ العصبي',
    sessionDate: formatDate(6),
    sessionTime: '14:00',
    basePrice: 600,
    extraItems: [{ id: 'e-4', name: 'استشارة طبية متقدمة', amount: 200 }],
    percentageAdjustment: null,
    totalPrice: 800,
    paymentStatus: 'paid',
    paidAmount: 800,
    paymentMethod: 'transfer',
    notes: 'جلسة علاج وظائف الحركات الدقيقة.'
  },
  {
    id: 's-6',
    clientName: 'ريم سمير القاضي',
    phone: '01211223344',
    condition: 'علاج طبيعي للأطفال وتأهيل الحركة',
    sessionDate: formatDate(9),
    sessionTime: '09:30',
    basePrice: 400,
    extraItems: [],
    percentageAdjustment: { type: 'discount', percentage: 15, name: 'خصم عائلي (15%)' },
    totalPrice: 340,
    paymentStatus: 'paid',
    paidAmount: 340,
    paymentMethod: 'cash',
    notes: 'تأهيل تأخر الحركات الحركية للطفل.'
  },
  {
    id: 's-7',
    clientName: 'طارق عبد العزيز جابر',
    phone: '01044556677',
    condition: 'تأهيل خشونة الركبة والمفاصل',
    sessionDate: formatDate(12),
    sessionTime: '17:00',
    basePrice: 350,
    extraItems: [{ id: 'e-5', name: 'حزام طبي للظهر/الركبة', amount: 250 }],
    percentageAdjustment: null,
    totalPrice: 600,
    paymentStatus: 'paid',
    paidAmount: 600,
    paymentMethod: 'card',
    notes: 'شراء حزام ركبة طبي مع جلسة تأهيل.'
  }
];
