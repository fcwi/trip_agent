/**
 * ============================================================================
 * 行程資料檔案 (Trip Data Only) - 2027 東北／森吉（阿仁）樹冰五日
 * ============================================================================
 *
 * 可樂森吉樹冰團（阿仁／森吉），不是藏王樹冰。
 * 日序以手冊 v11／Top5 B 為準。未擴充 schema。
 *
 * 結構、主題與 `theme.componentStyles` 自 `src/tripdata_2026_karuizawa.jsx`
 * 整檔複製；僅替換旅程內容。
 *
 * 【匯出項目】
 * - `guidesData`      : 行前指南與購票流程
 * - `usefulLinks`     : 分類的參考連結 (交通、天氣、購物、緊急...)
 * - `shopGuideData`   : 各區域商店與購物建議
 * - `itineraryData`   : 每日行程與事件列表
 * - `tripConfig`      : 全域設定 (標題、日期、飯店、主題等)
 * - `checklistData`   : 行前檢查清單 (可用於 todo / checkbox UI)
 *
 * 【修改指南】
 * 若要改為其他行程，請依序調整以下內容：
 * 1. 修改 tripConfig 中的基本資訊 (標題、日期、飯店名稱、地點等)
 * 2. 更新 itineraryData 中的每日行程 (日期、地點、事件時間、交通)
 * 3. 替換 shopGuideData 中的景點與商店資訊
 * 4. 新增/刪除 usefulLinks 中的相關連結
 * 5. 根據新行程調整 guidesData 中的實用指南
 * 6. 更新 checklistData 中的行前檢查項目
 *
 * ============================================================================
 */

import React from "react";
import {
  Train,
  MapPin,
  Utensils,
  Hotel,
  Snowflake,
  ShoppingBag,
  Star,
  Camera,
  QrCode,
  Shield,
  AlertCircle,
  CloudSnow,
  Sun,
  Briefcase,
  Map,
} from "lucide-react";

// ============================================================================
// 1. 指南資料 (Guides)
// ============================================================================
//
// 旅行前的實用指南與購票/入場流程說明，僅為參考。
//
// 【資料結構】
// {
//   title         : 指南標題
//   icon          : Lucide React 圖示
//   summary       : 簡短說明
//   steps         : 步驟陣列 (循序說明)
//   link          : { text: "連結文字", url: "網址" }
//   blogs         : 相關部落格連結陣列
// }
//
export const guidesData = [
  {
    title: "商品頁／團號（tourRef）",
    icon: <Map className="w-5 h-5" />,
    summary:
      "可樂森吉樹冰五日（阿仁／森吉），不是藏王。航班、飯店落點以商品頁／v11 為準，未核對前一律當待查。",
    steps: [
      "商品頁：易遊網代售可樂旅遊「東北雪舞紛飛～森吉山樹冰五日」（243740）。團號／出發日待核 v11。",
      "核對去程 JX862、回程 JX863 的實際起飛／抵達與集合時間（商品頁部分出發日可能是他航）。",
      "日序以手冊 v11／Top5 B 為準：D1 天童／上山、D2 銀山→木戶→角館（無樹冰）、D3 阿仁／森吉樹冰＋內陸線、D4 草莓→猊鼻溪→仙台、D5 松島（可刪）→烤魚板／AEON→空港。",
      "核對住宿落點：手冊僅列天童／上山與內陸溫泉候選，未保證入住。",
      "將確認後的團號、領隊聯絡與集合地點補進本檔 notes／desc。",
    ],
    link: {
      text: "易遊網｜可樂旅遊 森吉山樹冰五日（243740）",
      url: "https://vacation.eztravel.com.tw/pkgfrn/p/VDR0000001838/243740",
    },
    blogs: [
      {
        title: "可樂旅遊商品頁（PatternNo=243740）",
        url: "https://tour.colatour.com.tw/itinerary?PatternNo=243740",
      },
    ],
  },
  {
    title: "Visit Japan Web 入境申報",
    icon: <QrCode className="w-5 h-5" />,
    summary: "入境必備，節省通關時間。",
    steps: [
      "出發前一週：註冊帳號並登入 Visit Japan Web。",
      "登錄本人資料 (掃描護照) 與同行家人資料。",
      "登錄『入境、回國預定』(填寫航班 JX862／JX863、住宿先填候選飯店)。",
      "完成『入境審查』與『海關申報』的資料填寫。",
      "產生 QR Code (建議截圖保存)，抵達仙台空港時出示掃描。",
    ],
    link: {
      text: "開始申報 (官方)",
      url: "https://vjw-lp.digital.go.jp/zh-hant/",
    },
    blogs: [
      {
        title: "DJB｜2025 日本入境快速通關 Visit Japan Web 教學",
        url: "https://djbcard.com/visitjapanweb/",
      },
      {
        title: "樂吃購！日本｜2025 最新 Visit Japan Web 填寫全攻略",
        url: "https://www.letsgojp.com/archives/535150/",
      },
    ],
  },
  {
    title: "退稅新制（2026/11 起先付後退）",
    icon: <ShoppingBag className="w-5 h-5" />,
    summary:
      "2027 年 1 月已適用新制：店內先付含稅價，出境在機場完成持出確認後才退稅。待查各店實際機台與退款方式。",
    steps: [
      "店內結帳先付含稅價，出示護照並登錄退款方式（卡／帳戶等）。",
      "同一店舖一日未稅滿 5,000 日圓才符合門檻；消耗品特殊包裝已廢止。",
      "購買日起 90 日內須出境並完成海關持出確認，同一張單有缺件可能整張不退。",
      "仙台空港請在託運行李前找免稅手續端末／KIOSK 刷護照。綠燈可走、紅燈改人工。",
      "預留時間：團體回程過關＋退稅＋託運容易塞，不要卡最後一刻。",
      "待查：仙台空港退稅機台位置、現金退稅是否仍提供、團進團出能否離隊辦手續。",
    ],
    link: {
      text: "觀光廳｜新免稅制度（官方）",
      url: "https://www.mlit.go.jp/kankocho/tax-free/",
    },
    blogs: [
      {
        title: "TTJ｜2026 日本免稅新制：出境退稅與 90 天期限",
        url: "https://teamtaiwan.jp/shopping/japan-tax-free-refund-system-2026",
      },
    ],
  },
  {
    title: "東北冬季踩雷",
    icon: <AlertCircle className="w-5 h-5" />,
    summary: "樹冰、纜車、遊船都看天氣。行程順序旅行社可對調，心態先放寬。",
    steps: [
      "樹冰只在 D3 阿仁／森吉：未形成、吹白、纜車停駛都可能發生，不保證「完美雪怪照」。D2 沒有樹冰。",
      "阿仁ゴンドラ時段由現場／預約中心安排，無法指定。商品頁常見：纜車停駛退約 2,000 日圓／人，雪上活動取消退約 500 日圓／人（金額待核 v11）。",
      "銀山溫泉街路滑、巷窄、人多，雪地勿奔跑；夜間瓦斯燈好拍但更滑。",
      "猊鼻溪若結冰／強風可能停船，改室內或縮時；遊船務必聽船夫指示。",
      "秋田內陸線（阿仁和⇄松葉）班次少；自由活動不要自己去趕末班。停駛時商品頁常見退約 1,000 日圓／人（待核）。",
      "溫泉大浴場：先洗再泡、毛巾不下水、刺青通常禁止、醉酒／空腹勿長泡。",
      "踩雷購物：免稅店停留短、團購價未必最便宜；藥妝先比 AEON／仙台市區。",
    ],
    link: {
      text: "森吉山阿仁スキー場／ゴンドラ（官方）",
      url: "https://www.aniski.jp/",
    },
    blogs: [],
  },
  {
    title: "防寒：東北一月比想像中冷",
    icon: <Snowflake className="w-5 h-5" />,
    summary: "阿仁／森吉山頂與銀山夜間常在零下。洋蔥式穿搭，防水比「好看」重要。",
    steps: [
      "內層快乾、中層刷毛／羽絨、外層防水防風；不要只靠一件厚外套。",
      "雪靴或防滑鞋底必備，出發前噴防水劑；阿仁雪場／銀山路面結冰很常見。",
      "手套、圍巾、毛帽、暖暖包（貼式＋手持）各備一份可替換。",
      "護唇膏、乳液、眼藥水：車上暖氣很乾，下山更容易乾裂。",
      "備用襪與塑膠袋：濕鞋／濕襪立刻換，避免整天冰腳。",
      "待查：團體是否提供雪靴租借、纜車室內是否夠暖、小孩尺寸是否需自備。",
    ],
    link: {
      text: "仙台天氣（Tenki.jp）",
      url: "https://tenki.jp/forecast/5/18/3410/4100/",
    },
    blogs: [],
  },
  {
    title: "開心優先",
    icon: <Star className="w-5 h-5" />,
    summary:
      "v11：這趟是跟團看雪，不是打卡競賽。樹冰只在 D3；松島可刪。身體暖、肚子飽、心情好，就算成功。",
    steps: [
      "樹冰只排 D3 阿仁／森吉。D2 是銀山＋木戶搗麻糬＋角館，沒有纜車、沒有樹冰，不要當天追雪怪。",
      "D5 松島是可刪行程：被砍就改 AEON／空港多一點時間，當日風景就是當日風景。",
      "照片隨緣：樹冰、銀山、松島都可能起霧或未成形；能上山、能搗到麻糬就算一筆。",
      "排隊與車上時間會比自由行長，帶零食、充電、小娛樂比趕下一張網美照重要。",
      "想離隊購物或泡湯，先問領隊；團進團出，安全優先。用餐先吃飽再挑刺。",
    ],
    link: {
      text: "JNTO 東北觀光資訊",
      url: "https://www.japan.travel/zh-Hant/destinations/tohoku/",
    },
    blogs: [],
  },
  {
    title: "扭蛋規則",
    icon: <Camera className="w-5 h-5" />,
    summary:
      "v11 限時規則：主窗口在 D5 AEON 名取。每人 2–3 顆、互相交換，時間不夠就扭蛋 vs LOFT 二選一。",
    steps: [
      "限時窗：只在 D5 AEON 名取、領隊宣布的停留時段內扭。沿路銀山／角館／空港不要邊走邊扭。",
      "每人上限 2–3 顆膠囊，用完就停；不要為了「最後一顆」再去換鈔。",
      "重複角色與同行互相交換，不追加預算、不借別人零錢。",
      "時間不夠：AEON 扭蛋 vs LOFT 文具／雜貨二選一，不要兩頭都衝。",
      "硬幣先換成 100／500；預留回空港退稅＋報到，扭蛋不要吃掉託運前緩衝。",
    ],
    link: {
      text: "AEON Mall 名取樓層／營業時間",
      url: "https://natori-aeonmall.com/",
    },
    blogs: [],
  },
  {
    title: "出發前待查清單",
    icon: <Briefcase className="w-5 h-5" />,
    summary: "以下項目尚未鎖定，請在說明會後回填本檔。",
    steps: [
      "商品頁／v11 團號、領隊姓名與緊急手機。",
      "JX862／JX863 實際時刻、航廈、托運額度與集合地。",
      "四晚住宿正確店名、房型（兩小床／溫泉）、是否有三人房。",
      "每日下車點停留時間、自費項目與餐食（或代金）金額。",
      "阿仁ゴンドラ／雪上活動、猊鼻溪遊船、內陸線（阿仁和⇄松葉）是否保證成行與退費規則。",
      "小費、保險、eSIM／漫遊由誰準備。",
    ],
    link: {
      text: "星宇航空行李規定（官方）",
      url: "https://www.starlux-airlines.com/zh-TW/check-in-fly/baggage-information/general",
    },
    blogs: [],
  },
];

