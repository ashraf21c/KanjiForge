import { Language } from '../types/kanji';

export interface Translations {
  appName: string;
  appSubtitle: string;
  badgeScholar: string;
  // Direction
  directionLabel: string;
  shinToKyu: string;
  kyuToShin: string;
  shinShort: string;
  kyuShort: string;
  // Controls
  batchInputPlaceholder: string;
  clearText: string;
  sampleButton: string;
  copyConverted: string;
  copyTsv: string;
  copied: string;
  exportCsv: string;
  fontSerif: string;
  fontSans: string;
  fontSizeLabel: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  // Stats
  linesCount: string;
  charsCount: string;
  convertedCount: string;
  ambiguityAlertsCount: string;
  // Tabs & Views
  tabBatch: string;
  tabDiff: string;
  tabInspector: string;
  tabEncodings: string;
  // Ambiguity
  ambiguityTitle: string;
  ambiguityBannerPrefix: string;
  ambiguityOneToManyNotice: string;
  contextApplied: string;
  resolveAmbiguity: string;
  selectOption: string;
  useRecommendedContext: string;
  nuanceExplanation: string;
  compoundExamples: string;
  singleKanjiQuestion: string;
  // Inspector
  inspectorTitle: string;
  inspectorSubtitle: string;
  clickCharToInspect: string;
  inputGlyph: string;
  outputGlyph: string;
  unicodeSection: string;
  jisSection: string;
  shiftJisSection: string;
  kutenSection: string;
  utf8Bytes: string;
  eucJpSection: string;
  radical: string;
  strokes: string;
  readings: string;
  meaning: string;
  classification: string;
  kankenLabel: string;
  jlptLabel: string;
  gradeLabel: string;
  kankenHint: string;
  jlptHint: string;
  gradeHint: string;
  // Mode & Page Navigation
  navEducational: string;
  navQuickWord: string;
  navLibrary: string;
  educationalTitle: string;
  educationalSubtitle: string;
  libraryTitle: string;
  librarySubtitle: string;
  modeSingle: string;
  modeBatch: string;
  singleWordInputPlaceholder: string;
  singleWordResult: string;
  singleWordQuickTitle: string;
  quickInputLabel: string;
  // Encodings Table
  charCol: string;
  typeCol: string;
  unicodeCol: string;
  jisCol: string;
  sjisCol: string;
  kutenCol: string;
  // Footer & Help
  aboutTitle: string;
  aboutText: string;
  kakikaeNotice: string;
  langName: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ja: {
    appName: 'KanjiForge',
    appSubtitle: '新字体・旧字体 相互変換 ＆ 文字コード解析器',
    badgeScholar: '字形学・漢字コード学術ツール',
    directionLabel: '変換方向',
    shinToKyu: '新字体 → 旧字体 (現代文から正字・古典へ)',
    kyuToShin: '旧字体 → 新字体 (正字・古典から現代文へ)',
    shinShort: '新字体',
    kyuShort: '旧字体',
    batchInputPlaceholder: '変換したい漢字、熟語、または文章を入力してください（1行に1単語のバッチ処理対応）\n例：\n混交\n弁護士\n弁償\n花弁\n予定\n芸術\n欠席\n缶詰\n台風',
    clearText: 'クリア',
    sampleButton: '例文を読み込む',
    copyConverted: '変換結果をコピー',
    copyTsv: 'TSV形式 (原文/変換後) コピー',
    copied: 'コピー完了！',
    exportCsv: 'CSV出力',
    fontSerif: '明朝体',
    fontSans: 'ゴシック体',
    fontSizeLabel: '文字サイズ',
    fontSizeSm: '小',
    fontSizeMd: '中',
    fontSizeLg: '大',
    fontSizeXl: '特大',
    linesCount: '行数',
    charsCount: '文字数',
    convertedCount: '変換文字',
    ambiguityAlertsCount: '一対多の注意',
    tabBatch: 'バッチ変換・対訳',
    tabDiff: '差分ハイライト',
    tabInspector: '文字コード詳細',
    tabEncodings: '符号化コード一覧',
    ambiguityTitle: '一対多（同音書き換え・統合字）の検出アラート',
    ambiguityBannerPrefix: '1対多の分岐が検出されました',
    ambiguityOneToManyNotice: '新字体では同一の字でも、旧字体・正字では異なる漢字が複数存在します。熟語の文脈から自動推定された文字、または手動選択を選択してください。',
    contextApplied: '文脈適用済み',
    resolveAmbiguity: '異体字を選択',
    selectOption: '適用する旧字を選択',
    useRecommendedContext: '文脈推奨を適用',
    nuanceExplanation: '字義・ニュアンスの違い',
    compoundExamples: '代表的な用例・熟語',
    singleKanjiQuestion: '単独の漢字が入力されました。どの意味・文脈の旧字に変換しますか？',
    inspectorTitle: '文字コード・字形インスペクター',
    inspectorSubtitle: '入力文字と出力文字の Unicode、JIS、Shift-JIS、区点コード、部首・画数を精密解析',
    clickCharToInspect: 'テキスト内の文字をクリックすると、その文字の符号化コード詳細が表示されます。',
    inputGlyph: '入力文字',
    outputGlyph: '出力文字',
    unicodeSection: 'Unicode (コードポイント)',
    jisSection: 'JISコード (JIS X 0208)',
    shiftJisSection: 'Shift-JIS (SJIS 16進)',
    kutenSection: '区点コード (区-点)',
    utf8Bytes: 'UTF-8 バイト列',
    eucJpSection: 'EUC-JP',
    radical: '部首',
    strokes: '画数',
    readings: '読み (音/訓)',
    meaning: '字義',
    classification: '規格区分',
    kankenLabel: '漢検',
    jlptLabel: 'JLPT',
    gradeLabel: '配当学年',
    kankenHint: '日本漢字能力検定 (10級〜1級)',
    jlptHint: '日本語能力試験 (N5〜N1/古典)',
    gradeHint: '文部科学省・学年別漢字配当表 (小1〜小6・中学・表外)',
    navEducational: '学術・バッチ分析',
    navQuickWord: '単語即時変換',
    navLibrary: '字形学資料室',
    educationalTitle: '学術バッチ変換＆文字コード精密解析コンソール',
    educationalSubtitle: '新字体と旧字体・正字の対訳、1対多の文脈同音書き換え検出、および符号化コードを網羅的に解析',
    libraryTitle: '漢字字形学・同音書き換え（代用字）資料室',
    librarySubtitle: '当用漢字・常用漢字の制定と歴史的字形統合（混交・弁・芸・予・欠・缶・台など）の全解説',
    modeSingle: '単語・文 変換',
    modeBatch: 'バッチ一括変換 (1行1単語)',
    singleWordInputPlaceholder: '変換したい単語または漢字を入力（例：混交、弁護士、予定、国）',
    singleWordResult: '変換結果',
    singleWordQuickTitle: '特定の単語・漢字の即時変換',
    quickInputLabel: '対象の単語・漢字',
    charCol: '文字',
    typeCol: '区分',
    unicodeCol: 'Unicode',
    jisCol: 'JISコード',
    sjisCol: 'Shift-JIS',
    kutenCol: '区点コード',
    aboutTitle: '「混交」から「混淆」へ：同音の漢字による書きかえについて',
    aboutText: '当ツールは、1946年の当用漢字表および1956年の国語審議会「同音の漢字による書きかえ」報告に対応しています。例えば「混交」は本来「混淆」でしたが、当用漢字表外の「淆」が「交」に書き換えられた歴史的経緯があります。当ツールは熟語文脈を解析して適切な正字を提案します。',
    kakikaeNotice: '同音書き換え（代用漢字）の自動照合エンジン搭載',
    langName: '日本語',
  },

