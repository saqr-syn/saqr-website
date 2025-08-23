export const projectData = {
    // --- المشروع الأساسي: Whispr ---
    whispr: {
        slug: "whispr",
        name: "Whispr",
        short: "تطبيق دردشة ذكي وآمن يدمج الذكاء الاصطناعي لتجربة مستخدم سلسة.",
        description: "Whispr ليس مجرد تطبيق دردشة، بل هو منصة متكاملة للاتصالات الآمنة. يتميز بتشفير طرف-إلى-طرف (E2E)، وبوت ذكي للردود التلقائية، ومشاركة ملفات فائقة السرعة، وميزات خصوصية متقدمة.",
        developer: "مصطفى صقر",
        developerRole: "Founder & Lead Developer",
        vision: "أن يصبح Whispr الرائد في مجال تطبيقات الدردشة التي تركز على الأمان وتكامل الذكاء الاصطناعي.",
        tools: ["Flutter", "Firebase (Auth, Firestore, FCM)", "AI/ML (Dialogflow)"],
        screenshotHero: "/projects/whispr.png",
        screenshots: ["/projects/whispr1.png", "/projects/whispr2.png", "/projects/whispr-onboarding.png"],
        video: "/videos/whispr_teaser.mp4",
        year: 2025,
        status: "Active - MVP Launched",
        teamSize: 5,
        challenges: ["تحقيق أمان مطلق للبيانات", "ضمان سرعة الاستجابة تحت الضغط", "تكامل الذكاء الاصطناعي بسلاسة."],
        solutions: ["تطبيق تشفير E2E متطور", "تحسين الأداء باستخدام caching و CDN", "استخدام Firebase Functions و Cloudflare"],
        features: ["رسائل مشفرة E2E", "مساعد ذكي للردود التلقائية", "مشاركة ملفات عالية السرعة", "مكالمات فيديو آمنة", "مجموعات متقدمة"],
        stages: [
            { title: "تصميم UX/UI", desc: "نموذج أولي وتوافق مع العميل", done: true, date: "2024-10-15" },
            { title: "بناء الـ MVP", desc: "Flutter + Firebase", done: true, date: "2025-02-28" },
            { title: "اختبارات الأداء", desc: "Load testing و تحسين الاستجابة", done: true, date: "2025-04-20" },
            { title: "إصدار عام", desc: "نشر على Play Store", done: false, date: null, eta: "Q3 2025" }
        ],
        paid: true,
        price: 4.99,
        mobileDownload: "/downloads/whispr.apk",
        website: "https://whispr.saqr.dev",
        github: "https://github.com/MostafaFalcon/whispr",
        codeRepo: "https://bitbucket.org/MostafaFalcon/whispr",
        downloadsCount: 1243,
        reviews: [
            { user: "Ali", rating: 5, comment: "تطبيق رائع وسهل الاستخدام!", downloaded: true, date: "2025-05-10" },
            { user: "Sara", rating: 4, comment: "مفيد لكن يحتاج تحسينات بسيطة.", downloaded: false, date: "2025-05-12" }
        ],
        tags: ["chat", "ai", "mobile", "security", "saas"]
    },

    // --- مشروع ويب: Alpha ---
    alpha: {
        slug: "alpha",
        name: "Project Alpha",
        short: "نظام إدارة مشاريع مبتكر لمتابعة المهام بكفاءة.",
        description: "Project Alpha يساعد الفرق على تنظيم المهام، متابعة التقدم، وتحسين الإنتاجية عبر لوحة تحكم تفاعلية وإشعارات لحظية وتقارير متقدمة.",
        developer: "مصطفى صقر",
        developerRole: "Co-Founder",
        vision: "توفير حلول إدارة مشاريع مرنة وسهلة الاستخدام للشركات الصغيرة والمتوسطة.",
        tools: ["React", "Node.js", "MongoDB", "Socket.io"],
        screenshotHero: "/projects/alpha.png",
        screenshots: ["/projects/alpha1.png", "/projects/alpha2.png", "/projects/alpha-dashboard.png"],
        video: "/videos/alpha_demo.mp4",
        year: 2024,
        status: "Active",
        teamSize: 4,
        challenges: ["تنسيق البيانات بين الفرق المختلفة في الوقت الفعلي."],
        solutions: ["استخدام WebSocket و MongoDB لتخزين وتحليل البيانات بسرعة."],
        features: ["لوحة مهام ديناميكية", "تنبيهات لحظية", "تقارير وتحليلات متقدمة", "صلاحيات متعددة للمستخدمين"],
        stages: [
            { title: "تصميم واجهة المستخدم", desc: "UI/UX", done: true, date: "2023-08-01" },
            { title: "بناء النظام", desc: "React + Node.js + MongoDB", done: true, date: "2024-01-15" },
            { title: "اختبارات", desc: "Unit + Integration", done: true, date: "2024-03-20" },
            { title: "إطلاق", desc: "Deployment على السحابة", done: false, date: null, eta: "Q4 2024" }
        ],
        paid: false,
        price: 0,
        mobileDownload: null,
        website: "https://alpha.saqr.dev",
        github: "https://github.com/MostafaFalcon/alpha",
        codeRepo: "https://github.com/MostafaFalcon/alpha",
        downloadsCount: 980,
        reviews: [
            { user: "Mona", rating: 5, comment: "حل ممتاز لإدارة فرقنا.", downloaded: false, date: "2024-04-05" }
        ],
        tags: ["web", "pm", "collaboration", "saas"]
    },

    // --- مشروع في مرحلة التطوير: Beta ---
    beta: {
        slug: "beta",
        name: "Project Beta",
        short: "تطبيق ويب لتحليل البيانات وعرض التقارير بشكل ديناميكي.",
        description: "Beta Web App يتيح للمستخدمين تحليل البيانات وإنشاء تقارير تفاعلية مع خرائط وتصدير PDF/Excel، مناسب للشركات الصغيرة والمتوسطة.",
        developer: "مصطفى صقر",
        developerRole: "Lead Developer",
        vision: "تقديم رؤى واضحة من البيانات المعقدة لمساعدة الشركات على اتخاذ قرارات أفضل.",
        tools: ["Next.js", "Chart.js", "Firebase", "D3.js"],
        screenshotHero: "/projects/beta.png",
        screenshots: ["/projects/beta1.png"],
        video: null,
        year: 2025,
        status: "Development - 80% Complete",
        teamSize: 3,
        challenges: ["معالجة البيانات الكبيرة بدون تأخير.", "تصميم واجهة مستخدم بديهية للتحليلات المعقدة."],
        solutions: ["استخدام caching و dynamic imports لتسريع الأداء.", "تصميم UI بسيط وفعال مع Next.js"],
        features: ["Dashboard تفاعلي", "تصدير PDF/Excel", "تحليلات لحظية", "دعم متعدد المستخدمين", "تخصيص التقارير"],
        stages: [
            { title: "تصميم الواجهة", desc: "Mockups و UX", done: true, date: "2024-11-20" },
            { title: "بناء النظام", desc: "Next.js + Firebase", done: false, date: null, eta: "2025-08-30" },
            { title: "اختبارات الأداء", desc: "Load & Stress testing", done: false, date: null, eta: "2025-09-15" }
        ],
        paid: false,
        price: 0,
        mobileDownload: null,
        website: "https://beta.saqr.dev",
        github: "https://github.com/MostafaFalcon/beta",
        codeRepo: null,
        downloadsCount: 450,
        reviews: [],
        tags: ["web", "analytics", "business", "data-visualization"]
    },

    // --- مشروع محمول: Gamma ---
    gamma: {
        slug: "gamma",
        name: "Gamma App",
        short: "تطبيق محمول لإدارة المهام اليومية بسهولة وفعالية.",
        description: "Gamma App يساعد المستخدمين على تنظيم يومهم، إنشاء قوائم مهام، وتتبّع الوقت مع مزامنة عبر الأجهزة وإشعارات ذكية.",
        developer: "مصطفى صقر",
        developerRole: "Co-Founder",
        vision: "أن يصبح الأداة المفضلة للإنتاجية الشخصية واليومية.",
        tools: ["Flutter", "Firebase (Realtime DB, Cloud Messaging)"],
        screenshotHero: "/projects/gamma-hero.png",
        screenshots: ["/projects/gamma1.png", "/projects/gamma2.png", "/projects/gamma-list.png"],
        video: "/videos/gamma_demo.mp4",
        year: 2025,
        status: "Active - Final Beta",
        teamSize: 2,
        challenges: ["مزامنة المهام بين الأجهزة المختلفة في الوقت الفعلي."],
        solutions: ["استخدام Firebase Realtime Database و Notifications لتحديثات فورية."],
        features: ["قوائم مهام يومية", "تذكيرات وإشعارات", "إحصائيات إنتاجية", "مزامنة متعددة الأجهزة"],
        stages: [
            { title: "تصميم الواجهة", desc: "UI/UX", done: true, date: "2024-12-10" },
            { title: "تطوير التطبيق", desc: "Flutter + Firebase", done: true, date: "2025-02-15" },
            { title: "اختبارات وتجارب", desc: "QA & Beta testing", done: false, date: null, eta: "2025-08-01" }
        ],
        paid: false,
        price: 0,
        mobileDownload: "/downloads/gamma.apk",
        website: "https://gamma.saqr.dev",
        github: "https://github.com/MostafaFalcon/gamma",
        codeRepo: "https://github.com/MostafaFalcon/gamma",
        downloadsCount: 670,
        reviews: [
            { user: "Hani", rating: 4, comment: "خفيف وعملي.", downloaded: true, date: "2025-06-25" }
        ],
        tags: ["mobile", "todo", "productivity", "flutter"]
    }
};

export default projectData;