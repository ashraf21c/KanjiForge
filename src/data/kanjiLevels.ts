/**
 * Kanji Pedagogical Levels: KANKEN (漢検), JLPT, and Japanese School Grade (学年配当)
 */

export interface KanjiLevelData {
  kanken: string;        // e.g. "10級", "6級", "2級", "1級 (旧字)"
  jlpt: string;          // e.g. "N5", "N4", "N3", "N2", "N1", "N1+ (古典)"
  grade: string;         // e.g. "小1", "小2", "小3", "小4", "小5", "小6", "中学", "高校・人名", "旧字・古典"
  gradeNumber?: number | string; // 1..6, "中", "旧"
}

/**
 * Elementary School Grade 1 (小1 / Grade 1 - 80 characters)
 * KANKEN: 10級 | JLPT: N5 | Grade: 小1
 */
const GRADE_1_CHARS =
  '一右雨円王音下火花気九休玉金空月犬見五口校左三山子四糸字耳七車手十出女小上森人水正生青夕石赤千川先早草足村大男竹中虫町天田土二日入年白八百文本名木目夕立力林六';

/**
 * Elementary School Grade 2 (小2 / Grade 2 - 160 characters)
 * KANKEN: 9級 | JLPT: N5〜N4 | Grade: 小2
 */
const GRADE_2_CHARS =
  '引羽雲園遠何科夏家歌画回会海絵外角楽活間丸岩顔汽記帰弓牛魚京強教近兄形計元言原戸古午後語工公広交光考行高黄合谷国黒今才細作算止市矢姉思紙寺自時七室社弱首秋週春書少場色食心新親図数西声星晴切雪船線前組走多太体台地池知茶昼長鳥朝直通弟店点電刀冬当東答頭同道読内南肉馬買売麦半番父風分聞米歩母方北毎妹万明鳴毛門夜野友用曜来里理話';

/**
 * Elementary School Grade 3 (小3 / Grade 3 - 200 characters)
 * KANKEN: 8級 | JLPT: N4 | Grade: 小3
 */
const GRADE_3_CHARS =
  '悪安暗医委意育員飲運泳駅央横屋温化界開階寒感漢館岸起期客究急級宮球去橋業曲局銀区苦具君係軽血決研県庫湖向幸港号根祭皿仕死使始指歯詩次事持式実写者主守取酒受州拾終習集住重宿所暑助昭消商章勝乗植申身神真深進世整昔全相送想息速族他打対待代第題炭短談着注柱丁帳調追定庭笛鉄転都度投島湯等豆動童農波配倍箱畑発反坂板皮悲美鼻筆氷表秒病品負部服福物平返勉弁保枚毎面問役薬由油有遊予羊洋葉陽様落流旅両緑礼列練路和';

/**
 * Elementary School Grade 4 (小4 / Grade 4 - 202 characters)
 * KANKEN: 7級 | JLPT: N3 | Grade: 小4
 */
const GRADE_4_CHARS =
  '愛案以衣位囲胃印英栄塩億加果貨課芽改械害街各覚完官管関観願希季紀喜旗器機議求泣救給挙漁共協鏡競極訓軍郡径型景芸欠結建健験固功好候航康告差最菜材昨札刷殺察参散産残司史士氏試辞失借種周祝順初松笑唱焼照城縄臣信井清静席積折節説浅戦選然争倉巣束側続卒孫帯隊達単置仲貯兆庁兆腸低底停的典伝徒努灯堂働特得毒熱念敗梅博白飯飛必票標不夫付府副粉変便包法望牧末満未脈民無約勇要養浴利陸良料量輪類令冷例歴連老労録';

/**
 * Elementary School Grade 5 (小5 / Grade 5 - 193 characters)
 * KANKEN: 6級 | JLPT: N2〜N3 | Grade: 小5
 */
const GRADE_5_CHARS =
  '圧移因永営衛易益液演応往桜恩可仮価河過賀快解格確額刊幹慣眼基寄規技義逆久旧居許境均禁句群経潔件券険検限現減故個護効厚耕鉱構興講混査再災妻採際在財罪雑酸賛支志枝師資飼示似識質舎謝授修述術準序招承証条状常情織職制性政勢精製税責績接設舌絶銭祖素総造増像贈測属率損退貸態団断築張提程適敵統堂導銅徳独任燃能破犯判版比肥非備俵評貧布婦富武復複仏編弁保墓報豊防貿暴務夢迷綿輸余預容略留領';