  en: {
    appName: 'KanjiForge',
    appSubtitle: 'Shinjitai & Kyūjitai Converter & Character Code Inspector',
    badgeScholar: 'Orthography & Encodings Analysis Tool',
    directionLabel: 'Conversion Direction',
    shinToKyu: 'Shinjitai → Kyūjitai (Modern to Classical/Traditional)',
    kyuToShin: 'Kyūjitai → Shinjitai (Classical/Traditional to Modern)',
    shinShort: 'Shinjitai (Modern)',
    kyuShort: 'Kyūjitai (Classical)',
    batchInputPlaceholder: 'Enter Kanji, compounds, or sentences (supports batch mode: one word per line)\nExample:\n混交\n弁護士\n弁償\n花弁\n予定\n芸術\n欠席\n缶詰\n台風',
    clearText: 'Clear',
    sampleButton: 'Load Sample',
    copyConverted: 'Copy Converted',
    copyTsv: 'Copy TSV (Source / Output)',
    copied: 'Copied!',
    exportCsv: 'Export CSV',
    fontSerif: 'Mincho (Serif)',
    fontSans: 'Gothic (Sans)',
    fontSizeLabel: 'Font Size',
    fontSizeSm: 'Small (14px)',
    fontSizeMd: 'Medium (16px)',
    fontSizeLg: 'Large (20px)',
    fontSizeXl: 'X-Large (26px)',
    linesCount: 'Lines',
    charsCount: 'Characters',
    convertedCount: 'Changed Kanji',
    ambiguityAlertsCount: '1-to-Many Alerts',
    tabBatch: 'Batch Conversion',
    tabDiff: 'Diff Inspector',
    tabInspector: 'Character Inspector',
    tabEncodings: 'Encoding Table',
    ambiguityTitle: '1-to-Many (Merged Characters & Substitutions) Alert',
    ambiguityBannerPrefix: '1-to-Many Ambiguity Branch Detected',
    ambiguityOneToManyNotice: 'In modern Shinjitai, a single character often merges multiple distinct classical Kyūjitai characters. The converter suggests the context-appropriate form or allows you to select manually.',
    contextApplied: 'Context Applied',
    resolveAmbiguity: 'Choose Variant',
    selectOption: 'Select Classical Variant',
    useRecommendedContext: 'Apply Recommended Context',
    nuanceExplanation: 'Nuance & Semantic Distinction',
    compoundExamples: 'Representative Compound Words',
    singleKanjiQuestion: 'An isolated ambiguous kanji was detected. Which meaning or variant do you intend?',
    inspectorTitle: 'Character & Encoding Inspector',
    inspectorSubtitle: 'Precise analysis of Unicode, JIS X 0208, Shift-JIS, and Kuten codes for input and output glyphs',
    clickCharToInspect: 'Click on any character in the text above to inspect its full encoding specifications.',
    inputGlyph: 'Input Character',
    outputGlyph: 'Output Character',
    unicodeSection: 'Unicode (Code Point)',
    jisSection: 'JIS Code (JIS X 0208)',
    shiftJisSection: 'Shift-JIS (SJIS Hex)',
    kutenSection: 'Kuten Code (Section-Point)',
    utf8Bytes: 'UTF-8 Bytes',
    eucJpSection: 'EUC-JP',
    radical: 'Radical',
    strokes: 'Strokes',
    readings: 'Readings (On / Kun)',
    meaning: 'Meaning',
    classification: 'Standard Level',
    kankenLabel: 'KANKEN',
    jlptLabel: 'JLPT',
    gradeLabel: 'Grade',
    kankenHint: 'Japan Kanji Aptitude Testing (10 Kyū to 1 Kyū)',
    jlptHint: 'Japanese-Language Proficiency Test (N5 to N1 / Classical)',
    gradeHint: 'Japanese MEXT Elementary/Secondary Curriculum Grade',
    navEducational: 'Educational Console',
    navQuickWord: 'Quick Word',
    navLibrary: 'Orthography Library',
    educationalTitle: 'Educational Batch Converter & Encoding Analysis Console',
    educationalSubtitle: 'Side-by-side Shinjitai & Kyūjitai parallel alignment, 1-to-many ambiguity detection, and deep encoding inspection',
    libraryTitle: 'Kanji Orthography & Homophone Substitutions (Kakikae) Library',
    librarySubtitle: 'Complete historical guide to Toyo/Joyo Kanji simplifications and 1-to-many mergers (混交, 弁, 芸, 予, 欠, etc.)',
    modeSingle: 'Single Word / Phrase',
    modeBatch: 'Batch Mode (One line per word)',
    singleWordInputPlaceholder: 'Enter a specific word or kanji to convert (e.g. 混交, 弁護士, 予定, 国)',
    singleWordResult: 'Converted Result',
    singleWordQuickTitle: 'Specific Word / Kanji Instant Conversion',
    quickInputLabel: 'Target Word / Kanji',
    charCol: 'Character',
    typeCol: 'Classification',
    unicodeCol: 'Unicode',
    jisCol: 'JIS Code',
    sjisCol: 'Shift-JIS',
    kutenCol: 'Kuten Code',
    aboutTitle: 'From "混交" to "混淆": Official Homophone Substitutions (Kakikae)',
    aboutText: 'This converter handles the 1956 Japanese Language Council "Kakikae" report. For instance, "混交" (mingling) historically derived from "混淆" where the classical kanji 淆 was substituted by 交. KanjiForge detects compound context and alerts you to 1-to-many nuances.',
    kakikaeNotice: 'Equipped with Contextual Homophone Substitution Engine',
    langName: 'English',
  },