// ============================================================================
// 2. 參考連結 (Useful links)
// ============================================================================
//
// 將常用網站分類整理，方便快速查詢。
//
// 【資料結構】
// {
//   category   : 連結分類名稱 (交通、天氣、購物、緊急等)
//   items      : 連結項目陣列
// }
//
export const usefulLinks = [
  {
    category: "交通與工具",
    items: [
      {
        title: "Visit Japan Web",
        desc: "入境申報必填 (官方)",
        url: "https://vjw-lp.digital.go.jp/zh-hant/",
        icon: <QrCode className="w-5 h-5" />,
      },
      {
        title: "乘換案內 (Jorudan)",
        desc: "日本電車轉乘查詢中文版",
        url: "https://world.jorudan.co.jp/mln/zh-tw/",
        icon: <Train className="w-5 h-5" />,
      },
      {
        title: "JR 東日本訂票",
        desc: "新幹線／在來線參考",
        url: "https://www.eki-net.com/zh-CHT/jreast-train-reservation/Top/Index",
        icon: <Train className="w-5 h-5" />,
      },
      {
        title: "仙台空港",
        desc: "航廈交通與樓層（官方）",
        url: "https://www.sdj-airport.com/",
        icon: <Map className="w-5 h-5" />,
      },
      {
        title: "秋田內陸縱貫鐵道",
        desc: "微笑鐵道時刻（官方）",
        url: "https://www.akita-nairiku.com/",
        icon: <Train className="w-5 h-5" />,
      },
    ],
  },
  {
    category: "天氣與實用",
    items: [
      {
        title: "仙台天氣 (Tenki.jp)",
        desc: "宮城市區與沿海",
        url: "https://tenki.jp/forecast/5/18/3410/4100/",
        icon: <Sun className="w-5 h-5" />,
      },
      {
        title: "北秋田／森吉山天氣",
        desc: "阿仁樹冰日前查降雪與穿搭",
        url: "https://tenki.jp/forecast/2/8/3220/5213/",
        icon: <CloudSnow className="w-5 h-5" />,
      },
      {
        title: "Coin Locker Navi",
        desc: "尋找車站置物櫃",
        url: "https://www.coinlocker-navi.com/",
        icon: <Briefcase className="w-5 h-5" />,
      },
    ],
  },
  {
    category: "景點預約",
    items: [
      {
        title: "森吉山阿仁ゴンドラ",
        desc: "阿仁スキー場樹冰／雪上活動",
        url: "https://www.aniski.jp/",
        icon: <Snowflake className="w-5 h-5" />,
      },
      {
        title: "木戶五郎兵衛村",
        desc: "橫手古民家／搗麻糬（官方）",
        url: "https://www.city.yokote.lg.jp/shisetsu/1001528/1008619.html",
        icon: <Star className="w-5 h-5" />,
      },
      {
        title: "銀山溫泉",
        desc: "溫泉街官方導覽",
        url: "https://www.ginzanonsen.jp/",
        icon: <Camera className="w-5 h-5" />,
      },
      {
        title: "猊鼻溪遊船",
        desc: "輕舟營運與停航資訊",
        url: "https://www.geibikei.co.jp/",
        icon: <Star className="w-5 h-5" />,
      },
    ],
  },
  {
    category: "購物與優惠",
    items: [
      {
        title: "AEON Mall 名取",
        desc: "樓層與營業時間",
        url: "https://natori-aeonmall.com/",
        icon: <ShoppingBag className="w-5 h-5" />,
      },
      {
        title: "日本退稅新制說明",
        desc: "觀光廳免稅制度入口",
        url: "https://www.mlit.go.jp/kankocho/tax-free/",
        icon: <ShoppingBag className="w-5 h-5" />,
      },
      {
        title: "松本清藥妝",
        desc: "店鋪搜尋與資訊",
        url: "https://www.matsukiyococokara-online.com/store/",
        icon: <ShoppingBag className="w-5 h-5" />,
      },
    ],
  },
  {
    category: "緊急與保險",
    items: [
      {
        title: "富邦產險理賠",
        desc: "旅遊不便險/旅平險官網",
        url: "https://www.fubon.com/insurance/home/",
        icon: <Shield className="w-5 h-5" />,
      },
      {
        title: "Tokio Marine 日動",
        desc: "VJW 推薦旅平險理賠 (中文)",
        url: "https://tokiomarinenichido.jp/zh-hant/china2/",
        icon: <Shield className="w-5 h-5" />,
      },
      {
        title: "JNTO 醫療指南",
        desc: "搜尋可對應外語的醫院",
        url: "https://www.jnto.go.jp/emergency/chc/mi_guide.html",
        icon: <AlertCircle className="w-5 h-5" />,
      },
    ],
  },
];

