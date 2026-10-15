import { PatientSession, CenterSettings } from '../types';

export const initialSettings: CenterSettings = {
  centerName: 'مركز العلاج الطبيعي والتأهيل',
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

// Start with empty sessions list so only user-entered data appears
export const initialSessions: PatientSession[] = [];
