// lib/config.ts
// ⚠️ كل الروابط والإعدادات هنا فقط — لا تكررها في أماكن أخرى

export const SITE_CONFIG = {
  // معلومات البراند
  brand: {
    name: "YASO TECH",
    nameAr: "ياسو تك",
    tagline: "AI • DESIGN • BRANDING • WEB",
    owner: "يسى ملاك لبس",
    description:
      "براند إبداعي وتقني يقدم خدمات رقمية تجمع بين الذكاء الاصطناعي والتصميم والهوية البصرية وتطوير الويب.",
  },

  // معلومات التواصل
  contact: {
    phone: "01289502512",
    whatsapp: "01289502512",
    whatsappMessage:
      "مرحبًا، أريد الاستفسار عن خدمات YASO TECH",
    email: "yasoteach.studio@gmail.com",
  },

  // إعدادات الدفع
  payment: {
    cashNumber: "01289502512",
    cashName: "ملاك لبس منقريوس",
    methods: [
      { id: "cash", label: "كاش (تحويل على الرقم)", enabled: true },
      { id: "wallet", label: "محفظة إلكترونية", enabled: false },
      { id: "instapay", label: "انستاباي", enabled: false },
    ],
  },

  // روابط السوشيال ميديا
  social: {
    facebook: "https://www.facebook.com/share/19miwJ6Mp9/",
    tiktok: "https://tiktok.com/@yaso.tech",
    youtube: "https://youtube.com/@yasotech-s5n?si=4q3odgD6Ho7i7Rkv",
    instagram: "https://instagram.com/techyaso",
    whatsappChannel: "https://whatsapp.com/channel/0029VbDDoxF7YScuQYwddu28",
  },

  // الألوان (للرجوع إليها)
  colors: {
    navy: "#0B1220",
    cyan: "#00E5FF",
    purple: "#7C3AED",
    white: "#FFFFFF",
  },
};

// دالة لتوليد رابط واتساب جاهز مع رسالة
export const getWhatsAppLink = (message?: string) => {
  const msg = encodeURIComponent(
    message || SITE_CONFIG.contact.whatsappMessage
  );
  return `https://wa.me/2${SITE_CONFIG.contact.whatsapp}?text=${msg}`;
};