// ============================================================================
// 3. 商店與購物指南 (Shop guide)
// ============================================================================
//
// 各區域推薦店家、特色與附近連鎖店，方便安排行程與購物。
//
export const shopGuideData = [
  {
    area: "AEON 名取 (Day 5)",
    desc: "杜せきのした站直結，回程補貨首選",
    mapQuerySuffix: "イオンモール名取",
    mainShops: [
      { name: "AEON Style 名取", tag: "超市", note: "伴手禮食品一次買" },
      { name: "藥妝樓層", tag: "藥妝", note: "比免稅店好比價" },
      { name: "美食街", tag: "美食", note: "回程前午餐自理" },
    ],
    specialShops: [
      {
        name: "扭蛋區（限時）",
        tag: "玩具",
        note: "v11：領隊時段內 2–3 顆，重複互換",
      },
      { name: "LOFT", tag: "文具", note: "與扭蛋二選一，不要兩頭衝" },
      { name: "退稅櫃台", tag: "退稅", note: "先付含稅，機場託運前再退" },
    ],
    nearbyChains: [
      { name: "Starbucks", location: "Mall 內" },
      { name: "7-Eleven", location: "杜せきのした站周邊" },
      { name: "Lawson", location: "Mall 周邊" },
    ],
  },
  {
    area: "仙台市區 (Day 4 晚／Day 5)",
    desc: "牛舌與一番町，時間看領隊",
    mapQuerySuffix: "仙台駅",
    mainShops: [
      { name: "牛舌街／駅前", tag: "美食", note: "利久、喜助等（店家待查）" },
      { name: "S-PAL 仙台", tag: "百貨", note: "車站直結" },
      { name: "藤崎／一番町", tag: "購物", note: "自由活動才走得完" },
    ],
    specialShops: [
      { name: "萩之月／支倉", tag: "伴手禮", note: "機場也有，市區可先看" },
      { name: "唐吉訶德仙台", tag: "雜貨", note: "待查分店與停留" },
      { name: "Loft", tag: "文具", note: "待查是否排入" },
    ],
    nearbyChains: [
      { name: "Starbucks", location: "仙台駅構內" },
      { name: "松屋", location: "駅前" },
      { name: "FamilyMart", location: "飯店周邊（落點待查）" },
    ],
  },
  {
    area: "松島 (Day 5，可刪)",
    desc: "五大堂與烤魚板；時間不夠可整段刪",
    mapQuerySuffix: "松島海岸",
    mainShops: [
      { name: "松島遊船賣店", tag: "伴手禮", note: "牡蠣／海產點心" },
      { name: "五大堂周邊", tag: "散策", note: "透橋拍照，路滑慢走" },
      { name: "日式點心（團贈待查）", tag: "甜點", note: "待核商品頁是否附贈" },
    ],
    specialShops: [
      { name: "烤笹蒲鉾體驗", tag: "體驗", note: "阿部蒲鉾等；與 AEON 時間互搶" },
      { name: "牡蠣小屋", tag: "美食", note: "季節與團餐衝突時先跟領隊" },
    ],
    nearbyChains: [
      { name: "7-Eleven", location: "松島海岸駅前" },
      { name: "觀光案內所", location: "駅前" },
    ],
  },
  {
    area: "銀山／木戶／角館 (Day 2)",
    desc: "溫泉街、古民家搗麻糬與小京都，當日無樹冰",
    mapQuerySuffix: "角館 武家屋敷",
    mainShops: [
      { name: "武家屋敷通商店", tag: "雜貨", note: "樺細工（櫻樹皮）" },
      { name: "銀山溫泉街", tag: "散策", note: "瓦斯燈與木造旅館，路滑" },
      { name: "木戶五郎兵衛村", tag: "體驗", note: "搗麻糬＋古民家午餐，紀念品少" },
    ],
    specialShops: [
      { name: "角館和菓子", tag: "甜點", note: "停留短，看好再買" },
      { name: "銀山足湯／茶屋", tag: "體驗", note: "時間不夠就拍照離開" },
    ],
    nearbyChains: [
      { name: "JR 角館駅超商", location: "轉乘內陸線處" },
      { name: "自動販賣機", location: "銀山停車場一帶" },
    ],
  },
];

