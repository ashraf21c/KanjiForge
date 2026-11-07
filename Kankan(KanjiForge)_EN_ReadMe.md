## 漢換 (Kankan) — KanjiForge // README (English)
**漢換 (Kankan) — KanjiForge:** A bidirectional Shinjitai–Kyūjitai converter with full Unicode, JIS, Shift-JIS, and Kuten code inspection.
### Overview
**KanjiForge** is a Japanese Kanji converter and character-code analyzer that converts bidirectionally between **新字体 (Shinjitai)** and **旧字体 (Kyūjitai)**, with full exposure of Unicode, JIS, Shift-JIS, and Kuten encodings, and trilingual support (Japanese, English, Arabic) with RTL.

### 1. Bidirectional Orthographic Converter (新字体 ⟷ 旧字体)
- Converts both Shinjitai → Kyūjitai and Kyūjitai → Shinjitai.
- Covers official **Jōyō Kanji** simplifications, **Jinmeiyō**, **Hyōgai**, and classical **Kangxi dictionary** forms.

### 2. Context-Aware "One-to-Many" (一対多) Ambiguity Engine
- **Contextual Compound Matcher**: Automatically recognizes historical homophone substitutions (同音の漢字による書きかえ), e.g.:
  - 混交 ➔ 混淆 (whereas 交通 stays 交通)
  - 弁護 ➔ 辯護, 弁償 ➔ 辨償, 花弁 ➔ 花瓣
  - 予定 ➔ 豫定 vs first-person pronoun 予
  - 芸術 ➔ 藝術 vs botanical/archive 芸
  - 欠如 ➔ 缺如 vs 欠伸
  - 缶詰 ➔ 罐詰, 台風 ➔ 颱風, 扇動 ➔ 煽動, 恐竜 ➔ 恐龍
- **Interactive Disambiguation**: When an ambiguous character appears alone or without an unambiguous compound, an alert banner and interactive modal explain semantic nuances and readings so the user can select the intended variant.

### 3. Complete Character Encoding Inspector
For every input and output Kanji:
- **Unicode**: code point (U+6E26), decimal, UTF-8, UTF-16
- **JIS X 0208** (hex, e.g. 0x3021)
- **Shift-JIS** (e.g. 0x889F)
- **Kuten (区点コード)** (e.g. 16区01点 / 16-01)
- **EUC-JP**
- **Metadata**: radical (部首), stroke count (画数), On/Kun readings, meanings
- One-click copy buttons for every encoding format with visual feedback.

### 4. Batch Processing & Multiple View Modes
- Line-by-line batch support (one word or sentence per line).
- **Batch Side-by-Side View**: dual columns with line counters, change indicators, and clickable character inspection.
- **Diff Inspector**: inline highlighting of transformed glyphs.
- **Encoding Table**: searchable, filterable list of all unique Kanji in the text with all encodings.
- **Export**: copy converted text, copy TSV (Original \t Converted), export CSV.
- **Sample Presets**: ambiguity cases, Jōyō classics, surnames/toponyms, classical literature.

### 5. Trilingual UI (Japanese, English, Arabic)
- **Auto-Language Detection** of browser locale (ja / ar / en default) with manual choice persisted in localStorage.
- **Manual Language Switcher** between 日本語, English, and العربية.
- **Arabic RTL Support** (`dir="rtl"`, IBM Plex Sans Arabic) while keeping Kanji, hex codes, and data tables readable in LTR.
- **Typography Switcher**: Mincho (Serif) / Gothic (Sans).

### 6. Three App Pages
1. **🎓 Educational Console (学術・バッチ分析)** — default page:
   - Dual-pane parallel workspace (input left, output right, multi-line batch).
   - Quick presets: 1-to-Many & Substitutions, Standard Joyo Pairs, Surnames & Toponyms, Classical Literature (I Am a Cat).
   - 1-to-Many ambiguity alert cards with interactive disambiguation modals.
   - **4 analysis tabs**: Batch Conversion, Diff Inspector, Character Inspector, Encoding Table.
   - Historical guide: "From 混交 to 混淆: Official Homophone Substitutions (Kakikae)".
2. **⚡ Quick Word Converter (単語即時変換)** — real-time single-word conversion, quick-word chips, detailed encoding cards, and an "Open in Educational Console" button.
3. **📚 Orthography Library (字形学資料室)** — scholarly reference on the 1946 Toyō Kanji reform and the 1956 Kokugo Shingikai Kakikae report, with a full catalog of classical 1-to-many mergers (混交 ↔ 混淆, 弁 ↔ 辨/瓣/辯, 芸 ↔ 藝/芸, 予 ↔ 豫/予, 欠 ↔ 缺/欠, 余 ↔ 餘/余, 缶 ↔ 罐/缶, 台 ↔ 臺/颱, 糸 ↔ 絲, 灯 ↔ 燈, 竜 ↔ 龍, 斉 ↔ 齊/齋, 辺 ↔ 邊/邉) and a "Test in Console" button.

