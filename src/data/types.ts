// --- بيانات المشروع الأساسي ---
export interface ProjectData {
  id?: string;             // ID في Firestore
  slug?: string;           // slug للـ URL
  name: string;            // اسم المشروع
  short: string;           // وصف مختصر
  description: string;     // وصف طويل
  year?: string;           // سنة الإطلاق
  developer: string;       // المطور الأساسي
  developerRole?: string;  // دور المطور
  teamSize?: number;       // عدد الفريق
  vision?: string;         // رؤية المشروع
  tools: string[];         // الأدوات المستخدمة
  links: {
    website?: string;
    mobileDownload?: string;
    github?: string;
    codeRepo?: string;
  };
  video?: string;          // فيديو تعريفي
  paid?: boolean;          // مدفوع أو مجاني
  price?: number;          // السعر لو مدفوع
  status: "active" | "inactive" | "archived"; // حالة المشروع
  type: "web" | "mobile";  // نوع المشروع
  tags: string[];          // كلمات مفتاحية
  screenshotHero?: string; // صورة رئيسية
  screenshots?: string[];  // صور إضافية
  votes: {
    total: number;   // مجموع النجوم
    count: number;   // عدد المصوتين
    users: string[]; // IDs المستخدمين
  };
  challenges?: string[];   // التحديات
  solutions?: string[];    // الحلول
  features?: string[];     // المميزات
  stages?: Array<{
    title: string;
    desc: string;
    done: boolean;
    date?: string;
    eta?: string;
  }>;
  extraMetadata?: Record<string, any> & { views?: number };
  createdAt?: any;
  updatedAt?: any;
}

// --- بيانات الكومنت الواحد ---
export interface CommentData {
  id?: string;           // ID في Firestore
  projectId: string;     // بيربط الكومنت بالمشروع
  projectSlug?: string;  // slug اختياري للسهولة
  userId: string;        // UID بتاع Firebase
  userName: string;      // اسم اليوزر
  userPhoto?: string;    // صورة البروفايل
  comment: string;       // نص الكومنت
  createdAt: any;        // Firestore timestamp
}

// --- لو عايزين نعرض مشروع + كومنتاته مع بعض ---
export interface ProjectWithComments extends ProjectData {
  comments: CommentData[];
}
