GET /v1/kanji/{list}
Provides lists of kanji by category (see README for detailed information on which characters are in which list)
string[]
/v1/kanji/joyoList of Jōyō kanji
/v1/kanji/jouyouList of Jōyō kanji
/v1/kanji/jinmeiyoList of Jinmeiyō kanji
/v1/kanji/jinmeiyouList of Jinmeiyō kanji
/v1/kanji/heisigList of kanji which have a Heisig keyword
/v1/kanji/kyouikuList of all Kyōiku kanji
/v1/kanji/kyoikuList of all Kyōiku kanji
/v1/kanji/grade-1List of Grade 1 Kyōiku kanji
/v1/kanji/grade-2List of Grade 2 Kyōiku kanji
/v1/kanji/grade-3List of Grade 3 Kyōiku kanji
/v1/kanji/grade-4List of Grade 4 Kyōiku kanji
/v1/kanji/grade-5List of Grade 5 Kyōiku kanji
/v1/kanji/grade-6List of Grade 6 Kyōiku kanji
/v1/kanji/grade-8List of Jōyō kanji excluding Kyōiku kanji
/v1/kanji/jlpt-5List of JLPT N5 kanji
/v1/kanji/jlpt-4List of JLPT N4 kanji
/v1/kanji/jlpt-3List of JLPT N3 kanji
/v1/kanji/jlpt-2List of JLPT N2 kanji
/v1/kanji/jlpt-1List of JLPT N1 kanji
/v1/kanji/allList of all 13,000+ available kanji


GET /v1/kanji/{character}
Provides general information about the supplied kanji character
kanji
fieldtypedescription
"kanji":stringThe kanji itself
"kun_readings":string[]A list of kun readings associated with the kanji
"on_readings":string[]A list of on readings associated with the kanji
"name_readings":string[]A list of readings that are only used in names associated with the kanji
"meanings":string[]A list of English meanings associated with the kanji
"stroke_count":numberThe number of strokes necessary to write the kanji
"unicode":stringThe Unicode codepoint of the kanji
"grade":1..6 | 8 | 9 | nullThe official grade of the kanji (1-6 for Kyōiku kanji, 8 for the remaining Jōyō kanji, 9 for Jinmeiyō kanji)
"jlpt":1..4 | nullThe former JLPT test level for the kanji
"heisig_en":string | nullThe Heisig keyword associated with the kanji for English
"freq_mainichi_shinbun":number | nullA relative frequency ranking from an analysis of Mainichi Shinbun newspaper articles. The 2,501 most-used characters received a ranking (see the KANJIDIC project for more information)
"unihan_cjk_compatibility_variant":string | undefinedIf the kanji is a compatibility variant character, the unified version of the character (see README.md Jinmeiyo section for more information)
"notes":string[]Any notes about the kanji or its fields


GET /v1/reading/{reading}
Provides lists of kanji associated with the supplied reading
reading
fieldtypedescription
"reading":stringThe reading itself
"main_kanji":string[]A list of kanji that use the associated reading
"name_kanji":string[]A list of kanji that use the associated reading exclusively in names


GET /v1/words/{character}
Provides a list of dictionary entries associated with the supplied kanji character
word[]
word
fieldtypedescription
"meanings":meaning[]A list of distinct meanings that the entry has
"variants":variant[]A list of written variations for the entry
meaning
fieldtypedescription
"glosses":string[]A list of English equivalent terms for the particular meaning
variant
fieldtypedescription
"written":stringThe written form of the variant
"pronounced":stringThe pronounced form of the variant (in kana)
"priorities":string[]A list of strings designating frequency lists in which the variant appears