// ============================================================================
// 4. 行程核心資料 (Itinerary)
// ============================================================================
//
// 每日行程包含事件時間、地點、交通與小提醒，供 UI 呈現用。
// 事件時間多標「約」或「待領隊」，以商品頁／v11 為準。
//
export const itineraryData = [
  {
    day: "Day 1",
    locationKey: "tendo",
    date: "1/22 (五)",
    title: "仙台空港 → 天童／上山溫泉（低密度）",
    stay: "天童／上山溫泉候選（未保證落點）",
    routeInfo: {
      summary: "桃園機場 → JX862 → 仙台空港 → 天童／上山溫泉區（待領隊）",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=Sendai+Airport&destination=Tendo+Onsen",
    },
    events: [
      {
        time: "約 09:30",
        title: "桃園機場集合",
        mapQuery: "桃園國際機場",
        // Wikipedia 臺灣桃園國際機場：25.077758, 121.232822
        lat: 25.077758,
        lon: 121.232822,
        icon: <MapPin />,
        desc: "集合地點與報到櫃檯待領隊／商品頁 v11。先完成 Visit Japan Web QR Code 截圖。",
        tips: [
          "護照效期需自返國日起算六個月以上。",
          "開心優先：排隊時先上廁所、喝水，不要趕著扭蛋。",
          "待查：實際集合時間、航廈與團體報到櫃台。",
        ],
      },
      {
        time: "11:50",
        title: "班機：星宇 JX862（待核商品頁／v11）",
        mapQuery: "桃園國際機場",
        // Wikipedia 臺灣桃園國際機場：25.077758, 121.232822
        lat: 25.077758,
        lon: 121.232822,
        icon: <Train />,
        desc: "時刻為冬季常見班表草稿，實際以商品頁／行前通知為準。",
        transport: {
          mode: "飛機",
          duration: "約 3 小時 10 分",
          route: "台北桃園 (TPE) → 仙台 (SDJ)",
          note: "待核商品頁／v11。團體機位多無法指定，同行未必連座。",
        },
        tips: [
          "鋰電池行動電源放隨身，勿托運。",
          "機上餐當午餐；落地日本比台灣快 1 小時。",
        ],
      },
      {
        time: "約 16:00",
        title: "抵達仙台空港",
        mapQuery: "仙台空港",
        lat: 38.13694,
        lon: 140.9225,
        icon: <MapPin />,
        desc: "入境審查出示 VJW QR Code，領行李後跟團旗。大件勿離隊。",
        tips: [
          "開通 eSIM／漫遊，確認領隊緊急聯絡。",
          "踩雷：機場免稅店先別狂買，退稅新制要到出境才退。",
          "待查：遊覽車上車地點與晚餐是會席或自助。",
        ],
      },
      {
        time: "約 17:30",
        title: "前往天童／上山溫泉（低密度）",
        mapQuery: "天童温泉",
        // Wikipedia 天童駅：北緯 38.3599694、東経 140.3695028
        lat: 38.3599694,
        lon: 140.3695028,
        icon: <Hotel />,
        desc: "v11：當日低密度，直奔天童或上山溫泉區入住。不排仙台市區逛街。落點未保證。",
        transport: {
          mode: "遊覽車",
          duration: "待領隊",
          route: "仙台空港 → 天童／上山溫泉候選",
          note: "日本巴士工時上限可能影響抵達時間。上山候選見 Wikipedia 上山温泉 38.16697, 140.27322。",
        },
        highlights: [
          "溫泉飯店多為兩小床；三人房／大床不保證。",
          "進房先開暖氣，濕衣服掛浴室。本日沒有樹冰。",
        ],
      },
      {
        time: "約 19:00",
        title: "晚餐與入住",
        mapQuery: "天童温泉",
        lat: 38.3599694,
        lon: 140.3695028,
        icon: <Utensils />,
        desc: "晚餐多為飯店會席、涮涮鍋或燒肉套餐（待核商品頁）。泡湯遵守先洗再泡。",
        tips: [
          "開心優先：車程不短，先泡湯吃飯，不要硬排市區。",
          "刺青、醉酒、長時間浸泡都是溫泉雷區。",
        ],
      },
    ],
    notice: {
      type: "info",
      text: "D1 低密度：空港→天童／上山。航班與飯店落點以商品頁／v11 為準。",
    },
  },
  {
    day: "Day 2",
    locationKey: "ginzan",
    date: "1/23 (六)",
    title: "銀山溫泉 → 木戶五郎兵衛村 → 角館",
    stay: "田澤湖／雫石溫泉候選（未保證落點）",
    routeInfo: {
      summary: "飯店 → 銀山溫泉街 → 木戶五郎兵衛村（搗麻糬）→ 角館 → 飯店",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=Ginzan+Onsen&destination=Kakunodate+Bukeyashiki&waypoints=Kido+Gorobei+Village+Yokote",
    },
    events: [
      {
        time: "約 08:30",
        title: "出發往銀山（待領隊）",
        mapQuery: "銀山温泉",
        // Wikipedia 銀山温泉：北緯 38.5697、東経 140.5311
        lat: 38.5697,
        lon: 140.5311,
        icon: <Hotel />,
        desc: "v11：本日無藏王、無樹冰。先銀山再木戶搗麻糬，午後角館。",
        tips: [
          "雪靴、小毛巾（足湯）早上就帶上。",
          "開心優先：樹冰明天才有，今天別追纜車。",
        ],
      },
      {
        time: "約 10:00",
        title: "銀山溫泉街散策",
        mapQuery: "銀山温泉",
        lat: 38.5697,
        lon: 140.5311,
        icon: <Camera />,
        desc: "大正木造旅館與瓦斯燈沿銀山川排列。停車後多需步行入街。可自由足湯。",
        highlights: [
          "橋上遠景與瓦斯燈街屋。",
          "足湯／茶屋：時間不夠就拍照離開。",
        ],
        tips: [
          "路面結冰，雪靴優於好看的鞋。",
          "v11 扭蛋：銀山不是限時窗，先看別買爆。",
          "待查：停留多久、能否入內某旅館大廳。",
        ],
      },
      {
        time: "約 12:30",
        title: "木戶五郎兵衛村：搗麻糬＋古民家午餐",
        mapQuery: "木戸五郎兵衛村",
        // OSM node 11359797231「雄物川民家苑木戸五郎兵衛村」：39.2982401, 140.4327054
        lat: 39.2982401,
        lon: 140.4327054,
        icon: <Star />,
        desc: "橫手市雄物川町古民家園區。穿圍裙持木槌搗麻糬（餅つき），黃豆粉／紅豆餡現場吃。午餐為古民家風味套餐（額待核）。",
        transport: {
          mode: "遊覽車",
          duration: "待領隊",
          route: "銀山溫泉 → 木戶五郎兵衛村",
          note: "雪路可能延誤。村內茅草屋路滑，聽工作人員指示再持槌。",
        },
        highlights: [
          "江戶～大正茅草民家（市指定有形文化財）。",
          "搗好的熱麻糬＋農家風味午餐。",
        ],
        tips: [
          "手套可脫再搗，結束立刻穿回。",
          "開心優先：搗不到整團份也不要搶槌。",
          "待查：是否每人都能下場、素食／過敏能否改餐。",
        ],
      },
      {
        time: "約 15:00",
        title: "角館武家屋敷",
        mapQuery: "角館 武家屋敷",
        // Wikipedia 角館駅（JR）：北緯 39.591722、東経 140.571000
        lat: 39.591722,
        lon: 140.571,
        icon: <MapPin />,
        desc: "東北小京都。冬景是雪中黑牆與門松，不是櫻花季的垂枝櫻。",
        highlights: [
          "武家屋敷通散步，部分邸宅收費入內（是否含票待查）。",
          "樺細工小店：看好價格再買。",
        ],
        tips: [
          "石板路滑，牽好同行、不奔跑。",
          "開心優先：店休或縮時就當散步，不強迫打卡。",
        ],
      },
      {
        time: "約 18:00",
        title: "前往住宿＋晚餐",
        mapQuery: "田沢湖",
        lat: 39.591722,
        lon: 140.571,
        icon: <Utensils />,
        desc: "常見改住田澤湖、雫石或繫溫泉候選。未保證落點。",
        tips: ["泡湯後補水。隔天才是阿仁／森吉樹冰，今晚早睡。"],
      },
    ],
    notice: {
      type: "info",
      text: "D2 無藏王、無樹冰。順序：銀山 → 木戶搗麻糬 → 角館。",
    },
  },
  {
    day: "Day 3",
    locationKey: "ani",
    date: "1/24 (日)",
    title: "阿仁／森吉樹冰＋秋田內陸線",
    stay: "溫泉飯店候選（未保證落點）",
    routeInfo: {
      summary: "飯店 → 阿仁ゴンドラ／樹冰平＋雪上活動 → 內陸線（阿仁和⇄松葉）→ 飯店",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=Ani+Ski+Resort+Moriyoshi&destination=Ani-Matagi+Station",
    },
    events: [
      {
        time: "約 08:30",
        title: "出發往阿仁／森吉（待領隊）",
        mapQuery: "森吉山阿仁スキー場",
        // Wikipedia 阿仁スキー場：北緯 39.95500、東経 140.49194
        lat: 39.955,
        lon: 140.49194,
        icon: <Snowflake />,
        desc: "v11：全團唯一樹冰日。手套、墨鏡、暖暖包上車就帶。午餐可能是雪場套餐或代金。",
        transport: {
          mode: "遊覽車",
          duration: "待領隊",
          route: "飯店 → 森吉山阿仁スキー場",
          note: "雪路可能延誤。集合時間聽領隊。",
        },
      },
      {
        time: "約 10:00",
        title: "阿仁ゴンドラ看樹冰＋雪上活動",
        mapQuery: "阿仁ゴンドラ",
        lat: 39.955,
        lon: 140.49194,
        icon: <Snowflake />,
        desc: "搭乘阿仁ゴンドラ至山頂車站一帶（樹冰平）。官方：片道約 20 分、山頂駅標高約 1,167 m，再步行約 5 分近看。含雪盆／雪上橡皮艇＋熱飲（視雪量）。",
        transport: {
          mode: "阿仁ゴンドラ",
          duration: "片道約 20 分鐘（待現場）",
          route: "山麓駅 → 山頂駅／樹冰平",
          note: "商品頁常見：纜車停駛退約 2,000 日圓／人；雪上活動取消退約 500 日圓／人（待核 v11）。樹冰不保證成形。",
        },
        highlights: [
          "樹冰平雪怪群：白茫茫也算東北冬天。",
          "雪盆、雪上橡皮艇：聽教練，不衝樹冰拍照。",
        ],
        tips: [
          "開心優先：沒看到「雪怪」也不算白來，能上山就記一筆。",
          "纜車依序上下；結冰地板禁止奔跑。勿觸摸樹冰、勿靠近樹洞。",
          "待查：實際預約時段與雪具是否自備。",
        ],
      },
      {
        time: "約 12:30",
        title: "午餐（雪場或代金）",
        mapQuery: "森吉山阿仁スキー場",
        lat: 39.955,
        lon: 140.49194,
        icon: <Utensils />,
        desc: "雪場日式套餐或發代金（商品頁常見約 3,000 日圓，待核）。熱食優先。",
        tips: ["別在風口站著吃。濕手套先烤乾再下午上車。"],
      },
      {
        time: "約 14:00",
        title: "秋田內陸線（阿仁和⇄松葉）",
        mapQuery: "阿仁マタギ駅",
        // Wikipedia 阿仁マタギ駅（阿仁和站）：北緯 39.9195694、東経 140.5157000
        lat: 39.9195694,
        lon: 140.5157,
        icon: <Train />,
        desc: "商品頁：阿仁和站⇄松葉站。班次與車種待領隊，實際起訖可視車況調整。",
        transport: {
          mode: "秋田內陸縱貫鐵道",
          duration: "待領隊",
          route: "阿仁和（阿仁マタギ）⇄ 松葉（待現場）",
          note: "班次少，不要自己留下來等下一班。停駛時商品頁常見退約 1,000 日圓／人（待核）。",
        },
        highlights: [
          "雪原、溪谷與鐵橋是這段的重點。",
          "車廂販賣／紀念整理券：預算內再買。",
        ],
        tips: [
          "車廂暖氣強，進出車門先把外套拉好。",
          "待查：實際乘坐區間、是否為觀光列車。",
        ],
      },
      {
        time: "約 18:00",
        title: "返回飯店",
        mapQuery: "雫石プリンスホテル",
        lat: 39.9195694,
        lon: 140.5157,
        icon: <Hotel />,
        desc: "常見改住雫石、繫溫泉或田澤湖候選。未保證落點。",
        tips: ["隔天草莓＋猊鼻溪出發早。v11：今晚不是扭蛋窗。"],
      },
    ],
    notice: {
      type: "warning",
      text: "樹冰只在本日。未形成或ゴンドラ停駛仍可能原景點參觀，退費見商品頁。",
    },
  },
  {
    day: "Day 4",
    locationKey: "geibikei",
    date: "1/25 (一)",
    title: "草莓採果 → 猊鼻溪 → 仙台市區",
    stay: "仙台市區候選（未保證落點）",
    routeInfo: {
      summary: "飯店 → 草莓園 → 猊鼻溪 → 仙台市區",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=Ichinoseki&destination=Sendai+Station&waypoints=Geibikei",
    },
    events: [
      {
        time: "約 08:30",
        title: "出發往草莓園（待領隊）",
        mapQuery: "一関 いちご狩り",
        // Wikipedia 一ノ関駅：北緯 38.926052、東経 141.139225（園區正確落點待核商品頁）
        lat: 38.926052,
        lon: 141.139225,
        icon: <Star />,
        desc: "溫室草莓吃到飽。園區落點待核；天候或收成不佳時商品頁常見改贈一盒草莓。",
        transport: {
          mode: "遊覽車",
          duration: "待領隊",
          route: "飯店 → 草莓園（一關一帶，待查）",
          note: "松島改排 D5 且可刪，本日不走松島。",
        },
        tips: [
          "洗手、勿攜未洗果出園（園規待現場）。",
          "開心優先：沒採到就吃贈盒，不堅持打卡。",
        ],
      },
      {
        time: "約 10:30",
        title: "現採草莓吃到飽",
        mapQuery: "一関 いちご狩り",
        lat: 38.926052,
        lon: 141.139225,
        icon: <Star />,
        desc: "溫室採果、現場吃到飽。停留時間聽領隊。",
        highlights: ["紅熟再摘，不要生拔。", "洗手區先排，再進園。"],
      },
      {
        time: "約 11:30",
        title: "前往猊鼻溪（待領隊）",
        mapQuery: "猊鼻渓駅",
        lat: 38.9887792,
        lon: 141.2532381,
        icon: <Train />,
        desc: "岩手縣一關市。冬季可能改屋形暖桌船，或因結冰停航。",
        transport: {
          mode: "遊覽車",
          duration: "待領隊",
          route: "草莓園 → 猊鼻溪",
          note: "停航時改室內或縮時。商品頁常見退約 1,500 日圓／人（待核）。",
        },
      },
      {
        time: "約 12:30",
        title: "午餐",
        mapQuery: "猊鼻渓",
        lat: 38.9887792,
        lon: 141.2532381,
        icon: <Utensils />,
        desc: "猊鼻溪風味、平泉御膳或陶板燒（餐標待核商品頁）。",
      },
      {
        time: "約 13:30",
        title: "猊鼻溪輕舟",
        mapQuery: "猊鼻渓",
        lat: 38.9865477,
        lon: 141.2650788,
        icon: <Camera />,
        desc: "日本百景溪谷。船夫船歌（含中文段）視當日船班。冬季多屋形暖桌船。",
        highlights: [
          "斷崖與鍾乳石「獅子鼻」。",
          "冬季暖桌船較禦寒，仍要帽子手套。",
        ],
        tips: [
          "上下船依序，不站船緣自拍。",
          "踩雷：能見度不好時不要堅持一定看到完整溪谷。",
          "待查：是否含團餐在溪谷餐廳。",
        ],
      },
      {
        time: "約 17:30",
        title: "入住仙台市區＋晚餐／逛街（待查）",
        mapQuery: "仙台駅",
        lat: 38.26028,
        lon: 140.88222,
        icon: <Hotel />,
        desc: "v11：本日回仙台，不排松島。晚餐常見和牛涮涮鍋／燒肉或自理。飯店為仙台市區同級候選。",
        tips: [
          "牛舌排隊很長，訂不到就改駅前食堂。",
          "退稅新制：市區先付含稅，護照與退款方式要登錄。",
          "v11 扭蛋：今晚仍不是限時窗；LOFT 可先看，明天再跟 AEON 二選一。",
        ],
      },
    ],
    notice: {
      type: "info",
      text: "D4：草莓 → 猊鼻溪 → 仙台。松島改排 D5 且可刪。",
    },
  },
  {
    day: "Day 5",
    locationKey: "natori",
    date: "1/26 (二)",
    title: "松島（可刪）→ 烤魚板／AEON 名取 → 空港",
    stay: "溫暖的家",
    routeInfo: {
      summary:
        "飯店 → 松島（可刪）→ 烤魚板／AEON 名取（限時扭蛋）→ 仙台空港（先退稅再報到）→ JX863",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=Matsushima-Kaigan&destination=Sendai+Airport&waypoints=AEON+Mall+Natori",
    },
    events: [
      {
        time: "約 08:30",
        title: "退房出發（待領隊）",
        mapQuery: "仙台駅",
        lat: 38.26028,
        lon: 140.88222,
        icon: <Hotel />,
        desc: "大件先上車。護照、退稅單、藥袋放隨身。松島為可刪段，領隊可能直接去 AEON。",
        tips: [
          "開心優先：松島被砍就多一點 AEON／空港時間。",
          "待查：是否加停市區免稅店。",
        ],
      },
      {
        time: "約 09:30",
        title: "松島散策（可刪）",
        mapQuery: "松島海岸駅",
        // Wikipedia 松島海岸駅：北緯 38.368142、東経 141.058789
        lat: 38.368142,
        lon: 141.058789,
        icon: <Camera />,
        desc: "v11：可刪。日本三景之一。時間不夠或路況差時整段取消，改 AEON。",
        highlights: [
          "五大堂透橋：板縫看得見海，慢慢走。",
          "灣內約 260 島，天氣好才看得到層次。",
        ],
        tips: [
          "開心優先：起霧就拍橋與松，不堅持出海。",
          "被砍不要當場生氣，下午扭蛋窗比較硬。",
        ],
      },
      {
        time: "約 10:30",
        title: "烤笹蒲鉾／魚板體驗",
        mapQuery: "阿部蒲鉾店 松島寺町店",
        // MapFan／松島観光ナビ：阿部蒲鉾店松島寺町店 38.3702743, 141.0605585
        lat: 38.3702743,
        lon: 141.0605585,
        icon: <Utensils />,
        desc: "松島烤魚板體驗（阿部蒲鉾等，店家待核）。若松島整段刪，可能改到 AEON 午餐代金。",
        tips: [
          "熱魚板先吃再買伴手禮。",
          "與 AEON 限時窗互搶時，聽領隊二選一。",
        ],
      },
      {
        time: "約 12:00",
        title: "AEON Mall 名取（限時扭蛋窗）",
        mapQuery: "イオンモール名取",
        // Wikipedia イオンモール名取：北緯 38.163917、東経 140.895972
        lat: 38.163917,
        lon: 140.895972,
        icon: <ShoppingBag />,
        desc: "v11 扭蛋主窗口：只在領隊宣布的停留時段內扭。食品、藥妝、生活雜貨一次補。午餐常見代金。",
        highlights: [
          "超市伴手禮：白澤／萩之月等，先看保存期限。",
          "扭蛋：每人 2–3 顆，重複互相交換。",
        ],
        tips: [
          "時間不夠：扭蛋 vs LOFT 二選一，不要兩頭衝。",
          "先付含稅；退稅到空港託運前再辦。",
          "預留回機場通關＋退稅，不要卡最後一刻。",
        ],
      },
      {
        time: "約 14:00",
        title: "前往仙台空港",
        mapQuery: "仙台空港",
        lat: 38.13694,
        lon: 140.9225,
        icon: <Train />,
        desc: "團體專車為主。自行搭空港アクセス線僅作備案，需領隊同意。",
        transport: {
          mode: "遊覽車",
          duration: "待領隊",
          route: "AEON 名取 → 仙台空港",
          note: "待核商品頁／v11 的報到截止時間。",
        },
      },
      {
        time: "約 14:30",
        title: "空港退稅（託運／報到前）",
        mapQuery: "仙台空港",
        lat: 38.13694,
        lon: 140.9225,
        icon: <QrCode />,
        desc: "v11：先完成免稅持出確認，再託運與報到。綠燈通過、紅燈改人工查驗。",
        tips: [
          "同一張收據缺件可能整張不退，先對過購物袋。",
          "星宇托運與手提限制以官網為準；刀具放托運。",
          "待查：仙台空港退稅機台樓層與是否提供現金退。",
        ],
      },
      {
        time: "17:25",
        title: "班機：星宇 JX863（待核商品頁／v11）",
        mapQuery: "仙台空港",
        lat: 38.13694,
        lon: 140.9225,
        icon: <Train />,
        desc: "冬季常見 17:25 SDJ → 20:35 TPE，實際以商品頁為準。",
        transport: {
          mode: "飛機",
          duration: "約 4 小時 10 分",
          route: "仙台 (SDJ) → 台北桃園 (TPE)",
          note: "待核商品頁／v11。抵台後記得把 Reminder 裡的待查勾掉。",
        },
        tips: ["機上當晚餐。開心優先：行李到了就贏。"],
      },
    ],
    notice: {
      type: "info",
      text: "松島可刪。AEON 為限時扭蛋窗。務必先退稅持出再託運／報到。",
    },
  },
];

