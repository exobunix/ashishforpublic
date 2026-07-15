// CMS data types and default content for the entire website

export interface NavLink { name: string; path: string; }
export interface StatItem { label: string; value: number; suffix: string; }
export interface TimelineItem { year: string; title: string; role: string; }
export interface AboutTimelineEvent { year: string; title: string; desc: string; }
export interface PriorityItem { title: string; desc: string; }
export interface RoadmapItem { phase: string; title: string; desc: string; }
export interface VideoItem { title: string; embedUrl: string; }
export interface NewsItem { date: string; title: string; source: string; }
export interface FaqItem { q: string; a: string; }
export interface CardItem { title: string; desc: string; }
export interface PhotoItem { id: string; category: string; title: string; url: string; color?: string; }

export interface SiteContent {
  general: {
    siteName: string;
    tagline: string;
    navCtaLabel: string;
    logoUrl?: string;
  };
  whatsapp: {
    number: string;
    enabled: boolean;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  contactInfo: {
    address: string;
    phone1: string;
    phone2: string;
    email: string;
    website: string;
  };
  nav: {
    links: NavLink[];
  };
  hero: {
    partyBadge: string;
    headline: string;
    subheading: string;
    quote: string;
    cta1: string;
    cta2: string;
    cta3: string;
    floatingBadgeTitle: string;
    floatingBadgeSub: string;
    profileImage?: string;
  };
  stats: StatItem[];
  mission: {
    sectionLabel: string;
    heading: string;
    description: string;
    cards: CardItem[];
    coreValues: string[];
  };
  homeTimeline: {
    heading: string;
    subheading: string;
    ctaLabel: string;
    items: TimelineItem[];
  };
  quoteBanner: string;
  joinSection: {
    heading: string;
    description: string;
    ctaLabel: string;
  };
  about: {
    heroHeading: string;
    heroSubtitle: string;
    personalName: string;
    personalFather: string;
    personalBirth: string;
    personalEducation: string;
    personalMembership: string;
    aboutUsHeading?: string;
    aboutUsContent?: string;
    timelineEvents: AboutTimelineEvent[];
    philosophyCards: CardItem[];
    inspirationQuote: string;
    profileImage?: string;
  };
  vision: {
    heroHeading: string;
    heroSubtitle: string;
    prioritiesHeading: string;
    priorities: PriorityItem[];
    roadmapHeading: string;
    roadmap: RoadmapItem[];
    achievementsHeading: string;
    achievements: string[];
    pledgeHeading: string;
    pledges: string[];
    missionStatement: string;
  };
  media: {
    heroHeading: string;
    heroSubtitle: string;
    categories: string[];
    photoHeading: string;
    photos?: PhotoItem[];
    videoHeading: string;
    videos: VideoItem[];
    newsHeading: string;
    news: NewsItem[];
  };
  contactPage: {
    heroHeading: string;
    heroSubtitle: string;
    officeHours: string;
    sundayHours: string;
    volunteerHeading: string;
    volunteerDesc: string;
    faqHeading: string;
    faqs: FaqItem[];
  };
  footer: {
    description: string;
    tagline: string;
    copyright: string;
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  general: {
    siteName: "आशीष कुमार सिंह",
    tagline: "जनकल्याण ही मेरा धर्म",
    navCtaLabel: "जुड़ें",
    logoUrl: "https://ik.imagekit.io/smcdngw8m/336-3365329_bjp-png-clipart-indian-national-congress-bharatiya-bjp-logo-png-hd-removebg-preview_b0kX6vgNL.png?updatedAt=1783583022193",
  },
  whatsapp: {
    number: "919415050717",
    enabled: true,
  },
  socialMedia: {
    facebook: "https://facebook.com/ashishforpublic",
    twitter: "https://twitter.com/ashishforpublic",
    instagram: "https://instagram.com/ashishforpublic1",
  },
  contactInfo: {
    address: "जनसेवक सदन, 33-बी, ब्लॉक-डी, श्याम नगर, कानपुर — 208013",
    phone1: "8933850006",
    phone2: "9415050717",
    email: "ashishsinghjansevak@gmail.com",
    website: "ashishforpublic.com",
  },
  nav: {
    links: [
      { name: "होम", path: "/" },
      { name: "परिचय", path: "/about" },
      { name: "दृष्टिकोण", path: "/vision" },
      { name: "मीडिया", path: "/media" },
      { name: "संपर्क", path: "/contact" },
    ],
  },
  hero: {
    partyBadge: "भारतीय जनता पार्टी | 216 छावनी विधानसभा",
    headline: "आशीष कुमार सिंह",
    subheading: "216 छावनी विधानसभा, कानपुर",
    quote: "जनकल्याण ही मेरा धर्म",
    cta1: "मेरे बारे में",
    cta2: "जनसंपर्क करें",
    cta3: "विज़न देखें",
    floatingBadgeTitle: "समर्पित नेतृत्व",
    floatingBadgeSub: "जनता के द्वार",
    profileImage: "https://ik.imagekit.io/smcdngw8m/e101b72c-3c89-4b89-ada9-bcb31bd339c6_xwIFphJ4f.png?updatedAt=1783584223646",
  },
  stats: [
    { label: "वर्षों का अनुभव", value: 25, suffix: "+" },
    { label: "सार्वजनिक कार्यक्रम", value: 500, suffix: "+" },
    { label: "नागरिक जुड़े", value: 10000, suffix: "+" },
    { label: "सामाजिक अभियान", value: 100, suffix: "+" },
  ],
  mission: {
    sectionLabel: "हमारा संकल्प",
    heading: "सेवा • सुशासन • समर्पण",
    description: "एक सशक्त, समृद्ध और सुरक्षित समाज के निर्माण के लिए हमारा निरंतर प्रयास।",
    cards: [
      { title: "सेवा", desc: "निस्वार्थ भाव से समाज के अंतिम व्यक्ति तक विकास पहुंचाना और उनकी समस्याओं का समाधान करना।" },
      { title: "सुशासन", desc: "पारदर्शी, जवाबदेह और भ्रष्टाचार मुक्त प्रशासनिक व्यवस्था सुनिश्चित करने के लिए निरंतर संघर्ष।" },
      { title: "समर्पण", desc: "राष्ट्र प्रथम की भावना के साथ समाज के हर वर्ग के उत्थान के लिए अपना सर्वस्व न्यौछावर करना।" },
    ],
    coreValues: ["सबका साथ", "सबका विकास", "सबका विश्वास", "सबका प्रयास"],
  },
  homeTimeline: {
    heading: "राजनीतिक यात्रा",
    subheading: "अनुभव एवं संघर्ष",
    ctaLabel: "संपूर्ण यात्रा देखें",
    items: [
      { year: "2018", title: "सिकंद्रा विधानसभा उपचुनाव", role: "चुनाव संयोजक एवं चुनाव प्रभारी" },
      { year: "2021", title: "उत्तर प्रदेश संगठन", role: "प्रदेश कार्यसमिति सदस्य, किसान मोर्चा" },
      { year: "2022", title: "सिकंद्रा विधानसभा", role: "चुनाव संचालन प्रमुख" },
    ],
  },
  quoteBanner: "चरेवेति-चरेवेति, यही तो मंत्र है अपना। नहीं रुकना, नहीं थकना, सतत चलना, सतत बढ़ना।",
  joinSection: {
    heading: "हमारे साथ जुड़ें",
    description: "एक बेहतर समाज और सशक्त राष्ट्र के निर्माण में अपना योगदान दें।",
    ctaLabel: "जुड़ें",
  },
  about: {
    heroHeading: "परिचय — आशीष कुमार सिंह",
    heroSubtitle: "एक सेवक, एक नेता, एक दृष्टा",
    personalName: "आशीष कुमार सिंह",
    personalFather: "स्व. अमरजीत सिंह 'जनसेवक' (पूर्व शिक्षा मंत्री, उत्तर प्रदेश)",
    personalBirth: "26 जून 1976",
    personalEducation: "MBA (MIS), University of Iowa, USA",
    personalMembership: "200389063",
    aboutUsHeading: "हमारे बारे में",
    aboutUsContent: "आशीष कुमार सिंह एक अनुभवी सामाजिक-राजनीतिक कार्यकर्ता हैं जो निरंतर कानपुर की छावनी विधानसभा क्षेत्र के सर्वांगीण विकास के लिए प्रयासरत हैं। अमेरिका से उच्च शिक्षा (MBA) प्राप्त करने के उपरांत, उन्होंने मातृभूमि की सेवा को सर्वोपरि मानकर वापस लौटने का निर्णय लिया। आज वे शिक्षा, पेट्रोलियम व्यवसाय और सामाजिक कल्याण के क्षेत्रों में सक्रिय भूमिका निभाते हुए जनता की समस्याओं के त्वरित समाधान के लिए समर्पित हैं।",
    timelineEvents: [
      { year: "बाल्यकाल से", title: "राष्ट्रीय स्वयंसेवक संघ", desc: "राष्ट्रीय स्वयंसेवक संघ के स्वयंसेवक, संघ के विभिन्न प्रशिक्षण वर्गों के प्रतिभागी।" },
      { year: "शिक्षा", title: "MBA (MIS) — University of Iowa, USA", desc: "University of Iowa, USA से उच्च शिक्षा प्राप्त की।" },
      { year: "1998–2002", title: "IT करियर — USA", desc: "अमेरिका की प्रतिष्ठित IT कंपनियों में सॉफ्टवेयर डेवलपर के रूप में कार्य।" },
      { year: "2002–2004", title: "व्यापार — न्यूयॉर्क", desc: "न्यूयॉर्क स्थित चेन ऑफ फार्मेसी में पार्टनरशिप।" },
      { year: "2005–वर्तमान", title: "भारत वापसी एवं शिक्षा सेवा", desc: "मातृभूमि की सेवा हेतु अमेरिका से लौटे। संदीपानी पब्लिक स्कूल, बिंदकी (CBSE) के प्रबंधक।" },
      { year: "व्यापार", title: "पेट्रोलियम व्यवसाय", desc: "पेट्रोलियम व्यवसाय का सफल संचालन।" },
      { year: "निरंतर", title: "आध्यात्मिक यात्रा", desc: "श्री राम चंद्र मिशन के प्रशिक्षक एवं हार्टफुलनेस के सक्रिय प्रतिनिधि।" },
      { year: "2018", title: "चुनाव सह-संयोजक", desc: "सिकंद्रा विधानसभा उपचुनाव में सह चुनाव संयोजक एवं चुनाव प्रभारी की भूमिका।" },
      { year: "2019", title: "लोकसभा चुनाव प्रभारी", desc: "फतेहपुर लोकसभा चुनाव में बिंदकी विधानसभा जनसंपर्क प्रभारी।" },
      { year: "2021", title: "प्रदेश कार्यसमिति सदस्य", desc: "BJP उत्तर प्रदेश की प्रदेश कार्यसमिति (किसान मोर्चा) में मनोनीत।" },
      { year: "2022", title: "चुनाव संचालन प्रमुख", desc: "सिकंद्रा विधानसभा चुनाव में चुनाव संयोजक एवं चुनाव संचालन प्रमुख।" },
    ],
    philosophyCards: [
      { title: "दृष्टि (Vision)", desc: "जनकल्याण और समग्र विकास के माध्यम से एक सशक्त एवं आत्मनिर्भर समाज का निर्माण।" },
      { title: "मूल्य (Values)", desc: "ईमानदारी, पारदर्शिता, सेवाभाव और राष्ट्र प्रथम की विचारधारा के प्रति अटूट निष्ठा।" },
      { title: "मिशन (Mission)", desc: "सेवा, सुशासन और समर्पण के मंत्र के साथ अंतिम पंक्ति के व्यक्ति तक विकास पहुंचाना।" },
    ],
    inspirationQuote: "राष्ट्र सर्वोपरि, संगठन ही शक्ति है, सेवा ही सबसे बड़ा धर्म है।",
    profileImage: "https://ik.imagekit.io/smcdngw8m/6ce2fee6-7751-4692-8bfd-355a048dfea6_sXXp7NO8A.png?updatedAt=1783584702477",
  },
  vision: {
    heroHeading: "उत्तर प्रदेश के लिए मेरी दृष्टि",
    heroSubtitle: "एक विकसित, समृद्ध और सशक्त उत्तर प्रदेश",
    prioritiesHeading: "प्रमुख प्राथमिकताएं",
    priorities: [
      { title: "किसान कल्याण", desc: "उचित मूल्य, सिंचाई सुविधाएं और उन्नत कृषि तकनीकों तक पहुंच सुनिश्चित करना।" },
      { title: "महिला सशक्तिकरण", desc: "शिक्षा, स्वरोजगार और सुरक्षा के माध्यम से महिलाओं को आत्मनिर्भर बनाना।" },
      { title: "युवा रोजगार", desc: "कौशल विकास केंद्र और स्थानीय स्तर पर रोजगार के नए अवसर सृजित करना।" },
      { title: "शिक्षा", desc: "आधुनिक सुविधाओं से युक्त विद्यालय और डिजिटल शिक्षा प्रणाली को बढ़ावा।" },
      { title: "स्वास्थ्य", desc: "सस्ती एवं सुलभ चिकित्सा, समय-समय पर नि:शुल्क स्वास्थ्य शिविरों का आयोजन।" },
      { title: "डिजिटल UP", desc: "ई-गवर्नेंस, इंटरनेट कनेक्टिविटी और तकनीकी साक्षरता को गांव-गांव तक पहुंचाना।" },
      { title: "पर्यावरण", desc: "व्यापक वृक्षारोपण, स्वच्छ जल स्रोत और हरित ऊर्जा को अपनाना।" },
      { title: "पारदर्शी शासन", desc: "जवाबदेही, जनसुनवाई और भ्रष्टाचार मुक्त प्रशासनिक व्यवस्था।" },
      { title: "ग्राम विकास", desc: "सड़क, बिजली, पानी और स्वच्छता के बुनियादी ढांचे का सुदृढ़ीकरण।" },
      { title: "आत्मनिर्भरता", desc: "स्थानीय अर्थव्यवस्था, MSME और कुटीर उद्योगों को प्रोत्साहित करना।" },
    ],
    roadmapHeading: "विकास का रोडमैप",
    roadmap: [
      { phase: "चरण 1", title: "जन-जागरण", desc: "जनता की समस्याओं को समझना और संवाद स्थापित करना।" },
      { phase: "चरण 2", title: "संगठन निर्माण", desc: "हर बूथ स्तर पर कार्यकर्ताओं की मजबूत टीम तैयार करना।" },
      { phase: "चरण 3", title: "नीति कार्यान्वयन", desc: "योजनाओं को धरातल पर उतारना और लाभ सुनिश्चित करना।" },
      { phase: "चरण 4", title: "विकास और समृद्धि", desc: "एक आत्मनिर्भर और खुशहाल समाज का निर्माण।" },
    ],
    achievementsHeading: "सामाजिक कार्य एवं उपलब्धियां",
    achievements: [
      "कोरोना अन्नपूर्णा रसोई: महामारी के दौरान निरंतर भोजन वितरण",
      "स्वास्थ्य शिविर: नियमित निःशुल्क स्वास्थ्य जांच का आयोजन",
      "वृक्षारोपण अभियान: पर्यावरण संरक्षण हेतु व्यापक वृक्षारोपण",
      "शिक्षा सहायता: वंचित बच्चों को पठन-पाठन सामग्री वितरण",
      "महिला सशक्तिकरण: सिलाई और कौशल प्रशिक्षण केंद्र",
      "युवा नेतृत्व: युवाओं को राजनीतिक व सामाजिक मार्गदर्शन",
    ],
    pledgeHeading: "मेरा संकल्प",
    pledges: [
      "जन-जन तक पहुंचना और संवाद स्थापित करना",
      "हर जायज समस्या का त्वरित समाधान",
      "पारदर्शी, ईमानदार और सुलभ नेतृत्व",
      "क्षेत्र के समग्र विकास की दिशा में निरंतर प्रयास",
    ],
    missionStatement: "सेवा, सुशासन और समर्पण के साथ उत्तर प्रदेश को विकास की नई ऊंचाइयों पर ले जाना।",
  },
  media: {
    heroHeading: "मीडिया गैलरी",
    heroSubtitle: "चित्र, वीडियो और समाचार कवरेज",
    categories: ["सभी", "राजनीतिक", "जनसभाएं", "किसान", "महिला", "सामाजिक कार्य"],
    photoHeading: "फोटो गैलरी",
photos: [
    {
        "id": "ik-0",
        "category": "राजनीतिक",
        "title": "झलकियां 1",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.07__1__UaxnElWcb.jpeg?updatedAt=1783580963243"
    },
    {
        "id": "ik-1",
        "category": "जनसभाएं",
        "title": "झलकियां 2",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.07__1__RTgiFhLrh.jpeg?updatedAt=1783581723302"
    },
    {
        "id": "ik-2",
        "category": "किसान",
        "title": "झलकियां 3",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.07__1__Xa59pLHpU.jpeg?updatedAt=1783582103022"
    },
    {
        "id": "ik-3",
        "category": "महिला",
        "title": "झलकियां 4",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.07_TsqY2H_Tl.jpeg?updatedAt=1783582138211"
    },
    {
        "id": "ik-4",
        "category": "सामाजिक कार्य",
        "title": "झलकियां 5",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.08_2IxBiqpch.jpeg?updatedAt=1783582190562"
    },
    {
        "id": "ik-5",
        "category": "राजनीतिक",
        "title": "झलकियां 6",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.07__1__qd8BI99Wa.jpeg?updatedAt=1783582207501"
    },
    {
        "id": "ik-6",
        "category": "जनसभाएं",
        "title": "झलकियां 7",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.07__1__MjVJeUAa1.jpeg?updatedAt=1783582247877"
    },
    {
        "id": "ik-7",
        "category": "किसान",
        "title": "झलकियां 8",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.07_ANcur4qTb.jpeg?updatedAt=1783582267496"
    },
    {
        "id": "ik-8",
        "category": "महिला",
        "title": "झलकियां 9",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.08__1__81L1qR53r.jpeg?updatedAt=1783582292643"
    },
    {
        "id": "ik-9",
        "category": "सामाजिक कार्य",
        "title": "झलकियां 10",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.08__2__Mdge3pqLK.jpeg?updatedAt=1783582327586"
    },
    {
        "id": "ik-10",
        "category": "राजनीतिक",
        "title": "झलकियां 11",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.09__1__LkxhFcAkr.jpeg?updatedAt=1783582345248"
    },
    {
        "id": "ik-11",
        "category": "जनसभाएं",
        "title": "झलकियां 12",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.10__1__OHxSigLZs.jpeg?updatedAt=1783582394383"
    },
    {
        "id": "ik-12",
        "category": "किसान",
        "title": "झलकियां 13",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.10__2__cHACYevy0.jpeg?updatedAt=1783582411333"
    },
    {
        "id": "ik-13",
        "category": "महिला",
        "title": "झलकियां 14",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.10_NSyKGY1nw.jpeg?updatedAt=1783582437805"
    },
    {
        "id": "ik-14",
        "category": "सामाजिक कार्य",
        "title": "झलकियां 15",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.11__1__4qPZh0VGT.jpeg?updatedAt=1783582460386"
    },
    {
        "id": "ik-15",
        "category": "राजनीतिक",
        "title": "झलकियां 16",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.11__2__apaCYqc0V.jpeg?updatedAt=1783582484838"
    },
    {
        "id": "ik-16",
        "category": "जनसभाएं",
        "title": "झलकियां 17",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.11_pks5KeYie.jpeg?updatedAt=1783582504444"
    },
    {
        "id": "ik-17",
        "category": "किसान",
        "title": "झलकियां 18",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.12__1__lxD5IaX3D.jpeg?updatedAt=1783582527001"
    },
    {
        "id": "ik-18",
        "category": "महिला",
        "title": "झलकियां 19",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.12__2__UB2xPRDBH.jpeg?updatedAt=1783582564264"
    },
    {
        "id": "ik-19",
        "category": "सामाजिक कार्य",
        "title": "झलकियां 20",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.12_2Eya8dsr8.jpeg?updatedAt=1783582607377"
    },
    {
        "id": "ik-20",
        "category": "राजनीतिक",
        "title": "झलकियां 21",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.13__1__gsZL8lWnq.jpeg?updatedAt=1783582620424"
    },
    {
        "id": "ik-21",
        "category": "जनसभाएं",
        "title": "झलकियां 22",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.13__2__bR8ORLqWS.jpeg?updatedAt=1783582635472"
    },
    {
        "id": "ik-22",
        "category": "किसान",
        "title": "झलकियां 23",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.13_tD5BwcI0e.jpeg?updatedAt=1783582659642"
    },
    {
        "id": "ik-23",
        "category": "महिला",
        "title": "झलकियां 24",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.14__1__KojBbUOR5.jpeg?updatedAt=1783582680130"
    },
    {
        "id": "ik-24",
        "category": "सामाजिक कार्य",
        "title": "झलकियां 25",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.14__2__e2JikwyPi.jpeg?updatedAt=1783582700714"
    },
    {
        "id": "ik-25",
        "category": "राजनीतिक",
        "title": "झलकियां 26",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.14_HiRuP7XLW.jpeg?updatedAt=1783582729379"
    },
    {
        "id": "ik-26",
        "category": "जनसभाएं",
        "title": "झलकियां 27",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.15__1__mwABwJry-.jpeg?updatedAt=1783582739948"
    },
    {
        "id": "ik-27",
        "category": "किसान",
        "title": "झलकियां 28",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.15__2__JPC2F2rqo.jpeg?updatedAt=1783582755006"
    },
    {
        "id": "ik-28",
        "category": "महिला",
        "title": "झलकियां 29",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.15_tvaFOvPAi.jpeg?updatedAt=1783582774300"
    },
    {
        "id": "ik-29",
        "category": "सामाजिक कार्य",
        "title": "झलकियां 30",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.16__1__cl2fVzgvI.jpeg?updatedAt=1783582787140"
    },
    {
        "id": "ik-30",
        "category": "राजनीतिक",
        "title": "झलकियां 31",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.16_rARCsjjai.jpeg?updatedAt=1783582800468"
    },
    {
        "id": "ik-31",
        "category": "जनसभाएं",
        "title": "झलकियां 32",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.17__1__tqtP0AbxB.jpeg?updatedAt=1783582813491"
    },
    {
        "id": "ik-32",
        "category": "किसान",
        "title": "झलकियां 33",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.17__2__ZJdF_6VA_.jpeg?updatedAt=1783582831374"
    },
    {
        "id": "ik-33",
        "category": "महिला",
        "title": "झलकियां 34",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.17_6wADXCaxY.jpeg?updatedAt=1783582845942"
    },
    {
        "id": "ik-34",
        "category": "सामाजिक कार्य",
        "title": "झलकियां 35",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.18__1__KfDe9Ijre.jpeg?updatedAt=1783582856201"
    },
    {
        "id": "ik-35",
        "category": "राजनीतिक",
        "title": "झलकियां 36",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.18_HUpNsfukq.jpeg?updatedAt=1783582866305"
    },
    {
        "id": "ik-36",
        "category": "जनसभाएं",
        "title": "झलकियां 37",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.19__1__u-S9SFeST.jpeg?updatedAt=1783582883538"
    },
    {
        "id": "ik-37",
        "category": "किसान",
        "title": "झलकियां 38",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.19__2__0KqyhnYxx.jpeg?updatedAt=1783582893092"
    },
    {
        "id": "ik-38",
        "category": "महिला",
        "title": "झलकियां 39",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.19_O3OePWHUE.jpeg?updatedAt=1783582902097"
    },
    {
        "id": "ik-39",
        "category": "सामाजिक कार्य",
        "title": "झलकियां 40",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.20__1__SENXV8cqv.jpeg?updatedAt=1783582916651"
    },
    {
        "id": "ik-40",
        "category": "राजनीतिक",
        "title": "झलकियां 41",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.20__2__G_jBuX8eS.jpeg?updatedAt=1783582932385"
    },
    {
        "id": "ik-41",
        "category": "जनसभाएं",
        "title": "झलकियां 42",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.20_6-FqEsa_6.jpeg?updatedAt=1783582956789"
    },
    {
        "id": "ik-42",
        "category": "किसान",
        "title": "झलकियां 43",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.21__1__oR0cCZ7Ag.jpeg?updatedAt=1783582973976"
    },
    {
        "id": "ik-43",
        "category": "महिला",
        "title": "झलकियां 44",
        "url": "https://ik.imagekit.io/smcdngw8m/WhatsApp_Image_2026-07-09_at_12.05.21__2__r3P-7zpKR.jpeg?updatedAt=1783582981019"
    }
],
    videoHeading: "वीडियो गैलरी",
    videos: [
      { title: "जनसंपर्क अभियान — छावनी विधानसभा", embedUrl: "" },
      { title: "विकास की दृष्टि — एक विशेष संवाद", embedUrl: "" },
      { title: "BJP संगठन सम्मेलन मुख्य भाषण", embedUrl: "" },
    ],
    newsHeading: "समाचार एवं प्रेस",
    news: [
      { date: "15 अगस्त 2023", title: "स्वतंत्रता दिवस पर विशाल तिरंगा यात्रा का आयोजन", source: "दैनिक जागरण" },
      { date: "10 जून 2022", title: "छावनी विधानसभा में जनसंपर्क अभियान को मिला भारी समर्थन", source: "अमर उजाला" },
      { date: "25 मार्च 2021", title: "आशीष कुमार सिंह को प्रदेश कार्यसमिति में महत्वपूर्ण जिम्मेदारी", source: "हिन्दुस्तान" },
    ],
  },
  contactPage: {
    heroHeading: "संपर्क करें",
    heroSubtitle: "आपकी समस्या, मेरी प्राथमिकता",
    officeHours: "सोमवार — शनिवार: 10:00 AM — 5:00 PM",
    sundayHours: "रविवार: विशेष कार्यक्रमानुसार",
    volunteerHeading: "स्वयंसेवक के रूप में जुड़ें",
    volunteerDesc: "राष्ट्र निर्माण और समाज सेवा के इस महायज्ञ में आहुति दें।",
    faqHeading: "अक्सर पूछे जाने वाले प्रश्न",
    faqs: [
      { q: "जनसुनवाई का समय क्या है?", a: "जनसुनवाई प्रतिदिन सुबह 10:00 बजे से दोपहर 1:00 बजे तक कार्यालय पर की जाती है।" },
      { q: "कार्यालय का समय क्या है?", a: "सोमवार से शनिवार सुबह 10:00 बजे से शाम 5:00 बजे तक खुला रहता है।" },
      { q: "मैं स्वयंसेवक के रूप में कैसे जुड़ सकता हूं?", a: "नीचे दिए गए फॉर्म को भरकर या सीधे कार्यालय में संपर्क करके जुड़ें।" },
      { q: "मीडिया इंटरव्यू के लिए कैसे संपर्क करें?", a: "ईमेल ashishsinghjansevak@gmail.com या कार्यालय फोन पर संपर्क करें।" },
      { q: "ऑनलाइन शिकायत कैसे दर्ज करें?", a: "संपर्क फॉर्म या WhatsApp 9415050717 पर अपनी समस्या भेजें।" },
    ],
  },
  footer: {
    description: "भारतीय जनता पार्टी के कर्मठ कार्यकर्ता एवं 216 छावनी विधानसभा, कानपुर के समर्पित जनसेवक।",
    tagline: "सेवा • सुशासन • समर्पण",
    copyright: "© 2025 आशीष कुमार सिंह. सर्वाधिकार सुरक्षित.",
  },
};