  ar: {
    appName: 'KanjiForge',
    appSubtitle: 'محول كانجي الياباني (شينجيتاي ⟷ كيوجيتاي) ومحلل ترميز الحروف',
    badgeScholar: 'أداة أكاديمية لبحث الرسم والتشفير الياباني',
    directionLabel: 'اتجاه التحويل',
    shinToKyu: 'شينجيتاي ← كيوجيتاي (من الرسم الحديث إلى الكلاسيكي)',
    kyuToShin: 'كيوجيتاي ← شينجيتاي (من الكلاسيكي إلى الحديث المبسط)',
    shinShort: 'شينجيتاي (حديث)',
    kyuShort: 'كيوجيتاي (كلاسيكي)',
    batchInputPlaceholder: 'أدخل رموز الكانجي أو الكلمات المركبة أو النصوص (يدعم المعالجة المجمعة: كلمة أو سطر لكل سطر)\nأمثلة:\n混交\n弁護士\n弁償\n花弁\n予定\n芸術\n欠席\n缶詰\n台風',
    clearText: 'مسح',
    sampleButton: 'تحميل نموذج تجريبي',
    copyConverted: 'نسخ النص المحوَّل',
    copyTsv: 'نسخ بفاصل جدولة TSV (الأصل / المحوّل)',
    copied: 'تم النسخ بنجاح!',
    exportCsv: 'تصدير كملف CSV',
    fontSerif: 'خط مينشو (سيريف تقليدي)',
    fontSans: 'خط غوثيك (سانز حديث)',
    fontSizeLabel: 'حجم الخط',
    fontSizeSm: 'صغير (14)',
    fontSizeMd: 'متوسط (16)',
    fontSizeLg: 'كبير (20)',
    fontSizeXl: 'كبير جداً (26)',
    linesCount: 'الأسطر',
    charsCount: 'إجمالي المحارف',
    convertedCount: 'الكانجي المحوّل',
    ambiguityAlertsCount: 'تنبيهات غموض 1 إلى متعدد',
    tabBatch: 'التحويل المجمّع والمقابلة',
    tabDiff: 'إظهار الفروق (Diff)',
    tabInspector: 'تفاصيل ترميز الحرف',
    tabEncodings: 'جدول الرموز والترميزات',
    ambiguityTitle: 'تنبيه حالات (واحد إلى متعدد) والحروف المدمجة صوتياً',
    ambiguityBannerPrefix: 'تم اكتشاف حالة غموض وتشعب كلاسيكي',
    ambiguityOneToManyNotice: 'في الرسم الحديث الموحد، قد يدمج الحرف الواحد عدة أحرف كلاسيكية متباينة في المعنى. يقوم النظام باقتراح الحرف الملائم تلقائياً وفق سياق الكلمة المركبة، أو يتيح لك الاختيار يدوياً.',
    contextApplied: 'تم تطبيق السياق المناسب',
    resolveAmbiguity: 'اختيار الرسم المناسب',
    selectOption: 'اختر البديل الكلاسيكي',
    useRecommendedContext: 'تطبيق التوصية السياقية',
    nuanceExplanation: 'الفروق الدلالية والمعنوية',
    compoundExamples: 'أمثلة وكلمات مركبة شهيرة',
    singleKanjiQuestion: 'تم إدخال حرف كانجي منفرد متعدد المعاني. ما المعنى أو السياق الكلاسيكي المطلوب؟',
    inspectorTitle: 'محلل ترميز وخصائص الكانجي',
    inspectorSubtitle: 'تحليل دقيق لأكواد Unicode و JIS X 0208 و Shift-JIS و Kuten (القسم والنقطة) ومقارنة الرسمين',
    clickCharToInspect: 'اضغط على أي محرف في النص أعلاه لعرض مواصفات وتفاصيل ترميزه بدقة.',
    inputGlyph: 'حرف الإدخال',
    outputGlyph: 'حرف الإخراج',
    unicodeSection: 'يونيكود Unicode (نقطة الرمز)',
    jisSection: 'كود JIS القياسي (JIS X 0208)',
    shiftJisSection: 'تشفير شيفت جيس Shift-JIS (ست عشري)',
    kutenSection: 'كود القسم والنقطة Kuten (区-点)',
    utf8Bytes: 'بايتات UTF-8',
    eucJpSection: 'ترميز EUC-JP',
    radical: 'الجذر (部首)',
    strokes: 'عدد الضربات',
    readings: 'القراءات (أون / كون)',
    meaning: 'المعنى والدلالة',
    classification: 'مستوى المعيار القياسي',
    kankenLabel: 'كانكين',
    jlptLabel: 'JLPT',
    gradeLabel: 'الصف الدراسي',
    kankenHint: 'اختبار الكفاءة في الكانجي (من المستوى 10 إلى 1)',
    jlptHint: 'اختبار إتقان اللغة اليابانية للناطقين بغيرها (N5 إلى N1)',
    gradeHint: 'منهج وزارة التعليم اليابانية للتعليم الأساسي والثانوي',
    navEducational: 'المحلل الأكاديمي والمجمّع',
    navQuickWord: 'التحويل الفوري للكلمات',
    navLibrary: 'مكتبة الرسم الكلاسيكي',
    educationalTitle: 'وحدة التحليل الأكاديمي المجمّع وتشفير الحروف',
    educationalSubtitle: 'المقابلة المتوازية بين الشينجيتاي والكيوجيتاي، واكتشاف تشعبات الغموض الصوتي، وفحص الترميزات بدقة',
    libraryTitle: 'مكتبة الرسم المعجمي والاستبدالات الصوتية (Kakikae)',
    librarySubtitle: 'الدليل التاريخي الشامل لإصلاحات الكانجي وحالات دمج الحروف الكلاسيكية (混交، 弁، 芸، 予، 欠، إلخ)',
    modeSingle: 'تحويل كلمة أو عبارة محددة',
    modeBatch: 'التحويل المجمّع (سطر لكل كلمة)',
    singleWordInputPlaceholder: 'أدخل كلمة أو كانجي محدد للتحويل (مثال: 混交، 弁護士، 予定، 国)',
    singleWordResult: 'النتيجة بعد التحويل',
    singleWordQuickTitle: 'التحويل الفوري لكلمة محددة',
    quickInputLabel: 'الكلمة أو الكانجي المستهدف',
    charCol: 'الحرف',
    typeCol: 'التصنيف',
    unicodeCol: 'يونيكود (Unicode)',
    jisCol: 'كود JIS',
    sjisCol: 'Shift-JIS',
    kutenCol: 'كود Kuten (区点)',
    aboutTitle: 'من "混交" إلى "混淆": ظاهرة الاستبدال الصوتي في الإملاء الياباني',
    aboutText: 'يدعم هذا المحول مقررات إصلاحات 1946 و1956 للغة اليابانية. على سبيل المثال، كلمة "混交" (خلط/امتزاج) كُتبت تاريخياً "混淆"، حيث استُبدل الحرف القديم 淆 بالحرف الشائع 交. يقوم KanjiForge بتحليل سياق الكلمات وتنبيهك للاختلافات بدقة متناهية.',
    kakikaeNotice: 'مزود بمحرك استبدال سياقي ذكي للحروف المشتركة صوتياً',
    langName: 'العربية',
  },
};

/**
 * Detect language from navigator or storage
 */
export function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'ja';

  const stored = localStorage.getItem('kanji_applet_lang');
  if (stored && (stored === 'ja' || stored === 'en' || stored === 'ar')) {
    return stored;
  }

  const browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || '';
  const lower = browserLang.toLowerCase();

  if (lower.startsWith('ar')) return 'ar';
  if (lower.startsWith('ja')) return 'ja';
  return 'en';
}

export function saveLanguagePreference(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kanji_applet_lang', lang);
  }
}
