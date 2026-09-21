import {
  createContext,
  useContext,
  useState,
} from "react";

const LanguageContext = createContext(null);

export const LANGUAGES = [
  {
    code: "en",
    voiceCode: "en-IN",
    nativeLabel: "English",
  },
  {
    code: "ta",
    voiceCode: "ta-IN",
    nativeLabel: "தமிழ்",
  },
  {
    code: "hi",
    voiceCode: "hi-IN",
    nativeLabel: "हिन्दी",
  },
];

const translations = {
  en: {
    login: "Login",
    register: "Register",
    welcome: "Welcome",
    dashboard: "Dashboard",
    profile: "Profile",
    medicalHistory: "Medical History",
    medications: "Medications",
    allergies: "Allergies",
    medicalDocuments: "Medical Documents",
    logout: "Logout",
    patient: "Patient",
    doctor: "Doctor",
    admin: "Admin",

    patientPortal: "PATIENT PORTAL",
    myMedicalHistory: "My Medical History",
    historySubtitle:
      "Keep your medical information updated for your healthcare team.",

    success: "Success",
    error: "Error",

    doctorReview: "Doctor Review",
    historyReviewed: "History Reviewed and Confirmed",
    confirmedAt: "Confirmed At",
    notAvailable: "Not available",
    waitingForReview:
      "Your medical history is waiting for doctor review.",
    confirmed: "Confirmed",
    pendingReview: "Pending Review",

    voiceInputAvailable: "Voice Input Available",
    voiceInputDescription:
      "Click the Speak button beside any field and describe your medical information using your voice. You can edit the text before saving.",

    medicalInformation: "Medical Information",
    medicalInformationSubtitle:
      "Please provide accurate information about your health.",
    privateInformation: "Private Information",

    chiefComplaint: "Chief Complaint",
    historyOfPresentIllness: "History of Present Illness",
    pastMedicalHistory: "Past Medical History",
    pastSurgicalHistory: "Past Surgical History",
    personalHistory: "Personal History",
    familyHistory: "Family History",
    reviewOfSystems: "Review of Systems",

    chiefComplaintPlaceholder:
      "What is your main health problem?",
    historyOfPresentIllnessPlaceholder:
      "Describe your current health problem, when it started, symptoms, etc.",
    pastMedicalHistoryPlaceholder:
      "Mention previous illnesses, diseases, conditions, etc.",
    pastSurgicalHistoryPlaceholder:
      "Mention previous surgeries or operations.",
    personalHistoryPlaceholder:
      "Mention lifestyle, food habits, sleep, smoking, alcohol, etc.",
    familyHistoryPlaceholder:
      "Mention diseases or medical conditions in your family.",
    reviewOfSystemsPlaceholder:
      "Mention other symptoms or health problems affecting different body systems.",

    informationSecurelyStored:
      "Your medical information is securely stored.",

    saveMedicalHistory: "Save Medical History",
    saving: "Saving...",
    loadingMedicalHistory: "Loading Medical History",
    pleaseWait: "Please wait...",
  },

  ta: {
    login: "உள்நுழைவு",
    register: "பதிவு செய்க",
    welcome: "வரவேற்கிறோம்",
    dashboard: "டாஷ்போர்டு",
    profile: "சுயவிவரம்",
    medicalHistory: "மருத்துவ வரலாறு",
    medications: "மருந்துகள்",
    allergies: "ஒவ்வாமைகள்",
    medicalDocuments: "மருத்துவ ஆவணங்கள்",
    logout: "வெளியேறு",
    patient: "நோயாளர்",
    doctor: "மருத்துவர்",
    admin: "நிர்வாகி",

    patientPortal: "நோயாளர் போர்டல்",
    myMedicalHistory: "எனது மருத்துவ வரலாறு",
    historySubtitle:
      "உங்கள் மருத்துவ தகவல்களை மருத்துவ குழுவிற்காக புதுப்பித்து வைத்திருக்கவும்.",

    success: "வெற்றி",
    error: "பிழை",

    doctorReview: "மருத்துவர் பரிசீலனை",
    historyReviewed:
      "மருத்துவ வரலாறு பரிசீலிக்கப்பட்டு உறுதிப்படுத்தப்பட்டது",
    confirmedAt: "உறுதிப்படுத்திய நேரம்",
    notAvailable: "கிடைக்கவில்லை",
    waitingForReview:
      "உங்கள் மருத்துவ வரலாறு மருத்துவர் பரிசீலனைக்காக காத்திருக்கிறது.",
    confirmed: "உறுதிப்படுத்தப்பட்டது",
    pendingReview: "பரிசீலனை நிலுவையில்",

    voiceInputAvailable: "குரல் உள்ளீடு கிடைக்கிறது",
    voiceInputDescription:
      "எந்த புலத்திற்கும் அருகிலுள்ள Speak பொத்தானை அழுத்தி உங்கள் மருத்துவ தகவலை குரலில் கூறலாம். சேமிப்பதற்கு முன் உரையைத் திருத்தலாம்.",

    medicalInformation: "மருத்துவ தகவல்கள்",
    medicalInformationSubtitle:
      "உங்கள் உடல்நிலை பற்றிய சரியான தகவல்களை வழங்கவும்.",
    privateInformation: "தனிப்பட்ட தகவல்",

    chiefComplaint: "முக்கிய புகார்",
    historyOfPresentIllness: "தற்போதைய நோயின் வரலாறு",
    pastMedicalHistory: "முந்தைய மருத்துவ வரலாறு",
    pastSurgicalHistory: "முந்தைய அறுவை சிகிச்சை வரலாறு",
    personalHistory: "தனிப்பட்ட வரலாறு",
    familyHistory: "குடும்ப மருத்துவ வரலாறு",
    reviewOfSystems: "உடல் அமைப்புகளின் ஆய்வு",

    chiefComplaintPlaceholder:
      "உங்கள் முக்கிய உடல்நலப் பிரச்சினை என்ன?",
    historyOfPresentIllnessPlaceholder:
      "தற்போதைய உடல்நலப் பிரச்சினை, எப்போது தொடங்கியது, அறிகுறிகள் போன்றவற்றை குறிப்பிடவும்.",
    pastMedicalHistoryPlaceholder:
      "முந்தைய நோய்கள், உடல்நிலைகள் மற்றும் மருத்துவ பிரச்சினைகளை குறிப்பிடவும்.",
    pastSurgicalHistoryPlaceholder:
      "முந்தைய அறுவை சிகிச்சைகள் அல்லது மருத்துவ நடவடிக்கைகளை குறிப்பிடவும்.",
    personalHistoryPlaceholder:
      "வாழ்க்கை முறை, உணவுப் பழக்கம், தூக்கம், புகைபிடித்தல், மது போன்றவற்றை குறிப்பிடவும்.",
    familyHistoryPlaceholder:
      "குடும்பத்தில் உள்ள நோய்கள் அல்லது மருத்துவ நிலைகளை குறிப்பிடவும்.",
    reviewOfSystemsPlaceholder:
      "பல்வேறு உடல் அமைப்புகளை பாதிக்கும் பிற அறிகுறிகள் அல்லது உடல்நலப் பிரச்சினைகளை குறிப்பிடவும்.",

    informationSecurelyStored:
      "உங்கள் மருத்துவ தகவல்கள் பாதுகாப்பாக சேமிக்கப்படுகின்றன.",

    saveMedicalHistory: "மருத்துவ வரலாற்றை சேமிக்கவும்",
    saving: "சேமிக்கப்படுகிறது...",
    loadingMedicalHistory: "மருத்துவ வரலாறு ஏற்றப்படுகிறது",
    pleaseWait: "தயவுசெய்து காத்திருக்கவும்...",
  },

  hi: {
    login: "लॉगिन",
    register: "पंजीकरण",
    welcome: "स्वागत है",
    dashboard: "डैशबोर्ड",
    profile: "प्रोफ़ाइल",
    medicalHistory: "चिकित्सा इतिहास",
    medications: "दवाइयाँ",
    allergies: "एलर्जी",
    medicalDocuments: "चिकित्सा दस्तावेज़",
    logout: "लॉगआउट",
    patient: "मरीज़",
    doctor: "डॉक्टर",
    admin: "प्रशासक",

    patientPortal: "मरीज़ पोर्टल",
    myMedicalHistory: "मेरा चिकित्सा इतिहास",
    historySubtitle:
      "अपनी चिकित्सा जानकारी को अपनी स्वास्थ्य टीम के लिए अपडेट रखें।",

    success: "सफलता",
    error: "त्रुटि",

    doctorReview: "डॉक्टर समीक्षा",
    historyReviewed:
      "चिकित्सा इतिहास की समीक्षा और पुष्टि की गई",
    confirmedAt: "पुष्टि का समय",
    notAvailable: "उपलब्ध नहीं",
    waitingForReview:
      "आपका चिकित्सा इतिहास डॉक्टर की समीक्षा की प्रतीक्षा कर रहा है।",
    confirmed: "पुष्टि की गई",
    pendingReview: "समीक्षा लंबित",

    voiceInputAvailable: "वॉइस इनपुट उपलब्ध है",
    voiceInputDescription:
      "किसी भी फ़ील्ड के पास Speak बटन दबाएँ और अपनी चिकित्सा जानकारी बोलकर दर्ज करें। सेव करने से पहले आप टेक्स्ट को बदल सकते हैं।",

    medicalInformation: "चिकित्सा जानकारी",
    medicalInformationSubtitle:
      "कृपया अपने स्वास्थ्य के बारे में सही जानकारी दें।",
    privateInformation: "निजी जानकारी",

    chiefComplaint: "मुख्य शिकायत",
    historyOfPresentIllness: "वर्तमान बीमारी का इतिहास",
    pastMedicalHistory: "पिछला चिकित्सा इतिहास",
    pastSurgicalHistory: "पिछली सर्जरी का इतिहास",
    personalHistory: "व्यक्तिगत इतिहास",
    familyHistory: "पारिवारिक इतिहास",
    reviewOfSystems: "शारीरिक प्रणालियों की समीक्षा",

    chiefComplaintPlaceholder:
      "आपकी मुख्य स्वास्थ्य समस्या क्या है?",
    historyOfPresentIllnessPlaceholder:
      "अपनी वर्तमान स्वास्थ्य समस्या, कब शुरू हुई, लक्षण आदि का वर्णन करें।",
    pastMedicalHistoryPlaceholder:
      "पिछली बीमारियों, रोगों और स्वास्थ्य स्थितियों का उल्लेख करें।",
    pastSurgicalHistoryPlaceholder:
      "पिछली सर्जरी या ऑपरेशन का उल्लेख करें।",
    personalHistoryPlaceholder:
      "जीवनशैली, भोजन की आदतें, नींद, धूम्रपान, शराब आदि का उल्लेख करें।",
    familyHistoryPlaceholder:
      "अपने परिवार में मौजूद बीमारियों या स्वास्थ्य स्थितियों का उल्लेख करें।",
    reviewOfSystemsPlaceholder:
      "विभिन्न शारीरिक प्रणालियों को प्रभावित करने वाले अन्य लक्षणों या स्वास्थ्य समस्याओं का उल्लेख करें।",

    informationSecurelyStored:
      "आपकी चिकित्सा जानकारी सुरक्षित रूप से संग्रहीत है।",

    saveMedicalHistory: "चिकित्सा इतिहास सहेजें",
    saving: "सहेजा जा रहा है...",
    loadingMedicalHistory: "चिकित्सा इतिहास लोड हो रहा है",
    pleaseWait: "कृपया प्रतीक्षा करें...",
  },
};

export function VoiceLanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return (
      localStorage.getItem("appLanguage") ||
      "en"
    );
  });

  const setLanguage = (newLanguage) => {
    setLanguageState(newLanguage);
    localStorage.setItem("appLanguage", newLanguage);
  };

  const selectedLanguage =
    LANGUAGES.find(
      (item) => item.code === language
    ) || LANGUAGES[0];

  const t = (key) => {
    return (
      translations[language]?.[key] ||
      translations.en[key] ||
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languages: LANGUAGES,
        selectedLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useVoiceLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useVoiceLanguage must be used inside VoiceLanguageProvider"
    );
  }

  return context;
}