### 7. Character Size Control (小・中・大・特大)
- **Japanese-style segmented control**:
  - 小 (14px) — compact view for dense data
  - 中 (16px) — default comfortable size
  - 大 (20px) — for inspecting complex stroke structures
  - 特大 (26px) — for intricate high-stroke classical characters (變, 罐, 廳, 舊, 鬱, 體, 齋, 櫻)
- Available in the **top navigation bar**, the **Educational Console toolbar**, and the **Quick Word Converter header**.
- Dynamically scales input areas, output text, table cells, and Diff tokens.
- Preference persisted in localStorage.

### 8. KANKEN, JLPT, and School Grade Levels
- **漢検 (KANKEN)**: 10級 (elementary 1) through 2級 (Jōyō completion) to 準1級 and 1級 (Kyūjitai, classical, and Jōyō-external variants).
- **JLPT**: N5 through N1, with N1+ (古典) for classical and historical Kyūjitai.
- **学年 (School Grade)**: 小1〜小6, 中学, 高校・一般 / 人名, 旧字・古典.
- Rendered as dedicated badges beside 音読み / 訓読み / 字義 in the Character Inspector, Quick Word Converter, and Encoding Table (with search filtering such as N5, 10級, or 小2), and in the ambiguity resolver and Orthography Library.

### 9. Multi-Kanji Support (up to 4 Kanji)
- **All Changed Kanjis View (全文字を一括表示)**: comparison blocks for every changed pair (up to 4 pairs) with Unicode, JIS X 0208, Shift-JIS, Kuten, EUC-JP, UTF-8, 漢検, JLPT, grade, On/Kun, and meanings.
- **Distinct highlight colors per position**:
  - ① Amber / 琥珀
  - ② Sky Blue / 浅葱・藍
  - ③ Emerald Green / 萌黄・翡翠
  - ④ Purple / 紫苑・藤
- **Quick Jump Filter Pills** between pairs or single-card focus.
- Updated presets include 二字熟語 (継体, 混交, 経歴), 三字熟語 (弁護士, 図書館, 体育館), 四字熟語 (絶体絶命, 臨機応変, 国士無双, 独立独歩, 質実剛健).
- **Fix**: the detailed inspector now targets the converted character (`changedIndices[0]`) with manual switching by clicking, showing 交 ➔ 淆 instead of repeating 混.

### 10. Accessibility (WCAG 2.2 AA/AAA & JIS X 8341-3)
**Japanese-specific:**
- **UD High-Legibility Font (UDゴシック)**: three-way selector (明朝体・ゴシック体・UDゴシック) using BIZ UDPGothic, Hiragino Sans, and Meiryo.
- **Furigana / Ruby** (`<ruby><rt>...</rt></ruby>`) optional above kanji in Quick Word Converter and Educational Console.
- **Japanese Text-to-Speech (TTS)** via Web Speech API (ja-JP) with no network or API keys, playback buttons beside input, output, and cards, and speeds 0.8x / 1.0x / 1.2x.

**International standards:**
- **High Contrast Mode** (AAA) for low-vision users.
- **Screen Reader Live Announcements** via `aria-live="polite"` for results, tab switches, and font changes.
- **Skip to Main Content link** (`#main-content`).
- **Visible Focus Rings** (`:focus-visible`) in amber.
- **Reduced Motion Support** via in-app toggle and `prefers-reduced-motion`.

**Accessibility Center (Alt + A):**
- Alt + A: open/close settings
- Alt + 1 / 2 / 3: switch pages
- Alt + S: cycle kanji size (小 ➔ 中 ➔ 大 ➔ 特大)
- Alt + C: toggle high contrast
- Esc: close active modal

### 11. Dark/Light Theme & Font Switcher
- Dark/Light toggle, Mincho/Gothic, and UD Gothic in the navigation bar.

### 12. Code Integrity
- `tsc --noEmit`: 0 errors, 0 warnings.
- `Vite build`: clean build.
- Dev server running on port 3000.
- All files intact: App.tsx, EducationalConsole.tsx, QuickWordConverter.tsx, OrthographyLibrary.tsx, CharacterInspector.tsx, EncodingTable.tsx, AmbiguityModal.tsx, encodingService.ts, converterService.ts, ambiguityDict.ts, kanjiDict.ts, kanjiLevels.ts, translations.ts, index.html, metadata.json.