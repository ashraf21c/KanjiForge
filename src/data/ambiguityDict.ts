import { AmbiguityChoice } from '../types/kanji';

export interface AmbiguityDefinition {
  shinjitaiChar: string;
  defaultKyujitai: string;
  explanation: {
    ja: string;
    en: string;
    ar: string;
  };
  options: AmbiguityChoice[];
  // Mapping of modern compound words to their intended Kyūjitai/classical form
  compoundContexts: Record<string, string>;
}

/**
 * Registry of known 1-to-Many (一対多) ambiguity cases when converting from Shinjitai to Kyūjitai.
 * This includes the official "同音の漢字による書きかえ" (Kakikae substitutions) and historical character mergers.
 */
export const AMBIGUITY_DEFINITIONS: Record<string, AmbiguityDefinition> = {
  '交': {
    shinjitaiChar: '交',
    defaultKyujitai: '交',
    explanation: {
      ja: '現代語の「混交」は、古典・旧字体では「混淆」（入りまじる、乱雑に混ざる）の同音書き換えです。「交」単体では「交」のままですが、「混交」の場合は「混淆」への変換が推奨されます。',
      en: 'In modern Japanese, "混交" (mingling/confusion) is a simplification and homophone substitute for the classical "混淆". While isolated "交" remains "交" (traffic/exchange), in "混交" it should convert to "混淆".',
      ar: 'في اليابانية الحديثة، تعتبر كلمة "混交" (اختلاط/امتزاج) تبسيطاً واستبدالاً صوتياً للكلمة الكلاسيكية "混淆". بينما يظل الحرف المفرد "交" كما هو، في سياق "混交" ينبغي تحويله إلى "混淆".'
    },
    options: [
      {
        char: '淆',
        label: {
          ja: '淆 (混じる・乱れる)',
          en: '淆 (turbid / jumbled / mixed)',
          ar: '淆 (عكر / مشوش / مختلط)'
        },
        nuance: {
          ja: '「混淆」「雑淆」など、入り混じって乱れる意味で用いられます。現代常用漢字表による同音書き換えで「交」が使われるようになりました。',
          en: 'Used in contexts of confusion, blending, or muddying (e.g. 混淆, 雑淆). Modern orthography replaced it with 交.',
          ar: 'يُستخدم في سياق الاختلاط العشوائي أو التداخل (مثل 混淆). تم استبداله بـ 交 في العصر الحديث.'
        },
        examples: ['混淆', '雑淆'],
        isRecommendedContext: true,
      },
      {
        char: '交',
        label: {
          ja: '交 (交わる・交わす)',
          en: '交 (intersect / traffic / exchange)',
          ar: '交 (تقاطع / تبادل / تواصل)'
        },
        nuance: {
          ja: '「交通」「交流」「交渉」「交際」など、通常の行き交う・交差する意味。旧字体でも「交」のままです。',
          en: 'Standard character for interaction, traffic, exchange (e.g. 交通, 交流, 交渉). Same form in Kyūjitai.',
          ar: 'الحرف القياسي للتفاعل وحركة المرور والتبادل (مثل 交通 و 交流).'
        },
        examples: ['交通', '交流', '交渉', '交際', '外交'],
      }
    ],
    compoundContexts: {
      '混交': '混淆',
      '雑交': '雜淆',
      '淆乱': '淆亂',
      '交友': '交友',
      '交通': '交通',
      '交流': '交流',
      '交渉': '交渉',
      '交際': '交際',
      '外交': '外交',
    }
  },

  '弁': {
    shinjitaiChar: '弁',
    defaultKyujitai: '辯',
    explanation: {
      ja: '新字体の「弁」は、歴史的に「辨」（わきまえる・処理）、「瓣」（花びら・弁膜）、「辯」（言葉・議論）、「弁」（冠・かむり）という4つの全く異なる漢字を統合した最も代表的な一対多文字です。',
      en: 'The modern kanji "弁" merges 4 historically distinct classical characters: "辨" (distinguish/compensate), "瓣" (petal/valve), "辯" (speech/debate/dialect), and "弁" (cap/crown).',
      ar: 'يدمج كانجي "弁" الحديث أربعة أحرف كلاسيكية مختلفة تماماً في المعنى: "辨" (تمييز/تعويض)، "瓣" (بتلة زهرة/صمام)، "辯" (كلام/جدل/لهجة)، و "弁" (تاج/غطاء).'
    },
    options: [
      {
        char: '辯',
        label: {
          ja: '辯 (言葉・弁論・方言)',
          en: '辯 (speech / rhetoric / dialect)',
          ar: '辯 (كلام / مرافعة / لهجة)'
        },
        nuance: {
          ja: '言葉で語る、言い争う、申し開きする意味（弁護、弁論、弁舌、関西弁、答弁など）。',
          en: 'Related to speech, argumentation, debate, legal pleading, and regional dialect (弁護, 弁論, 関西弁).',
          ar: 'مرتبط بالكلام والمحاماة والجدل واللهجة المحلية (مثل 弁護 و 弁論).'
        },
        examples: ['弁護 (辯護)', '弁論 (辯論)', '弁舌 (辯舌)', '関西弁 (關西辯)', '答弁 (答辯)', '弁解 (辯解)']
      },
      {
        char: '辨',
        label: {
          ja: '辨 (分ける・わきまえる・処理)',
          en: '辨 (distinguish / compensate / manage)',
          ar: '辨 (تمييز / تعويض / تسوية)'
        },
        nuance: {
          ja: '物事を見分ける、償う、処理する意味（弁償、弁済、弁理士、勘弁、思弁など）。',
          en: 'Related to discerning, settling debts, compensation, or administration (弁償, 弁済, 弁理士, 勘弁).',
          ar: 'مرتبط بالتمييز والتعويض وتسوية الديون (مثل 弁償 و 弁済).'
        },
        examples: ['弁償 (辨償)', '弁済 (辨濟)', '弁理士 (辨理士)', '思弁 (思辨)', '勘弁 (勘辨)']
      },
      {
        char: '瓣',
        label: {
          ja: '瓣 (はなびら・弁膜・ウリの種)',
          en: '瓣 (petal / anatomical valve)',
          ar: '瓣 (بتلة زهرة / صمام قلبي أو ميكانيكي)'
        },
        nuance: {
          ja: '花びらや、開閉する膜・ふたの意味（花弁、弁膜、安全弁など）。',
          en: 'Flower petals or mechanical/anatomical valves (花弁, 弁膜, 安全弁).',
          ar: 'بتلات الأزهار أو الصمامات الميكانيكية/التشريحية (مثل 花弁 و 弁膜).'
        },
        examples: ['花弁 (花瓣)', '弁膜 (瓣膜)', '安全弁 (安全瓣)']
      },
      {
        char: '弁',
        label: {
          ja: '弁 (冠・かむり)',
          en: '弁 (cap / ritual headgear)',
          ar: '弁 (قبعة طقسية / تاج)'
        },
        nuance: {
          ja: '古代の頭巾や冠の意味（弁天、弁慶、弁服など）。',
          en: 'Ancient conical cap or ceremonial crown; also used in proper names (弁天, 弁慶).',
          ar: 'غطاء رأس طقسي قديم، ويظهر في بعض الأسماء (مثل 弁慶).'
        },
        examples: ['弁天', '弁慶', '弁服']
      }
    ],
    compoundContexts: {
      '弁護': '辯護',
      '弁護士': '辯護士',
      '弁論': '辯論',
      '弁舌': '辯舌',
      '答弁': '答辯',
      '抗弁': '抗辯',
      '雄弁': '雄辯',
      '関西弁': '關西辯',
      '大阪弁': '大阪辯',
      '弁解': '辯解',
      '弁償': '辨償',
      '弁済': '辨濟',
      '弁理': '辨理',
      '弁理士': '辨理士',
      '思弁': '思辨',
      '勘弁': '勘辨',
      '買弁': '買辨',
      '花弁': '花瓣',
      '弁膜': '瓣膜',
      '安全弁': '安全瓣',
      '合弁': '合瓣',
      '弁天': '弁天',
      '弁慶': '弁慶',
    }
  },

  '芸': {
    shinjitaiChar: '芸',
    defaultKyujitai: '藝',
    explanation: {
      ja: '「芸術」「芸能」の「芸」は、本来「藝」（木を植える・技芸）の略字です。しかし古典漢字には「芸」（ウン：香草・書庫）という全く別の文字が存在します。',
      en: 'The modern kanji "芸" in "芸術" (art) or "芸能" (entertainment) represents the classical "藝" (craft/art). However, a distinct ancient character "芸" (pronounced Un) exists for fragrant rue and classical archives.',
      ar: 'حرف "芸" في "فن" (芸術) أو "ترفيه" يمثل في الأصل الحرف الكلاسيكي "藝". لكن هناك حرف قديم منفصل "芸" (يُنطق Un) كان يعني عشبة عطرية أو مكتبة أرشيفية.'
    },
    options: [
      {
        char: '藝',
        label: {
          ja: '藝 (芸術・技芸・芸能)',
          en: '藝 (art / skill / performance)',
          ar: '藝 (فن / مهارة / أداء)'
        },
        nuance: {
          ja: '芸術、芸能、工芸、園芸など技術・才能を表す一般的な文字。',
          en: 'Standard classical form for art, performing arts, craftsmanship, gardening (藝術, 藝能).',
          ar: 'الشكل الكلاسيكي القياسي للفنون والحرف والمهارات المسرحية.'
        },
        examples: ['芸術 (藝術)', '芸能 (藝能)', '芸者 (藝者)', '文芸 (文藝)', '工芸 (工藝)', '園芸 (園藝)'],
        isRecommendedContext: true,
      },
      {
        char: '芸',
        label: {
          ja: '芸 (ウン：香草・書庫)',
          en: '芸 (fragrant rue / classical archive "un")',
          ar: '芸 (عشبة عطرية / خزانة كتب كلاسيكية)'
        },
        nuance: {
          ja: '古代の書庫「芸亭（うんてい）」や防虫香草「芸草」を指す特殊な文字。',
          en: 'Refers specifically to ancient herb or archive "Untei" (芸亭 - Japan\'s first private library).',
          ar: 'يشير تحديداً لمكتبة "أونتي" التاريخية أو عشبة حفظ الكتب.'
        },
        examples: ['芸亭 (うんてい)', '芸草', '芸閣']
      }
    ],
    compoundContexts: {
      '芸術': '藝術',
      '芸能': '藝能',
      '芸者': '藝者',
      '文芸': '文藝',
      '工芸': '工藝',
      '園芸': '園藝',
      '芸人': '藝人',
      '技芸': '技藝',
      '遊芸': '遊藝',
      '武芸': '武藝',
      '芸亭': '芸亭',
    }
  },

  '予': {
    shinjitaiChar: '予',
    defaultKyujitai: '豫',
    explanation: {
      ja: '「予定」「予約」の「予」は、旧字体では「豫」（あらかじめ・楽しむ・ためらう）です。一方で、古文の一人称代名詞「予」（我、余）は本来「予」と書きます。',
      en: 'In "予定" (schedule) or "予約" (reservation), "予" represents the classical "豫" (in advance / hesitate). However, the classical first-person pronoun "予" (I/me) is written natively as "予".',
      ar: 'في كلمات مثل "予定" (جدول) أو "予約" (حجز)، يمثل "予" الحرف الكلاسيكي "豫" (مقدماً). بينما ضمير المتكلم الكلاسيكي "予" (أنا) كُتب أصلاً بـ "予".'
    },
    options: [
      {
        char: '豫',
        label: {
          ja: '豫 (あらかじめ・ためらう)',
          en: '豫 (in advance / foresee / hesitation)',
          ar: '豫 (مسبقاً / توقع / تردد)'
        },
        nuance: {
          ja: '「予定」「予約」「予言」「予感」「予算」「予防」「猶予」など事前に備える意味。',
          en: 'Used in forecasting, reserving, planning, or hesitating (豫定, 豫約, 豫言, 猶豫).',
          ar: 'يُستخدم للتخطيط المسبق، الحجز، التنبؤ، أو التردد (مثل 豫定 و 豫約).'
        },
        examples: ['予定 (豫定)', '予約 (豫約)', '予言 (豫言)', '予算 (豫算)', '予感 (豫感)', '猶予 (猶豫)'],
        isRecommendedContext: true,
      },
      {
        char: '予',
        label: {
          ja: '予 (われ・私・与える)',
          en: '予 (first person pronoun "I" / bestow)',
          ar: '予 (ضمير المتكلم "أنا" كلاسيكياً / يمنح)'
        },
        nuance: {
          ja: '「予は〜」「予輩」など古典的な一人称、または「与」と同源の授ける意味。',
          en: 'Literary pronoun "I" or "we" (e.g. 予輩, 予輩の所見).',
          ar: 'ضمير المتكلم الأدبي "أنا" في النصوص التراثية.'
        },
        examples: ['予輩', '予等', '予が所見']
      }
    ],
    compoundContexts: {
      '予定': '豫定',
      '予約': '豫約',
      '予言': '豫言',
      '予感': '豫感',
      '予算': '豫算',
      '予防': '豫防',
      '予知': '豫知',
      '予備': '豫備',
      '猶予': '猶豫',
    }
  },

  '欠': {
    shinjitaiChar: '欠',
    defaultKyujitai: '缺',
    explanation: {
      ja: '「欠陥」「欠席」の「欠」は本来「缺」（かける・不足する）です。元来の「欠」は「あくび（欠伸）」を意味する象形文字です。',
      en: 'In "欠陥" (defect) or "欠席" (absence), "欠" represents the classical "缺" (lack/gap/defect). The original character "欠" depicted a yawning figure (as in 欠伸 - yawn).',
      ar: 'في كلمات مثل "欠陥" (عيب/نقص) أو "欠席" (غياب)، يمثل "欠" الحرف الكلاسيكي "缺" (نقص/خلل). بينما الحرف الأصلي "欠" كان يعني التثاؤب.'
    },
    options: [
      {
        char: '缺',
        label: {
          ja: '缺 (かける・不足・すきま)',
          en: '缺 (lack / flaw / vacancy)',
          ar: '缺 (نقص / عيب / فراغ)'
        },
        nuance: {
          ja: '欠陥、欠如、欠席、欠点、欠落など、欠けて足りない意味の旧字体。',
          en: 'Defects, absence, deficiency, or gaps (缺陷, 缺如, 缺席, 缺點).',
          ar: 'العيوب أو النقص أو الغياب أو الثغرات (مثل 缺陷 و 缺席).'
        },
        examples: ['欠陥 (缺陷)', '欠如 (缺如)', '欠席 (缺席)', '欠点 (缺點)', '出欠 (出缺)'],
        isRecommendedContext: true,
      },
      {
        char: '欠',
        label: {
          ja: '欠 (あくび・息を吸う)',
          en: '欠 (yawn / breath)',
          ar: '欠 (تثاؤب / شهيق)'
        },
        nuance: {
          ja: '「欠伸（あくび）」など、口を大きく開けて息をする意味。',
          en: 'Opening mouth widely / yawning (欠伸).',
          ar: 'فتح الفم على مصراعيه للتثاؤب (مثل 欠伸).'
        },
        examples: ['欠伸 (あくび)']
      }
    ],
    compoundContexts: {
      '欠陥': '缺陷',
      '欠如': '缺如',
      '欠席': '缺席',
      '欠点': '缺點',
      '欠損': '缺損',
      '出欠': '出缺',
      '不可欠': '不可缺',
      '欠伸': '欠伸',
    }
  },

  '余': {
    shinjitaiChar: '余',
    defaultKyujitai: '餘',
    explanation: {
      ja: '「余裕」「余計」の「余」は本来「餘」（あまる・残り）です。「余」自体は古典的一人称（余輩・余は…）として用いられます。',
      en: 'In "余裕" (surplus/leeway) or "余白" (margin), "余" stands for classical "餘" (remainder/excess). Isolated "余" historically represents the pronoun "I".',
      ar: 'في كلمات مثل "余裕" (فائض/سعة) أو "余白" (هامش)، يمثل "余" الحرف الكلاسيكي "餘" (فائض/بقية). بينما الحرف المفرد "余" يُستخدم كضمير "أنا".'
    },
    options: [
      {
        char: '餘',
        label: {
          ja: '餘 (あまる・残り・ゆとり)',
          en: '餘 (surplus / residue / leeway)',
          ar: '餘 (فائض / باقٍ / سعة)'
        },
        nuance: {
          ja: '余裕、余計、余白、余暇、余韻など、残りやゆとりの意味。',
          en: 'Surplus, margins, spare time, aftertaste (餘裕, 餘計, 餘白, 餘暇).',
          ar: 'الفائض، الهوامش، أوقات الفراغ، والأثر المتبقي.'
        },
        examples: ['余裕 (餘裕)', '余計 (餘計)', '余白 (餘白)', '余暇 (餘暇)', '余震 (餘震)'],
        isRecommendedContext: true,
      },
      {
        char: '余',
        label: {
          ja: '余 (われ・私)',
          en: '余 (first person pronoun "I")',
          ar: '余 (ضمير المتكلم "أنا" أدبياً)'
        },
        nuance: {
          ja: '夏目漱石の文体などに見られる「余は〜」「余輩」という一人称。',
          en: 'Literary pronoun "I" found in classical Japanese prose (余輩).',
          ar: 'ضمير المتكلم الكلاسيكي في الأدب الياباني.'
        },
        examples: ['余輩', '余等', '余が知る限り']
      }
    ],
    compoundContexts: {
      '余裕': '餘裕',
      '余計': '餘計',
      '余白': '餘白',
      '余暇': '餘暇',
      '余震': '餘震',
      '余生': '餘生',
      '余韻': '餘韻',
      '残余': '殘餘',
    }
  },

  '缶': {
    shinjitaiChar: '缶',
    defaultKyujitai: '罐',
    explanation: {
      ja: '「缶詰」「ドラム缶」の金属製容器は本来「罐」です。元来の「缶」は陶器の「かめ・ほとぎ」を表す象形文字です。',
      en: 'For metal tins and boilers ("缶詰" - canned food, "汽缶" - steam boiler), the classical character is "罐". The original character "缶" depicted an earthenware pot.',
      ar: 'للعلب المعدنية والغلايات ("缶詰" - معلبات)، الحرف الكلاسيكي هو "罐". الحرف الأصلي "缶" كان يعني جرة فخارية.'
    },
    options: [
      {
        char: '罐',
        label: {
          ja: '罐 (金属容器・かま・ボイラー)',
          en: '罐 (metal canister / tin / boiler)',
          ar: '罐 (علبة صفيح / مرجل)'
        },
        nuance: {
          ja: '缶詰、缶切り、汽缶（ボイラー）、ドラム缶など金属容器。',
          en: 'Metal cans, containers, steam boilers (罐詰, 汽罐).',
          ar: 'العلب المعدنية والمرجلات وحاويات الصفيح.'
        },
        examples: ['缶詰 (罐詰)', '汽缶 (汽罐)', '缶入り (罐入り)'],
        isRecommendedContext: true,
      },
      {
        char: '缶',
        label: {
          ja: '缶 (ほとぎ・土器・水甕)',
          en: '缶 (earthenware jar / water pot)',
          ar: '缶 (جرة فخارية / إناء طيني)'
        },
        nuance: {
          ja: '陶器の壺や打楽器（缶を叩いて歌う）を意味する原義。',
          en: 'Original meaning of an earthenware urn or ceramic vessel.',
          ar: 'المعنى الأصلي للجرة الخزفية أو الإناء الفخاري.'
        },
        examples: ['土缶', '缶器']
      }
    ],
    compoundContexts: {
      '缶詰': '罐詰',
      '汽缶': '汽罐',
      '缶切り': '罐切り',
      'ドラム缶': 'ドラム罐',
    }
  },

  '台': {
    shinjitaiChar: '台',
    defaultKyujitai: '臺',
    explanation: {
      ja: '「台」は「臺」（たかどの・うてな・舞台）、「颱」（たいふう・颱風）の同音統合文字です。',
      en: '"台" is a merger of classical "臺" (stage/elevated platform) and "颱" (typhoon in 颱風).',
      ar: 'يدمج "台" بين الحرف الكلاسيكي "臺" (منصة/مسرح) والحرف "颱" (إعصار في 颱風).'
    },
    options: [
      {
        char: '臺',
        label: {
          ja: '臺 (うてな・舞台・天文台)',
          en: '臺 (elevated platform / stage / observatory)',
          ar: '臺 (منصة / مسرح / مرصد)'
        },
        nuance: {
          ja: '舞台、天文台、台所、台湾など高い場所や台座を意味する文字。',
          en: 'Stage, observatory, kitchen pedestal, Taiwan (舞臺, 天文臺, 臺灣).',
          ar: 'المسرح، المرصد، قاعدة التثبيت، وتايوان (臺灣).'
        },
        examples: ['舞台 (舞臺)', '天文台 (天文臺)', '台湾 (臺灣)', '台所 (臺所)', '砲台 (砲臺)'],
        isRecommendedContext: true,
      },
      {
        char: '颱',
        label: {
          ja: '颱 (たいふう・烈風)',
          en: '颱 (typhoon / fierce sea gale)',
          ar: '颱 (إعصار بحري مداري)'
        },
        nuance: {
          ja: '「台風」の古典的表記「颱風」で用いられる激しい熱帯低気圧の文字。',
          en: 'Used specifically in "颱風" (classical spelling of typhoon).',
          ar: 'يُستخدم خصيصاً في التعبير الكلاسيكي عن الإعصار "颱風".'
        },
        examples: ['台風 (颱風)']
      },
      {
        char: '台',
        label: {
          ja: '台 (よろこぶ・助数詞)',
          en: '台 (counter for vehicles / rejoice)',
          ar: '台 (وحدة عد المركبات / يسر)'
        },
        nuance: {
          ja: '車などの助数詞（一台、二台）や古典的漢文語彙。',
          en: 'Counter for machines/vehicles (一台, 二台).',
          ar: 'أداة عد الآلات والسيارات.'
        },
        examples: ['一台', '二台']
      }
    ],
    compoundContexts: {
      '台風': '颱風',
      '舞台': '舞臺',
      '天文台': '天文臺',
      '台湾': '臺灣',
      '台所': '臺所',
      '砲台': '砲臺',
      '登台': '登臺',
    }
  },

  '糸': {
    shinjitaiChar: '糸',
    defaultKyujitai: '絲',
    explanation: {
      ja: '「生糸」「絹糸」「製糸」などの「糸」は、本来「絲」（細いより糸）と書かれていました。',
      en: 'In contexts of silk, raw yarn, or textiles ("生糸", "製糸"), classical orthography uses "絲" (fine threads).',
      ar: 'في سياق الحرير وخيوط النسيج ("生糸", "製糸")، يستخدم الرسم الكلاسيكي "絲" (خيوط دقيقة).'
    },
    options: [
      {
        char: '絲',
        label: {
          ja: '絲 (きぬ糸・より糸・弦)',
          en: '絲 (silk thread / stringed instrument)',
          ar: '絲 (خيط الحرير / وتر الآلات الموسيقية)'
        },
        nuance: {
          ja: '絹糸、生糸、製糸、弦楽器の弦（管弦・金石絲竹）など。',
          en: 'Raw silk, spinning, musical strings (生絲, 絹絲, 製絲, 絲竹).',
          ar: 'الحرير الخام، الغزل، وأوتار الآلات الموسيقية.'
        },
        examples: ['生糸 (生絲)', '絹糸 (絹絲)', '製糸 (製絲)', '蚕糸 (蠶絲)'],
        isRecommendedContext: true,
      },
      {
        char: '糸',
        label: {
          ja: '糸 (いと・部首名)',
          en: '糸 (thread / radical name)',
          ar: '糸 (خيط / اسم جذر الكانجي)'
        },
        nuance: {
          ja: '部首「いとへん」や一般的な糸。',
          en: 'General thread or the thread radical "itohen".',
          ar: 'الخيط العام أو اسم جذر الخيط.'
        },
        examples: ['毛糸', '釣り糸']
      }
    ],
    compoundContexts: {
      '生糸': '生絲',
      '絹糸': '絹絲',
      '製糸': '製絲',
      '蚕糸': '蠶絲',
      '紡糸': '紡絲',
    }
  },

  '灯': {
    shinjitaiChar: '灯',
    defaultKyujitai: '燈',
    explanation: {
      ja: '「電灯」「灯台」「灯火」の「灯」は、旧字体では「燈」（あかり・ともしび）です。',
      en: 'In words like "電灯" (electric light) or "灯台" (lighthouse), the classical kanji is "燈".',
      ar: 'في كلمات مثل "電灯" (مصباح كهربائي) أو "灯台" (منارة)، الكانجي الكلاسيكي هو "燈".'
    },
    options: [
      {
        char: '燈',
        label: {
          ja: '燈 (あかり・ともしび・ランプ)',
          en: '燈 (lamp / flame / lantern)',
          ar: '燈 (مصباح / قنديل / سراج)'
        },
        nuance: {
          ja: '電燈、燈臺、燈火、點燈、幻燈など明かりを灯す意味。',
          en: 'Electric lamps, lighthouses, illumination (電燈, 燈臺, 燈火).',
          ar: 'المصابيح الكهربائية، المنارات، والإنارة.'
        },
        examples: ['電灯 (電燈)', '灯台 (燈臺)', '点灯 (點燈)', '灯火 (燈火)'],
        isRecommendedContext: true,
      },
      {
        char: '灯',
        label: {
          ja: '灯 (とう：古字・俗字)',
          en: '灯 (classical variant or unit)',
          ar: '灯 (صيغة بديلة أو وحدة)'
        },
        nuance: {
          ja: '古来「燈」の略俗字として用いられた文字。',
          en: 'Historically a colloquial simplified variant of 燈.',
          ar: 'تاريخياً كان صيغة عامية مبسطة لـ 燈.'
        },
        examples: ['行灯 (あんどん)']
      }
    ],
    compoundContexts: {
      '電灯': '電燈',
      '灯台': '燈臺',
      '点灯': '點燈',
      '灯火': '燈火',
      '街灯': '街燈',
      '蛍光灯': '螢光燈',
    }
  },

  '扇': {
    shinjitaiChar: '扇',
    defaultKyujitai: '扇',
    explanation: {
      ja: '「扇動」の「扇」は、「煽」（あおる・そそのかす）の同音書き換えです。「扇動」は本来「煽動」と書きます。団扇や扇子は「扇」です。',
      en: 'In "扇動" (instigation/agitation), "扇" is a homophone substitution for "煽" (incite/fan flames). Originally written "煽動". Standard hand fans are "扇".',
      ar: 'في كلمة "扇動" (تحريض/إثارة فتنة)، فإن "扇" بديل صوتي لـ "煽" (إشعال الفتنة/تأجيج). كُتبت أصلاً "煽動". بينما المروحة اليدوية هي "扇".'
    },
    options: [
      {
        char: '煽',
        label: {
          ja: '煽 (あおる・おだてる・そそのかす)',
          en: '煽 (incite / fan the flames / agitate)',
          ar: '煽 (يؤجج / يحرض / يثير)'
        },
        nuance: {
          ja: '「煽動」「煽情」など、感情をあおり立てる意味の正字。',
          en: 'Used in agitation and instigation (煽動, 煽情).',
          ar: 'يُستخدم في التحريض وتأجيج العواطف والفتن.'
        },
        examples: ['扇動 (煽動)', '扇情 (煽情)'],
        isRecommendedContext: true,
      },
      {
        char: '扇',
        label: {
          ja: '扇 (おうぎ・うちわ)',
          en: '扇 (fan / folding fan)',
          ar: '扇 (مروحة يدوية)'
        },
        nuance: {
          ja: '扇子、団扇、扇風機など風を起こす道具。',
          en: 'Hand fans or electric fans (扇子, 団扇, 扇風機).',
          ar: 'المروحة اليدوية أو المروحة الكهربائية.'
        },
        examples: ['扇子', '団扇', '扇風機']
      }
    ],
    compoundContexts: {
      '扇動': '煽動',
      '扇情': '煽情',
      '扇風機': '扇風機',
      '扇子': '扇子',
    }
  },

  '竜': {
    shinjitaiChar: '竜',
    defaultKyujitai: '龍',
    explanation: {
      ja: '「竜」の旧字体は「龍」です。架空の神獣、恐竜、人名などで「龍」が広く用いられます。',
      en: 'The classical Kyūjitai form of "竜" is "龍" (dragon), widely used in mythology, dinosaurs, and personal names.',
      ar: 'الشكل الكلاسيكي لـ "竜" هو "龍" (تنين)، ويُستخدم بكثرة في الأساطير وأسماء الديناصورات وأعلام الأشخاص.'
    },
    options: [
      {
        char: '龍',
        label: {
          ja: '龍 (たつ・神獣・旧字体)',
          en: '龍 (mythical dragon / Kyūjitai)',
          ar: '龍 (التنين الأسطوري / الرسم الكلاسيكي)'
        },
        nuance: {
          ja: '旧字体、四神の青龍、坂本龍馬など。',
          en: 'Classical form, used in historical names like Ryoma Sakamoto (坂本龍馬).',
          ar: 'الصيغة الكلاسيكية وتظهر في أسماء تاريخية مثل ساكاموتو ريوما.'
        },
        examples: ['龍 (竜)', '恐竜 (恐龍)', '竜巻 (龍卷)', '坂本龍馬'],
        isRecommendedContext: true,
      },
      {
        char: '竜',
        label: {
          ja: '竜 (現代新字体)',
          en: '竜 (modern Shinjitai form)',
          ar: '竜 (الرسم الحديث المبسط)'
        },
        nuance: {
          ja: '1946年の当用漢字表で制定された新字体。',
          en: 'Modern simplified form enacted in the 1946 reform.',
          ar: 'الصيغة الحديثة المعتمدة في إصلاحات 1946.'
        },
        examples: ['竜', '竜頭蛇尾']
      }
    ],
    compoundContexts: {
      '恐竜': '恐龍',
      '竜巻': '龍卷',
      '竜王': '龍王',
      '昇竜': '昇龍',
      '白竜': '白龍',
    }
  },

  '斉': {
    shinjitaiChar: '斉',
    defaultKyujitai: '齊',
    explanation: {
      ja: '「一斉」の「斉」は本来「齊」（ひとしい・そろう）です。また苗字の「斉藤」では「齊藤」と「齋藤（斎藤）」の双方が存在します。',
      en: 'In "一斉" (simultaneous), "斉" represents "齊" (uniform/even). In surnames, "斉藤" may correspond to either "齊藤" or "齋藤".',
      ar: 'في كلمة "一斉" (في وقت واحد)، يمثل "斉" الحرف "齊" (متساوٍ/متناسق). وفي ألقاب العائلات، قد يتوافق "斉藤" مع "齊藤" أو "齋藤".'
    },
    options: [
      {
        char: '齊',
        label: {
          ja: '齊 (そろう・ひとしい・旧字体)',
          en: '齊 (equal / even / standard Kyūjitai)',
          ar: '齊 (متساوٍ / متناسق / الكانجي الكلاسيكي)'
        },
        nuance: {
          ja: '一斉、整斉などの正統旧字体。',
          en: 'Standard classical form for uniformity (一齊, 整齊).',
          ar: 'الشكل الكلاسيكي القياسي للتناسق والتساوي.'
        },
        examples: ['一斉 (一齊)', '斉唱 (齊唱)', '整斉 (整齊)', '齊藤'],
        isRecommendedContext: true,
      },
      {
        char: '齋',
        label: {
          ja: '齋 (ものいみ・斎戒・名字の齋藤)',
          en: '齋 (purification / fasting / Saito surname)',
          ar: '齋 (تطهر / صوم / لقب سايتو)'
        },
        nuance: {
          ja: '斎戒、書斎、または名字「齋藤」で用いられる旧字体。',
          en: 'Purification, study room, or the prestigious Saito surname (齋藤).',
          ar: 'التطهر، غرفة القراءة، أو لقب العائلة العريق سايتو.'
        },
        examples: ['齋藤', '書斎 (書齋)', '斎戒 (齋戒)']
      }
    ],
    compoundContexts: {
      '一斉': '一齊',
      '斉唱': '齊唱',
      '整斉': '整齊',
      '斉藤': '齊藤',
    }
  },

  '辺': {
    shinjitaiChar: '辺',
    defaultKyujitai: '邊',
    explanation: {
      ja: '「周辺」「海辺」の「辺」には、旧字体として「邊」と異体字「邉」があり、特に名字「渡辺」の旧字表記として有名です。',
      en: 'For "辺" (edge/vicinity), classical forms include "邊" and its popular variant "邉", famous in surnames like Watanabe (渡邊 / 渡邉).',
      ar: 'لكانجي "辺" (حافة/جوار)، توجد الصيغة الكلاسيكية "邊" والصيغة البديلة "邉"، المشهورة في ألقاب مثل واتانابي (渡邊 / 渡邉).'
    },
    options: [
      {
        char: '邊',
        label: {
          ja: '邊 (正統旧字体)',
          en: '邊 (standard Kyūjitai)',
          ar: '邊 (الرسم الكلاسيكي القياسي)'
        },
        nuance: {
          ja: '康熙字典の正字。周辺、海辺、渡邊など。',
          en: 'Standard orthodox character in Kangxi dictionary (周邊, 渡邊).',
          ar: 'الرسم القياسي المعتمد في قاموس كانغشي.'
        },
        examples: ['周辺 (周邊)', '海辺 (海邊)', '渡辺 (渡邊)'],
        isRecommendedContext: true,
      },
      {
        char: '邉',
        label: {
          ja: '邉 (旧字・人名異体字)',
          en: '邉 (traditional variant, common in names)',
          ar: '邉 (شكل تقليدي بديل شائع في الأسماء)'
        },
        nuance: {
          ja: '戸籍や人名（渡邉など）で広く用いられる異体字。',
          en: 'Extremely popular variant in family registers (渡邉).',
          ar: 'صيغة شائعة جداً في سجلات العائلات والألقاب.'
        },
        examples: ['渡邉', '田邉', '磯邉']
      }
    ],
    compoundContexts: {
      '周辺': '周邊',
      '海辺': '海邊',
      '近辺': '近邊',
      '身辺': '身邊',
      '渡辺': '渡邊',
    }
  }
};