/**
 * Elementary School Grade 6 (小6 / Grade 6 - 191 characters)
 * KANKEN: 5級 | JLPT: N2 | Grade: 小6
 */
const GRADE_6_CHARS =
  '異遺域宇映延沿我灰拡革閣割株干看簡危機揮貴疑吸供胸郷勤筋系敬警劇激穴絹権憲後厳己呼誤后孝皇紅降鋼刻穀骨困砂座済裁策冊蚕至私姿視詞誌磁射捨尺若樹収宗就衆従縦縮熟純処署諸除将傷障城蒸針仁垂推寸盛聖誠宣専泉洗染善奏窓創装層操蔵臓存尊宅担探誕暖段庁頂潮賃痛展討党糖届難乳認納脳派拝背肺俳班晩否批秘腹奮並陛閉片補暮宝訪亡忘棒枚幕密盟模訳郵優幼乱卵覧裏律臨朗論';

/**
 * Set lookups for rapid grade verification
 */
const GRADE_1_SET = new Set(Array.from(GRADE_1_CHARS));
const GRADE_2_SET = new Set(Array.from(GRADE_2_CHARS));
const GRADE_3_SET = new Set(Array.from(GRADE_3_CHARS));
const GRADE_4_SET = new Set(Array.from(GRADE_4_CHARS));
const GRADE_5_SET = new Set(Array.from(GRADE_5_CHARS));
const GRADE_6_SET = new Set(Array.from(GRADE_6_CHARS));

/**
 * Specific JLPT N5 characters
 */
const JLPT_N5_CHARS = new Set(
  Array.from(
    '一二三四五六七八九十百千万大小中上下左右月火水木金土日月年日友人名子子女目口手足耳校先生学本私何外国語英車駅川山電天白赤青雨花魚気円話聞読書食飲見入出休買間週前行半毎長'
  )
);

/**
 * Specific JLPT N4 characters
 */
const JLPT_N4_CHARS = new Set(
  Array.from(
    '会会社同事自社考思海多走歩待持立作使言知売買買送新古い朝昼夜夕方空天風雪音度色急強弱死医堂始終病体薬心首開閉集別借貸貸広運院春夏秋冬家町村店度力理走発計'
  )
);

/**
 * Explicit dictionary of famous Kyūjitai (Classical) characters
 */
const FAMOUS_KYUJITAI_MAP: Record<string, KanjiLevelData> = {
  // Classical equivalents
  '國': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '櫻': { kanken: '準1級 (人名・旧字)', jlpt: 'N1+ (古典)', grade: '旧字・人名', gradeNumber: '旧' },
  '體': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '氣': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '鐵': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '學': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '變': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '藝': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '辯': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '辨': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '瓣': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '罐': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '廳': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '舊': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '齒': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '畫': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '會': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '醫': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '惡': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '齊': { kanken: '準1級 (人名・旧字)', jlpt: 'N1+ (古典)', grade: '旧字・人名', gradeNumber: '旧' },
  '齋': { kanken: '準1級 (人名・旧字)', jlpt: 'N1+ (古典)', grade: '旧字・人名', gradeNumber: '旧' },
  '邊': { kanken: '準1級 (人名・旧字)', jlpt: 'N1+ (古典)', grade: '旧字・人名', gradeNumber: '旧' },
  '邉': { kanken: '準1級 (人名・旧字)', jlpt: 'N1+ (古典)', grade: '旧字・人名', gradeNumber: '旧' },
  '渡邊': { kanken: '準1級 (人名・旧字)', jlpt: 'N1+ (古典)', grade: '旧字・人名', gradeNumber: '旧' },
  '廣': { kanken: '準1級 (人名・旧字)', jlpt: 'N1+ (古典)', grade: '旧字・人名', gradeNumber: '旧' },
  '萬': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '壽': { kanken: '準1級 (人名・旧字)', jlpt: 'N1+ (古典)', grade: '旧字・人名', gradeNumber: '旧' },
  '禮': { kanken: '準1級 (人名・旧字)', jlpt: 'N1+ (古典)', grade: '旧字・人名', gradeNumber: '旧' },
  '圓': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '鹽': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '經': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '缺': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '豫': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '淆': { kanken: '1級 (表外)', jlpt: 'N1+ (古典)', grade: '表外字', gradeNumber: '表外' },
  '颱': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・表外', gradeNumber: '旧' },
  '龍': { kanken: '準1級 (人名・旧字)', jlpt: 'N1+ (古典)', grade: '旧字・人名', gradeNumber: '旧' },
  '臺': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '扇': { kanken: '準2級', jlpt: 'N1', grade: '中学', gradeNumber: '中' },
  '煽': { kanken: '準1級', jlpt: 'N1', grade: '高校・常用', gradeNumber: '高' },
  '餘': { kanken: '1級 (旧字)', jlpt: 'N1+ (古典)', grade: '旧字・古典', gradeNumber: '旧' },
  '鬱': { kanken: '準1級〜2級', jlpt: 'N1', grade: '常用・高校', gradeNumber: '高' },
};

