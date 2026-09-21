import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const translations = {
  en: {
    dir: "rtl-toggle-en",
    nav: { home: "Home", about: "About", skills: "Skills", order: "Order", complaint: "Complaint", contact: "Contact" },
    hero: {
      eyebrow: "Faculty of Artificial Intelligence · Menofia University",
      name: "Omar Elgendy",
      tagline: "I build fast, I learn faster, and I don't stop until the work is done.",
      cta: "Scroll to step inside",
      scrollHint: "Scroll to enter",
    },
    about: {
      title: "About",
      body: "I'm a student at the Faculty of Artificial Intelligence, Menofia University, working at the intersection of machine learning and real-world software. I pick up new tools quickly, stay steady under pressure, and I'm comfortable putting in long hours when a deadline needs it.",
    },
    skills: {
      title: "How I work",
      items: [
        { title: "Fast learner", body: "I absorb new frameworks, tools and requirements quickly, with minimal ramp-up time." },
        { title: "Works under pressure", body: "Tight deadlines and shifting requirements don't rattle my process." },
        { title: "Long-hours reliability", body: "When a task needs extra hours to land correctly, I put them in." },
      ],
    },
    order: {
      title: "Place an order",
      subtitle: "Tell me what you need — it goes straight to my WhatsApp.",
      name: "Full name",
      phone: "Phone number",
      service: "Service needed",
      details: "Order details",
      submit: "Send order to WhatsApp",
      success: "Order sent! Opening WhatsApp…",
    },
    complaint: {
      title: "Report an issue",
      subtitle: "Something wrong with an order? Let me know.",
      name: "Full name",
      email: "Email or phone",
      details: "Describe the issue",
      submit: "Submit complaint",
      success: "Complaint received — thank you.",
    },
    contact: {
      title: "Get in touch",
      body: "Reachable any time on WhatsApp for orders, questions or collaboration.",
      whatsapp: "Chat on WhatsApp",
    },
    consent: {
      title: "الموقع يتطلب بعض البيانات",
      body: "This site collects basic device and network information to improve performance and security. No personal browsing data is shared with third parties.",
      agree: "موافق",
      disagree: "غير موافق",
    },
    chat: {
      title: "Ask the assistant",
      placeholder: "Type your question…",
      send: "Send",
      greeting: "Hi! Ask me anything about Omar's services, skills or how to place an order.",
    },
    footer: "All rights reserved.",
  },
  ar: {
    dir: "rtl-toggle-ar",
    nav: { home: "الرئيسية", about: "نبذة", skills: "المهارات", order: "طلب", complaint: "شكوى", contact: "تواصل" },
    hero: {
      eyebrow: "كلية الذكاء الاصطناعي · جامعة المنوفية",
      name: "عمر الجندي",
      tagline: "أنجز بسرعة، أتعلم أسرع، ولا أتوقف حتى تكتمل المهمة.",
      cta: "مرر للأسفل للدخول",
      scrollHint: "مرر للدخول",
    },
    about: {
      title: "نبذة عني",
      body: "أنا طالب في كلية الذكاء الاصطناعي بجامعة المنوفية، أعمل في نقطة التقاء تعلم الآلة بالبرمجيات الواقعية. أتعلم الأدوات الجديدة بسرعة، وأحافظ على ثباتي تحت الضغط، ولا أمانع العمل لساعات طويلة عند الحاجة لإنجاز المهمة في وقتها.",
    },
    skills: {
      title: "طريقة عملي",
      items: [
        { title: "سريع التعلم", body: "أستوعب الأدوات والمتطلبات الجديدة بسرعة وبأقل وقت تحضير." },
        { title: "العمل تحت الضغط", body: "المواعيد الضيقة والمتطلبات المتغيرة لا تربك أسلوب عملي." },
        { title: "الالتزام بساعات طويلة", body: "عندما تحتاج المهمة وقتًا إضافيًا لإنجازها بشكل صحيح، أقدّمه." },
      ],
    },
    order: {
      title: "إرسال طلب",
      subtitle: "أخبرني بما تحتاجه — سيصلني مباشرة عبر واتساب.",
      name: "الاسم الكامل",
      phone: "رقم الهاتف",
      service: "الخدمة المطلوبة",
      details: "تفاصيل الطلب",
      submit: "إرسال الطلب عبر واتساب",
      success: "تم إرسال الطلب! جاري فتح واتساب…",
    },
    complaint: {
      title: "الإبلاغ عن مشكلة",
      subtitle: "هل هناك مشكلة في طلب سابق؟ أخبرني.",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني أو الهاتف",
      details: "صف المشكلة",
      submit: "إرسال الشكوى",
      success: "تم استلام الشكوى — شكرًا لك.",
    },
    contact: {
      title: "تواصل معي",
      body: "متاح في أي وقت عبر واتساب للطلبات أو الأسئلة أو التعاون.",
      whatsapp: "تحدث عبر واتساب",
    },
    consent: {
      title: "الموقع يتطلب بعض البيانات",
      body: "يقوم هذا الموقع بجمع بيانات أساسية عن الجهاز والشبكة لتحسين الأداء والأمان. لا تتم مشاركة بيانات التصفح الشخصية مع أي طرف ثالث.",
      agree: "موافق",
      disagree: "غير موافق",
    },
    chat: {
      title: "اسأل المساعد",
      placeholder: "اكتب سؤالك…",
      send: "إرسال",
      greeting: "أهلًا! اسألني عن خدمات عمر أو مهاراته أو كيفية إرسال طلب.",
    },
    footer: "جميع الحقوق محفوظة.",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("site_lang") || "en");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("site_lang", lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      t: translations[lang],
      toggleLang: () => setLang((prev) => (prev === "en" ? "ar" : "en")),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