// ============================================================================
// 5. 專案全域設定 (Config)
// ============================================================================
//
// 用於控制行程標題、日期、飯店、緊急聯絡與 UI 主題等。
// 主題（含 componentStyles light/dark）自 2026 輕井澤檔整段複製。
//
export const tripConfig = {
  // ========== 基本資訊 ==========
  id: "2027_tohoku",
  title: "2027 東北／森吉樹冰五日",
  timeZone: "Asia/Tokyo",
  currency: {
    code: "jpy", // API 使用小寫 (jpy, usd, eur...)
    label: "日圓",
    source: "JPY",
    target: "TWD", // 目標貨幣 (固定為TWD)
  },
  subTitle: "2027/1/22 - 1/26 可樂森吉（阿仁）樹冰五日",
  startDate: "2027-01-22T00:00:00",

  endDate: "2027-01-26T23:59:59",

  // ========== 網站 Meta 設定 (動態標題) ==========
  meta: {
    title: "2027 東北／森吉樹冰五日",
    shortName: "2027森吉樹冰",
    description: "2027 東北／阿仁森吉樹冰五日旅遊行程助手",
    ogImage: "https://fcwi.github.io/trip_agent/icon-512.png",
  },

  // ========== 航班資訊 ==========
  // 時刻為冬季常見班表草稿，待核商品頁／v11
  flights: {
    outbound: {
      code: "星宇 JX862",
      time: "11:50 TPE ➝ 16:00 SDJ（待核商品頁／v11）",
    },
    inbound: {
      code: "星宇 JX863",
      time: "17:25 SDJ ➝ 20:35 TPE（待核商品頁／v11）",
    },
  },

  // ========== 住宿資訊 ==========
  // 皆為團體常見候選，未保證落點
  hotels: [
    {
      name: "仙台大都會飯店",
      phone: "+81-22-268-2525",
      address: "宮城県仙台市青葉区中央1-1-1",
      note: "未保證落點／候選（仙台市區）。電話為飯店公開總機。",
    },
    {
      name: "仙溪園月岡",
      phone: "+81-23-672-1212",
      address: "山形県上山市新湯（詳細番地待核商品頁）",
      note: "未保證落點／候選（上山溫泉）。電話為飯店公開總機。",
    },
    {
      name: "天童溫泉飯店（滝の湯／天童ホテル等同級）",
      phone: "待查",
      address: "山形県天童市（正確館名待核商品頁）",
      note: "未保證落點／候選（天童溫泉）。D1 低密度落點。",
    },
    {
      name: "雫石王子大飯店",
      phone: "+81-196-98-1100",
      address: "岩手県岩手郡雫石町繋温泉水沢",
      note: "未保證落點／候選（雫石／繫溫泉）。電話為飯店公開總機。",
    },
  ],

  // ========== 緊急聯絡 ==========
  emergency: {
    police: "110",
    ambulance: "119",
    contact: "旅外國人急難救助：+81-3-3280-7917",
  },

  // 導遊模式問題 (針對行程)
  aiQuestions: [
    "Day 3 阿仁／森吉樹冰看得到嗎?",
    "銀山溫泉街路滑要注意什麼?",
    "AEON 名取限時扭蛋怎麼玩?",
    "仙台空港退稅要在託運前辦嗎?",
  ],

  // 翻譯模式預設問題
  translationQuestions: [
    "翻譯「請給我兒童餐具」",
    "翻譯「這個多少錢?」",
    "翻譯「廁所在哪裡?」",
    "翻譯「可以退稅嗎?」",
  ],

  // ========== 地點定義 ==========
  // key 必須與 itineraryData.locationKey 對應
  locations: [
    // Wikipedia 仙台駅：北緯 38.26028、東経 140.88222
    { key: "sendai", name: "仙台", lat: 38.26028, lon: 140.88222 },
    // Wikipedia 仙台空港：北緯 38.13694、東経 140.92250
    {
      key: "sendai_airport",
      name: "仙台空港",
      lat: 38.13694,
      lon: 140.9225,
    },
    // Wikipedia 天童駅：北緯 38.3599694、東経 140.3695028
    { key: "tendo", name: "天童／上山", lat: 38.3599694, lon: 140.3695028 },
    // Wikipedia 上山温泉：北緯 38.16697、東経 140.27322
    {
      key: "kaminoyama",
      name: "上山溫泉",
      lat: 38.16697,
      lon: 140.27322,
    },
    // Wikipedia 銀山温泉：北緯 38.5697、東経 140.5311
    { key: "ginzan", name: "銀山溫泉", lat: 38.5697, lon: 140.5311 },
    // OSM node 11359797231「雄物川民家苑木戸五郎兵衛村」
    { key: "kido", name: "木戶五郎兵衛村", lat: 39.2982401, lon: 140.4327054 },
    // Wikipedia 角館駅（JR）：北緯 39.591722、東経 140.571000
    { key: "kakunodate", name: "角館", lat: 39.591722, lon: 140.571 },
    // Wikipedia 阿仁スキー場：北緯 39.95500、東経 140.49194
    { key: "ani", name: "阿仁／森吉樹冰", lat: 39.955, lon: 140.49194 },
    // Wikipedia 阿仁マタギ駅（阿仁和站）：北緯 39.9195694、東経 140.5157000
    {
      key: "nairiku",
      name: "秋田內陸線（阿仁和）",
      lat: 39.9195694,
      lon: 140.5157,
    },
    // OSM 鉄道駅「猊鼻渓」（node 3838451239）
    { key: "geibikei", name: "猊鼻溪", lat: 38.9887792, lon: 141.2532381 },
    // Wikipedia 松島海岸駅：北緯 38.368142、東経 141.058789
    {
      key: "matsushima",
      name: "松島（可刪）",
      lat: 38.368142,
      lon: 141.058789,
    },
    // Wikipedia イオンモール名取：北緯 38.163917、東経 140.895972
    { key: "natori", name: "AEON 名取", lat: 38.163917, lon: 140.895972 },
  ],

  // ========== 旅程亮點 ==========
  tripHighlights: [
    "阿仁／森吉樹冰纜車",
    "銀山溫泉街",
    "木戶五郎兵衛村搗麻糬",
    "角館武家屋敷",
    "秋田內陸線（阿仁和⇄松葉）",
    "草莓採果",
    "猊鼻溪遊船",
    "松島（可刪）／烤魚板",
    "AEON 名取限時扭蛋",
    "仙台牛舌",
  ],

  // ========== 視覺主題 (UI 樣式) ==========
  // 以下 theme（含 componentStyles light/dark）自
  // src/tripdata_2026_karuizawa.jsx 整段複製，勿拆 light/dark。
  theme: {
    colorBase: "stone",
    colorAccent: "amber",

    textColors: {
      light: "text-stone-800",
      dark: "text-stone-100",
      secLight: "text-stone-500",
      secDark: "text-stone-300",
    },

    bgTexture: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,

    bgGradientLight: "bg-[#FDFBF7] from-stone-100/50 via-white to-transparent",
    bgGradientDark:
      "bg-[#1A1A1A] from-[#252525] via-[#1A1A1A]/80 to-transparent",

    blobs: {
      light: ["bg-orange-200/30", "bg-stone-200/30", "bg-amber-100/40"],
      dark: ["bg-amber-500/10", "bg-purple-500/10", "bg-blue-500/10"],
    },
    // 天氣底色覆蓋 (若不設定則預設為程式碼中的灰色)
    weatherColors: {
      rain: "#94a3b8", // 自訂雨天底色
      cloud: "#cbd5e1", // 自訂多雲底色
      snow: "#94a3b8", // 自訂雪天底色
    },

    // 語義化配色 (用於圖示、標籤等)
    semanticColors: {
      blue: { light: "text-[#5D737E]", dark: "text-sky-300" },
      green: { light: "text-[#556B2F]", dark: "text-emerald-300" },
      red: { light: "text-[#A04040]", dark: "text-red-300" },
      orange: { light: "text-[#CD853F]", dark: "text-amber-300" },
      pink: { light: "text-[#BC8F8F]", dark: "text-rose-300" },
    },

    // 天氣圖示專用色
    weatherIconColors: {
      sun: "text-amber-300", // 🆕 提升深色模式對比度（原 text-amber-400）
      moon: "text-indigo-300",
      cloud: "text-gray-400",
      fog: "text-slate-400",
      rain: "text-blue-400",
      snow: "text-cyan-300",
      lightning: "text-yellow-500",
    },

    // 毛玻璃與背景色 (Pro Max 級升級)
    // 【設計原則】
    // - card: 內容卡片，透明度高但清晰，提升感強
    // - nav: 背景導航，超級透明，輔助性
    // - chatBubble: 對話泡泡，適度透明，易讀性優先
    glassColors: {
      card: {
        light:
          "bg-white/85 backdrop-blur-lg backdrop-saturate-180 border border-white/30 shadow-lg shadow-black/5",
        dark: "bg-[#1F1F1F]/92 backdrop-blur-lg backdrop-saturate-180 border border-white/15 shadow-xl shadow-black/40",
      },
      nav: {
        light:
          "bg-white/25 backdrop-blur-3xl backdrop-saturate-150 border border-white/20 shadow-md shadow-black/3",
        dark: "bg-[#2A2A2A]/50 backdrop-blur-3xl backdrop-saturate-150 border border-white/10 shadow-lg shadow-black/50",
      },
      chatBubble: {
        light:
          "bg-white/88 backdrop-blur-lg backdrop-saturate-180 border border-white/25 shadow-md shadow-black/4",
        dark: "bg-neutral-800/88 backdrop-blur-lg backdrop-saturate-180 border border-white/12 shadow-lg shadow-black/50",
      },
    },

    // 標籤與分類顏色
    tagColors: {
      transport: {
        light: "bg-[#E8F0FE] text-[#3B5998]",
        dark: "bg-sky-900/30 text-sky-200",
      },
      food: {
        light: "bg-[#F0F5E5] text-[#556B2F]",
        dark: "bg-emerald-900/30 text-emerald-200",
      },
      shopping: {
        light: "bg-[#FFF8E1] text-[#8B6B23]",
        dark: "bg-amber-900/30 text-amber-200",
      },
      hotel: {
        light: "bg-[#E6E6FA] text-[#6A5ACD]",
        dark: "bg-purple-900/30 text-purple-200",
      },
      spot: {
        light: "bg-[#FFF0F5] text-[#BC8F8F]",
        dark: "bg-rose-900/30 text-rose-200",
      },
    },

    // 聊天介面顏色
    chatColors: {
      userBubble: {
        light: "bg-[#5D737E] text-white border-[#4A606A]",
        dark: "bg-sky-800 text-white border-sky-700",
      },
      modelBubble: {
        light: "bg-white/90 backdrop-blur-sm text-stone-700 border-stone-200",
        dark: "bg-neutral-800/90 backdrop-blur-sm text-neutral-200 border-neutral-700",
      },
      bg: {
        light: "bg-[#F9F9F6]/50",
        dark: "bg-black/20",
      },
    },

    // 主背景色
    mainBg: {
      light: "bg-[#F0F2F5] text-slate-700",
      dark: "bg-[#1A1A1A] text-neutral-200",
    },

    // 粒子系統顏色
    particleColors: {
      rain: {
        light: "rgba(100, 149, 237, 0.6)",
        dark: "rgba(255, 255, 255, 0.5)",
      },
      snow: "rgba(255, 255, 255, 0.8)",
      stars: "rgba(255, 255, 255, ALPHA)", // ALPHA 將在使用時替換
      fog: "rgba(200, 200, 200, ALPHA)",
      lightning: "rgba(255, 255, 200, BRIGHTNESS)",
    },

    // 雲朵顏色
    cloudColors: {
      heavy: "#bdc3c7",
      medium: "#d1d5db",
      light: "#ecf0f1",
    },

    // 天體顏色
    celestialColors: {
      sun: "#f1c40f",
      sunGlow: "#f39c12",
      moon: "#f5f6fa",
      moonShadow: "rgba(245, 246, 250, 0.4)",
    },

    // 環境氛圍色
    ambientColors: {
      clear: {
        light: "rgba(255, 255, 255, 0.8)",
        dark: "rgba(30, 41, 59, 0.5)",
      },
      cloudy: {
        light: "rgba(241, 245, 249, 0.85)",
        dark: "rgba(51, 65, 85, 0.6)",
      },
      rain: {
        light: "rgba(219, 234, 254, 0.85)",
        dark: "rgba(30, 58, 138, 0.4)",
      },
      snow: {
        light: "rgba(248, 250, 252, 0.9)",
        dark: "rgba(71, 85, 105, 0.5)",
      },
      thunderstorm: {
        light: "rgba(200, 200, 220, 0.85)",
        dark: "rgba(30, 30, 50, 0.7)",
      },
      fog: {
        light: "rgba(226, 232, 240, 0.85)",
        dark: "rgba(71, 85, 105, 0.4)",
      },
    },

    // 動態背景色
    dynamicBg: {
      rain: { light: "#c7d2e0", dark: "#4a5568" },
      cloud: "#cbd5e1",
    },

    // 按鈕漸層
    buttonGradients: {
      primary: {
        light: "from-[#5D737E] to-[#3F5561]",
        dark: "from-sky-800 to-blue-900",
      },
    },

    // 輸入框顏色
    inputColors: {
      focusBorder: {
        light: "#5D737E",
        dark: "sky-500",
      },
      focusRing: {
        light: "rgba(93, 115, 126, 0.2)",
        dark: "rgba(14, 165, 233, 0.2)",
      },
    },

    // 連結顏色
    linkColors: {
      hover: {
        light: "#5D737E",
        dark: "sky-300",
      },
    },

    // 文字陰影
    textShadow: {
      light: "0 1px 1px rgba(255,255,255,0.5)",
      dark: "0 2px 4px rgba(0,0,0,0.3)",
    },

    // 圓角系統
    borderRadius: {
      small: "rounded-xl",
      card: "rounded-2xl",
      modal: "rounded-3xl",
      full: "rounded-full",
    },

    // 間距系統
    spacing: {
      cardSmall: "p-3",
      card: "p-4",
      cardLarge: "p-5",
    },

    // ========== 🆕 字體系統 (Typography System) ==========
    // 【說明】
    // 統一的字體層級系統，確保視覺層次清晰一致
    // 【使用方式】
    // const typo = tripConfig.theme.typography.h1;
    // className={typo.class} 或分別使用 typo.size, typo.weight, typo.leading
    typography: {
      h1: {
        size: "text-2xl", // 24px - 主標題
        weight: "font-bold",
        leading: "leading-tight",
        class: "text-2xl font-bold leading-tight",
      },
      h2: {
        size: "text-xl", // 20px - 次標題
        weight: "font-bold",
        leading: "leading-snug",
        class: "text-xl font-bold leading-snug",
      },
      h3: {
        size: "text-lg", // 18px - 卡片標題
        weight: "font-semibold",
        leading: "leading-normal",
        class: "text-lg font-semibold leading-normal",
      },
      body: {
        size: "text-base", // 16px - 內文
        weight: "font-normal",
        leading: "leading-relaxed",
        class: "text-base font-normal leading-relaxed",
      },
      caption: {
        size: "text-sm", // 14px - 輔助文字
        weight: "font-normal",
        leading: "leading-normal",
        class: "text-sm font-normal leading-normal",
      },
      label: {
        size: "text-xs", // 12px - 標籤、極小文字
        weight: "font-medium",
        leading: "leading-tight",
        class: "text-xs font-medium leading-tight",
      },
    },

    // ========== 🆕 陰影系統 (Shadow System) ==========
    // 【說明】
    // 統一的陰影層級，提供清晰的視覺深度
    // 【使用方式】
    // className={tripConfig.theme.shadows.card}
    shadows: {
      subtle: "shadow-sm", // 微妙提升 - 小按鈕、標籤
      card: "shadow-md", // 卡片陰影 - 一般卡片
      elevated: "shadow-lg", // 懸浮元素 - hover 狀態、浮動按鈕
      modal: "shadow-xl", // 彈窗陰影 - 對話框、彈出層
      inner: "shadow-inner", // 內陰影 - 輸入框
      none: "shadow-none", // 無陰影
    },

    // ========== 🆕 過渡動畫系統 (Transition System) ==========
    // 【說明】
    // 統一的過渡動畫配置，確保動畫流暢一致
    // 【使用方式】
    // className={tripConfig.theme.transitions.normal}
    transitions: {
      fast: "transition-all duration-150 ease-out", // 快速 - 小元素互動
      normal: "transition-all duration-300 ease-in-out", // 標準 - 一般過渡
      slow: "transition-all duration-500 ease-in-out", // 緩慢 - 大型動畫
      colors: "transition-colors duration-300 ease-in-out", // 顏色 - 主題切換
    },

    // ========== 🆕 互動狀態系統 (Interaction States) ==========
    // 【說明】
    // 統一的互動回饋樣式，提升使用體驗
    // 【使用方式】
    // className={`${tripConfig.theme.interactions.hover} ${tripConfig.theme.interactions.active}`}
    interactions: {
      hover: "hover:scale-105", // 懸停放大
      active: "active:scale-95", // 點擊縮小
      focus: "focus:outline-none focus:ring-2 focus:ring-offset-2", // 焦點環
      disabled: "disabled:opacity-50 disabled:cursor-not-allowed", // 禁用狀態
    },

    // ========== 🆕 語音按鈕顏色 (Voice Button Colors) ==========
    // 【說明】
    // 語音輸入按鈕的專用顏色配置
    // 【使用方式】
    // const voiceBtn = tripConfig.theme.voiceButton.chinese;
    // className={listeningLang === "zh-TW" ? voiceBtn.active.light : voiceBtn.inactive.light}
    voiceButton: {
      chinese: {
        active: {
          light: "bg-[#5D737E] border-[#4A606A] text-white",
          dark: "bg-[#5D737E] border-[#4A606A] text-white",
        },
        inactive: {
          light: "bg-white text-[#5D737E] border-stone-200 hover:bg-stone-50",
          dark: "bg-stone-800 text-sky-400 border-stone-600 hover:bg-stone-700",
        },
      },
      foreign: {
        active: {
          light: "bg-rose-400 border-rose-500 text-white",
          dark: "bg-rose-400 border-rose-500 text-white",
        },
        inactive: {
          light: "bg-white text-[#BC8F8F] border-stone-200 hover:bg-stone-50",
          dark: "bg-neutral-800 text-rose-300 border-neutral-600 hover:bg-neutral-700",
        },
      },
    },

    // ========== 🆕 組件樣式系統 (Component Styles - Pro Max Edition) ==========
    // 【說明】
    // 統一所有 UI 組件的樣式定義，支援日/夜模式動態切換
    // 【使用方式】
    // const styles = tripConfig.theme.componentStyles.itineraryCard;
    // className={isDarkMode ? styles.dark : styles.light}
    // 【好處】
    // - 單一變更點：修改主題時，所有組件自動同步
    // - 視覺一致性：卡片、導航、對話框遵循相同毛玻璃規則
    // - 可讀性最優：日/夜模式自動調整對比度
    //
    componentStyles: {
      // 行程卡片 (Day Overview, Event Cards)
      itineraryCard: {
        light:
          "bg-white/85 backdrop-blur-lg backdrop-saturate-180 border border-white/30 rounded-2xl shadow-lg shadow-black/5",
        dark: "bg-[#1F1F1F]/92 backdrop-blur-lg backdrop-saturate-180 border border-white/15 rounded-2xl shadow-xl shadow-black/40",
      },

      // 導航按鈕 (Day Navigation Tabs)
      navButton: {
        light:
          "bg-white/25 backdrop-blur-3xl backdrop-saturate-150 border border-white/20 rounded-xl hover:bg-white/35 transition-all duration-300",
        dark: "bg-[#2A2A2A]/50 backdrop-blur-3xl backdrop-saturate-150 border border-white/10 rounded-xl hover:bg-[#3A3A3A]/60 transition-all duration-300",
      },

      // 導航容器背景
      navContainer: {
        light: "bg-gradient-to-r from-white/10 via-white/5 to-white/10",
        dark: "bg-gradient-to-r from-[#2A2A2A]/40 via-[#1F1F1F]/30 to-[#2A2A2A]/40",
      },

      // 對話泡泡 - 使用者端
      chatUserBubble: {
        light: "bg-[#5D737E] text-white shadow-md",
        dark: "bg-sky-800 text-white shadow-lg",
      },

      // 對話泡泡 - 模型端
      chatModelBubble: {
        light:
          "bg-white/88 backdrop-blur-lg border border-white/25 text-stone-700 shadow-md shadow-black/4",
        dark: "bg-neutral-800/88 backdrop-blur-lg border border-white/12 text-neutral-200 shadow-lg shadow-black/50",
      },

      // 對話容器背景
      chatContainer: {
        light: "bg-[#F9F9F6]/80",
        dark: "bg-black/30 backdrop-blur-sm",
      },

      // 資訊卡片 (Flight, Hotel, Checklist)
      infoCard: {
        light:
          "bg-white/80 backdrop-blur-md border border-white/25 rounded-2xl shadow-md",
        dark: "bg-[#262626]/85 backdrop-blur-md border border-white/12 rounded-2xl shadow-lg",
      },

      // 標籤與分類 (Tags)
      tagBase: {
        light:
          "rounded-full px-3 py-1 text-sm font-medium shadow-sm backdrop-blur-sm",
        dark: "rounded-full px-3 py-1 text-sm font-medium shadow-md backdrop-blur-sm",
      },

      // 輸入框與焦點狀態
      inputField: {
        light:
          "bg-white/70 backdrop-blur-sm border border-stone-200/50 rounded-xl focus:border-[#5D737E] focus:ring-2 focus:ring-[#5D737E]/20",
        dark: "bg-[#262626]/60 backdrop-blur-sm border border-white/10 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20",
      },

      // 按鈕 - 主要 (Primary Action)
      buttonPrimary: {
        light:
          "bg-gradient-to-br from-[#5D737E] to-[#3F5561] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all",
        dark: "bg-gradient-to-br from-sky-700 to-blue-900 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all",
      },

      // 按鈕 - 次要 (Secondary Action)
      buttonSecondary: {
        light:
          "bg-white/40 backdrop-blur-md border border-white/25 hover:bg-white/50 active:scale-95 transition-all",
        dark: "bg-[#2A2A2A]/50 backdrop-blur-md border border-white/10 hover:bg-[#3A3A3A]/60 active:scale-95 transition-all",
      },

      // 模態框背景 (Modal Backdrop)
      modalBackdrop: {
        light: "bg-black/20 backdrop-blur-sm",
        dark: "bg-black/50 backdrop-blur-sm",
      },

      // 模態框容器
      modalContent: {
        light:
          "bg-white/95 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl",
        dark: "bg-[#1F1F1F]/98 backdrop-blur-lg border border-white/15 rounded-3xl shadow-2xl shadow-black/50",
      },

      // 分隔線
      divider: {
        light: "border-stone-200/30",
        dark: "border-white/10",
      },

      // 懸停效果 - 卡片提升
      cardHover: {
        light:
          "hover:shadow-xl hover:shadow-black/8 transition-all duration-300",
        dark: "hover:shadow-2xl hover:shadow-black/60 transition-all duration-300",
      },

      // 加載狀態
      loadingOverlay: {
        light: "bg-white/60 backdrop-blur-md",
        dark: "bg-[#1F1F1F]/80 backdrop-blur-md",
      },

      // 成功/警告/錯誤提示
      toastSuccess: {
        light: "bg-emerald-50/90 border border-emerald-200/50 text-emerald-800",
        dark: "bg-emerald-900/30 border border-emerald-500/30 text-emerald-200",
      },
      toastWarning: {
        light: "bg-amber-50/90 border border-amber-200/50 text-amber-800",
        dark: "bg-amber-900/30 border border-amber-500/30 text-amber-200",
      },
      toastError: {
        light: "bg-red-50/90 border border-red-200/50 text-red-800",
        dark: "bg-red-900/30 border border-red-500/30 text-red-200",
      },

      // 主背景漸層
      mainBackground: {
        light: "bg-gradient-to-br from-[#F5F7FA] via-[#FDFBF7] to-white",
        dark: "bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#1F1F1F]",
      },

      // 頁面容器
      pageContainer: {
        light: "bg-[#F5F7FA] text-stone-800",
        dark: "bg-[#0F0F0F] text-neutral-200",
      },
    },
  },

  // ========== 語言與語音設定 ==========
  // validator 需要 language.code 與 language.name
  language: {
    code: "zh-Hant",
    label: "中",
    name: "繁體中文",
  },
};