/**
 * Retrieve comprehensive KANKEN, JLPT, and School Grade level for any kanji
 */
export function getKanjiLevel(char: string, isKyujitaiCandidate = false): KanjiLevelData {
  if (!char) {
    return { kanken: 'N/A', jlpt: 'N/A', grade: 'N/A' };
  }

  // 1. Direct hit in famous Kyūjitai/historical map
  if (FAMOUS_KYUJITAI_MAP[char]) {
    return FAMOUS_KYUJITAI_MAP[char];
  }

  // 2. Elementary School Grade 1 (小1)
  if (GRADE_1_SET.has(char)) {
    return {
      kanken: '10級 (小1)',
      jlpt: JLPT_N5_CHARS.has(char) ? 'N5' : 'N5〜N4',
      grade: '小1 (第1学年)',
      gradeNumber: 1,
    };
  }

  // 3. Elementary School Grade 2 (小2)
  if (GRADE_2_SET.has(char)) {
    return {
      kanken: '9級 (小2)',
      jlpt: JLPT_N5_CHARS.has(char) ? 'N5' : JLPT_N4_CHARS.has(char) ? 'N4' : 'N4〜N3',
      grade: '小2 (第2学年)',
      gradeNumber: 2,
    };
  }

  // 4. Elementary School Grade 3 (小3)
  if (GRADE_3_SET.has(char)) {
    return {
      kanken: '8級 (小3)',
      jlpt: JLPT_N4_CHARS.has(char) ? 'N4' : 'N3',
      grade: '小3 (第3学年)',
      gradeNumber: 3,
    };
  }

  // 5. Elementary School Grade 4 (小4)
  if (GRADE_4_SET.has(char)) {
    return {
      kanken: '7級 (小4)',
      jlpt: 'N3',
      grade: '小4 (第4学年)',
      gradeNumber: 4,
    };
  }

  // 6. Elementary School Grade 5 (小5)
  if (GRADE_5_SET.has(char)) {
    return {
      kanken: '6級 (小5)',
      jlpt: 'N2〜N3',
      grade: '小5 (第5学年)',
      gradeNumber: 5,
    };
  }

  // 7. Elementary School Grade 6 (小6)
  if (GRADE_6_SET.has(char)) {
    return {
      kanken: '5級 (小6)',
      jlpt: 'N2',
      grade: '小6 (第6学年)',
      gradeNumber: 6,
    };
  }

  // If flagged as Kyujitai candidate or has high code point/CJK compatibility
  if (isKyujitaiCandidate) {
    return {
      kanken: '1級 (旧字)',
      jlpt: 'N1+ (古典)',
      grade: '旧字・古典',
      gradeNumber: '旧',
    };
  }

  // Fallback for Secondary School / Joyo Kanji
  return {
    kanken: '3〜2級 (中学〜常用)',
    jlpt: 'N1〜N2',
    grade: '中学〜高校 (常用)',
    gradeNumber: '中',
  };
}
