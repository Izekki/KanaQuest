# KanjiAPI.dev API Reference

This document provides a clean and structured reference for the [kanjiapi.dev](https://kanjiapi.dev) API endpoints used in the KanaQuest ingestion and enrichment processes.

---

## 1. Get Kanji List

Provides lists of kanji characters categorized by educational grade, JLPT level, or other groupings.

* **Endpoint:** `GET https://kanjiapi.dev/v1/kanji/{list_name}`
* **Response Type:** `string[]` (an array of kanji characters)

### Available Lists

| Category | Endpoint Path | Description |
| :--- | :--- | :--- |
| **Jōyō Kanji** | `/v1/kanji/joyo` or `/v1/kanji/jouyou` | List of all Jōyō kanji (commonly used characters). |
| **Jinmeiyō Kanji** | `/v1/kanji/jinmeiyo` or `/v1/kanji/jinmeiyou` | List of Jinmeiyō kanji (used in personal names). |
| **Kyōiku Kanji** | `/v1/kanji/kyoiku` or `/v1/kanji/kyouiku` | List of all Kyōiku kanji (taught in elementary school). |
| **Grade Lists** | `/v1/kanji/grade-1` to `/v1/kanji/grade-6` <br> `/v1/kanji/grade-8` | Grade 1-6 (Kyōiku kanji by school year) and Grade 8 (Jōyō kanji taught in junior high). |
| **JLPT Levels** | `/v1/kanji/jlpt-5` to `/v1/kanji/jlpt-1` | Kanji grouped by their former Japanese Language Proficiency Test levels (N5 to N1). |
| **Heisig** | `/v1/kanji/heisig` | Kanji characters that have an associated Heisig keyword. |
| **All Kanji** | `/v1/kanji/all` | List of all 13,000+ available kanji characters in the database. |

---

## 2. Get Kanji Details

Provides general information about a specific kanji character, including its readings, meanings, stroke count, and grade/JLPT level.

* **Endpoint:** `GET https://kanjiapi.dev/v1/kanji/{character}`
* **Response Type:** `Object`

### Response Fields

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `kanji` | `string` | The kanji character itself. |
| `kun_readings` | `string[]` | List of Kun'yomi (Japanese) readings associated with the kanji. |
| `on_readings` | `string[]` | List of On'yomi (Sino-Japanese) readings associated with the kanji. |
| `name_readings` | `string[]` | List of readings used exclusively in names. |
| `meanings` | `string[]` | List of English meanings associated with the kanji. |
| `stroke_count` | `number` | The number of strokes required to write the kanji. |
| `unicode` | `string` | The Unicode codepoint of the kanji character. |
| `grade` | `number \| null` | Official grade (1-6 for elementary, 8 for junior high, 9 for Jinmeiyō). |
| `jlpt` | `number \| null` | Former JLPT level (1 to 4, where 4 is the easiest/N5 equivalent). |
| `heisig_en` | `string \| null` | Heisig keyword associated with the kanji in English. |
| `freq_mainichi_shinbun` | `number \| null` | Frequency ranking based on Mainichi Shinbun newspaper occurrences (1 to 2501). |
| `unihan_cjk_compatibility_variant` | `string \| undefined` | Unified version of the character if it is a compatibility variant. |
| `notes` | `string[]` | Additional notes or caveats about the kanji character. |

### Example Response (`GET /v1/kanji/蛍`)

```json
{
  "kanji": "蛍",
  "kun_readings": ["ほたる"],
  "on_readings": ["ケイ"],
  "name_readings": [],
  "meanings": ["firefly"],
  "stroke_count": 11,
  "unicode": "86cd",
  "grade": 8,
  "jlpt": 1,
  "heisig_en": "firefly",
  "freq_mainichi_shinbun": 1785
}
```

---

## 3. Get Kanji by Reading

Provides a list of kanji associated with a specific reading (hiragana or katakana).

* **Endpoint:** `GET https://kanjiapi.dev/v1/reading/{reading}`
* **Response Type:** `Object`

### Response Fields

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `reading` | `string` | The query reading itself (e.g. "とう" or "ケイ"). |
| `main_kanji` | `string[]` | List of kanji characters that use this reading. |
| `name_kanji` | `string[]` | List of kanji characters that use this reading exclusively in names. |

### Example Response (`GET /v1/reading/ケイ`)

```json
{
  "reading": "ケイ",
  "main_kanji": ["計", "形", "径", "茎", "佳", "契", "恵", "慶", "慧", "憩", "掲", "携", "敬", "景", "渓", "系", "経", "継", "繋", "罫", "荊", "蛍", "軽", "鶏", "芸", "迎", "鯨", "頃", "傾", "刑", "啓", "契", "桂"],
  "name_kanji": []
}
```

---

## 4. Get Words for Kanji

Provides a list of dictionary entries/words associated with the supplied kanji character.

* **Endpoint:** `GET https://kanjiapi.dev/v1/words/{character}`
* **Response Type:** `Object[]` (an array of word objects)

### Response Structures

#### `Word` Object

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `meanings` | `Meaning[]` | List of distinct meanings that the word has. |
| `variants` | `Variant[]` | List of written variations (kanji/kana combinations) for the entry. |

#### `Meaning` Object

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `glosses` | `string[]` | List of English equivalent terms or definitions for this meaning. |

#### `Variant` Object

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `written` | `string` | The written form of the variant (contains kanji). |
| `pronounced` | `string` | The pronunciation of the variant in kana. |
| `priorities` | `string[]` | Frequency lists where the variant appears (e.g. `news1`, `ichi1`). |

### Example Response (`GET /v1/words/蛍`)

```json
[
  {
    "meanings": [
      {
        "glosses": [
          "firefly (Coleoptera: Lampyridae)"
        ]
      }
    ],
    "variants": [
      {
        "written": "蛍",
        "pronounced": "ほたる",
        "priorities": ["ichi1", "news1"]
      },
      {
        "written": "螢",
        "pronounced": "ほたる",
        "priorities": []
      }
    ]
  }
]
```