// ============================================================================
// 6. 行前檢查清單 (Pre-departure checklist)
// ============================================================================
export const checklistData = [
  { id: 1, text: "護照 (效期自返國日起算 6 個月以上)", checked: false },
  { id: 2, text: "VJW 入境申報 QR Code (建議截圖)", checked: false },
  { id: 3, text: "E-SIM / 漫遊開通", checked: false },
  {
    id: 4,
    text: "商品頁／v11：團號、集合時間、JX862／JX863 時刻（待查）",
    checked: false,
  },
  { id: 5, text: "日幣現金 & 信用卡 (確認海外開通)", checked: false },
  { id: 6, text: "交通卡 (Suica) 與零錢包（扭蛋用零錢另算）", checked: false },
  { id: 7, text: "旅遊保險 (包含不便險/醫療)", checked: false },
  { id: 8, text: "常備藥物 (退燒、感冒、止瀉、OK繃)", checked: false },
  { id: 9, text: "各類充電器 (手機、手錶) & 行動電源", checked: false },
  {
    id: 10,
    text: "防寒：洋蔥式穿搭、防水外套、毛帽、圍巾、手套",
    checked: false,
  },
  { id: 11, text: "濕紙巾、面紙 & 乾洗手 (隨身清潔)", checked: false },
  { id: 12, text: "輕便雨衣／雪地備用襪 & 塑膠袋", checked: false },
  { id: 13, text: "雪靴 / 防滑鞋 (建議噴防水噴霧)", checked: false },
  { id: 14, text: "機上/車上娛樂 (畫筆、貼紙書、耳機)", checked: false },
  { id: 15, text: "保濕乳液 & 護唇膏 (預防乾燥)", checked: false },
  { id: 16, text: "隨身垃圾袋 (日本少垃圾桶)", checked: false },
  { id: 17, text: "暖暖包 (貼式/手持)", checked: false },
  { id: 18, text: "行李秤重器", checked: false },
  { id: 19, text: "居家收尾 (倒垃圾 & 關電源)", checked: false },
  { id: 20, text: "護照影本 & 大頭照備份", checked: false },
  {
    id: 21,
    text: "退稅新制：護照＋退款方式，出境前先持出確認再託運",
    checked: false,
  },
  {
    id: 22,
    text: "v11 扭蛋：D5 AEON 限時窗、每人 2–3 顆、重複互換、vs LOFT 二選一",
    checked: false,
  },
  {
    id: 23,
    text: "開心優先：樹冰只在 D3 阿仁／森吉；松島可刪；不保證景觀",
    checked: false,
  },
  {
    id: 24,
    text: "待查：住宿正確館名、小費、自費與餐食代金",
    checked: false,
  },
];
