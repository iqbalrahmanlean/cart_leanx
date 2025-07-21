// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Header
      "contact_us" : "Contact Us",
      "Market_Research_by_Category": "Market Research by Category",
      'Featured_Market_Research_Reports' : "Featured Market Research Reports",
      "about_us" : "About Us",



      "twopip_research": "Powered by Payright",
      "global_marketplace": "Global Market Research Marketplace",
      "english": "English",
      "cart": "Cart",
     "Special_Promotional_Offers" : "Special Promotional Offers",

      "buying_option" : "Buying Options",
      "limited" : "Limited-time deals on premium market research reports. Save big on industry insights and competitive intelligence.",
      
      // Navigation
      "healthcare": "Healthcare",
      "pharmaceuticals": "Pharmaceuticals", 
      "chemicals_materials": "Chemicals & Materials",
      "manufacturing_construction": "Manufacturing & Construction",
      "energy_natural_resources": "Energy & Natural Resources",
      "food_beverage": "Food & Beverage",
      "consumer_goods_services": "Consumer Goods & Services",

      // Report Page - ADD THESE MISSING KEYS
      "buying_options": "Buying Options",
      "add_to_cart": "add to cart",
      "buy_now": "buy now",
      "published_date": "Published date",
      "page": "Page",
      "reports": "Reports",
      "report_id": "ID",
      
      // Hero Section
      "hero_title": "Trusted Market Research & Industry Insights",
      "hero_subtitle": "Providing solutions to complex business challenges worldwide",
      
      // Search Section
      "what_looking_for": "What are you looking for?",
      "search_placeholder": "Search for product names",
      
      // Brands Section
      "trusted_by_brands": "Trusted by Leading Global Brands",
      "from" : "From",
      
      // Categories Section
      "market_research_categories": "Market Research by Category",
      "consumer_goods": "Consumer Goods",
      "heavy_industry": "Heavy Industry", 
      "service_industries": "Service Industries",
      "public_sector": "Public Sector",
      "life_sciences": "Life Sciences",
      "technology_media": "Technology & Media",
      "marketing_research": "Marketing & Market Research",
     "published_date"  : "Published Date",

    "full_name": "Full Name",
      "email_address": "Email Address",
      "phone_number":"Phone Number", 
      "add_to_cart" : "Add to cart",
      "buy_now" : "Buy now",

      
      // Reports Section
      "featured_reports": "Featured Market Research Reports",
      "discover_more": "Discover More Reports",
      
      // Footer
      "contact_us": "Contact Us",
      "email": "Email",
      "hours": "Hours",
      "address": "Address",
      "ceo": "CEO",
      "privacy_policy": "Privacy Policy", 
      "terms_conditions": "Terms & Conditions",
      "copyright": "Copyright © Twopip. All Rights Reserved.",
      
      // Cart Page
      "shopping_cart": "Shopping Cart",
      "no_items_in_cart": "No items in cart",
      "total": "Total",
      "instant_delivery_by_email": "Instant delivery by email",
      "checkout": "Checkout",
      "billing": "Billing",
      "continue_shopping": "Continue Shopping",
      "remove": "Remove",
      "region": "Region",
      "language": "Language", 
      "currency": "Currency",
      "save_settings": "Save Settings",
      "region_note": "Change your region to see products specific to that region.",
      "please_note": "Please note:",
      "heavy_industry" : "Heave Industry",


      
      // Countries
      "united_states": "United States",
      "japan": "Japan",
      "south_korea": "South Korea",
      "food_beverage" :"Food Beverage",
      "service_industry_" : "Service Industry",
      "consumer_goods" :"Consumer Goods",
  


      
      // Languages
      "japanese": "Japanese",
      "korean": "Korean",
      
      // Currencies
      "usd": "USD ($)",
      "jpy": "JPY (¥)",
      "eur": "EUR (€)",
      "krw": "KRW (₩)"
    }
  },
  ja: {
    translation: {
      // Header
      "twopip_research": "Powered by Payright",

      "global_marketplace": "グローバル市場調査マーケットプレイス",
      "english": "英語",
      "cart": "カート",

      "reports" : "レポート",
      "pages" : "ページ",
      "from" : "から",
      "add_to_cart" : "カートに追加",
      "buy_now": "今すぐ購入",
      "buying_option" : "購入オプション",

      
      // Navigation
      "healthcare": "ヘルスケア",
      "pharmaceuticals": "医薬品",
      "chemicals_materials": "化学品・素材", 
      "manufacturing_construction": "製造・建設",
      "energy_natural_resources": "エネルギー・天然資源",
      "food_beverage": "食品・飲料",
      "consumer_goods_services": "消費財・サービス",
      
      // Report Page - ADD THESE MISSING KEYS
      "buying_options": "購入オプション",
      "add_to_cart": "カートに追加",
      "buy_now": "今すぐ購入",
      "published_date": "公開日",
      "page": "ページ",
      "reports": "レポート",
      "report_id": "ID",
      
      // Hero Section
      "hero_title": "信頼できる市場調査と業界インサイト",
      "hero_subtitle": "ビジネスの難しい課題に対する解決策を提供します。",
      
      // Search Section
      "what_looking_for": "お探しの内容は？",
      "search_placeholder": "製品名を検索",
      
      // Brands Section
      "trusted_by_brands": "世界の一流ブランドに信頼されています",
      
      // Categories Section
      "market_research_categories": "カテゴリー別市場調査",
      "consumer_goods": "消費財",
      "heavy_industry": "重工業",
      "service_industries": "サービス産業", 
      "public_sector": "公共部門",
      "life_sciences": "ライフサイエンス",
      "technology_media": "テクノロジー・メディア",
      "marketing_research": "マーケティング・市場調査",
      "Special_Promotional_Offers" : "特別プロモーションオファー",
      "limited" : "プレミアム市場調査レポートを期間限定でお得に。業界洞察と競合情報をお得に入手できます。",
      
      // Reports Section
      "featured_reports": "注目の市場調査レポート",
      "discover_more": "さらにレポートを見る",
      
      // Footer
      "contact_us": "お問い合わせ",
      "email": "電子メール",
      "hours": "時間",
      "address": "住所", 
      "ceo": "代表者名",
      "privacy_policy": "プライバシーポリシー",
      "terms_conditions": "利用規約",
      "copyright": "Copyright © Twopip. All Rights Reserved.",
      
      // Cart Page
      "shopping_cart": "ショッピングカート",
      "no_items_in_cart": "カートに商品がありません",
      "total": "合計",
      "instant_delivery_by_email": "メールで即時配信",
      "checkout": "購入手続きへ",
      "billing": "請求",
      "continue_shopping": "買い物を続ける",
      "remove": "削除",
      "region": "地域",
      "language": "言語",
      "currency": "通貨",
      "save_settings": "設定を保存",
      "region_note": "地域を変更すると、その地域特有の製品が表示されます。",
      "please_note": "ご注意：",

      //form
      "full_name": "ご注意：",
      "email_address": "メールアドレス",
      "phone_number":"電話番号", 
      "Market_Research_by_Category ": "カテゴリー別市場調査",
      "Featured_Market_Research_Reports" : "注目の市場調査レポート",
          "consumer_goods" :"消費財",



      
      // Countries
      "united_states": "アメリカ合衆国",
      "japan": "日本",
      "south_korea": "韓国",
      
      // Languages
      "japanese": "日本語",
      "korean": "韓国語",
      
      // Currencies
      "usd": "USD ($)",
      "jpy": "JPY (¥)",
      "eur": "EUR (€)",
      "krw": "KRW (₩)"
    }
  },
  ko: {
    translation: {
      // Header
      "contact_us" : "お問い合わせ",
      "twopip_research": "Powered by Payright",

      "global_marketplace": "글로벌 시장 조사 마켓플레이스",
      "english": "영어",
      "cart": "장바구니",
      "heavy_industry" : "重工業",
      "food_beverage" :"食品・飲料",

      
      // Navigation
      "healthcare": "헬스케어",
      
      "pharmaceuticals": "제약",
      "chemicals_materials": "화학 및 소재",
      "manufacturing_construction": "제조 및 건설", 
      "energy_natural_resources": "에너지 및 천연자원",
      "food_beverage": "식품 및 음료",
      "consumer_goods_services": "소비재 및 서비스",
      
      // Report Page - ADD THESE MISSING KEYS
      "buying_options": "구매 옵션",
      "add_to_cart": "장바구니에 추가",
      "buy_now": "지금 구매",
      "published_date": "출간일",
      "page": "페이지",
      "reports": "보고서",
      "report_id": "ID",
      
      // Hero Section
      "hero_title": "신뢰할 수 있는 시장 조사 및 업계 인사이트",
      "hero_subtitle": "전 세계 복잡한 비즈니스 과제에 대한 솔루션을 제공합니다.",
      
      // Search Section
      "what_looking_for": "무엇을 찾고 계신가요?",
      "search_placeholder": "제품명 검색",
      
      // Brands Section
      "trusted_by_brands": "세계 최고의 브랜드들의 신뢰를 받고 있습니다",
      
      // Categories Section
      "market_research_categories": "카테고리별 시장 조사",
      "consumer_goods": "소비재",
      "heavy_industry": "중공업",
      "service_industries": "서비스 산업",
      "public_sector": "공공 부문",
      "life_sciences": "생명과학",
      "technology_media": "기술 및 미디어", 
      "marketing_research": "마케팅 및 시장 조사",
      "market_research_report" : "ヘルスケア カテゴリー別市場調査",

      
      // Reports Section
      "about_us" : "私たちについて",
      "featured_reports": "주요 시장 조사 보고서",
      "discover_more": "더 많은 보고서 보기",
      
      // Footer
      "contact_us": "문의하기",
      "email": "이메일",
      "hours": "시간",
      "address": "주소",
      "ceo": "대표이사",
      "privacy_policy": "개인정보처리방침",
      "terms_conditions": "이용약관",
      "copyright": "Copyright © Twopip. All Rights Reserved.",
      'discover_more' : "さらにレポートを見る",

      
      // Cart Page
      "shopping_cart": "장바구니",
      "no_items_in_cart": "장바구니에 상품이 없습니다",
      "total": "총합",
      "instant_delivery_by_email": "이메일로 즉시 배송",
      "checkout": "결제하기",
      "billing": "청구",
      "continue_shopping": "쇼핑 계속하기",
      "remove": "제거",
      "region": "지역",
      "language": "언어",
      "currency": "통화",
      "save_settings": "설정 저장",
      "region_note": "지역을 변경하면 해당 지역에 특화된 제품을 볼 수 있습니다.",
      "please_note": "참고:",

   "published_date"  : "公開日",
      
      // Countries
      "united_states": "미국",
      "japan": "일본", 
      "south_korea": "한국",
      
      // Languages
      "japanese": "일본어",
      "korean": "한국어",

      
      
      // Currencies
      "usd": "USD ($)",
      "jpy": "JPY (¥)",
      "eur": "EUR (€)",
      "krw": "KRW (₩)"

      
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ja',
    lng: localStorage.getItem('i18nextLng') || 'ja', // Read from localStorage first
    
    interpolation: {
      escapeValue: false, // react already does escaping
    },
    
    detection: {
      order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng', 
      caches: ['localStorage', 'sessionStorage'], // Cache in both
    },
    
    // Add these for better debugging and persistence
    debug: false,
    load: 'languageOnly',
    preload: ['en', 'ja', 'ko'],
    
    // Ensure language changes are saved immediately
    saveMissing: false,
    updateMissing: false,
  });

// Add event listener to save language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
  console.log('Language changed to:', lng); // Debug log
});

export default i18n;