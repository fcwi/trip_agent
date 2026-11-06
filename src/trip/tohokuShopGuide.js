// 原始資料核對：2026-10-23；2026-11-06 復核可讀的分店／觀光官方頁。
// 銀山 PDF 部分內容目前無法重新擷取，保留原核對日與參考時間，不宣稱全數即時驗證。
// 自由活動建議，不代表團費包含。
const mallAddress = "宮城県名取市杜せきのした5丁目3番地の1";
const ginzanMap = "https://www.ginzanonsen.jp/files/index/map01.pdf";

export const tohokuShopGuide = [
  {
    area: "AEON 名取 (Day 5)",
    desc: "イオンモール名取，與杜せきのした站相連。以下店家均在同一商場，別走到另一間 AEON Town 名取。",
    mapQuerySuffix: "イオンモール名取",
    verifiedAt: "2026-10-23",
    visitNote:
      "購物動線建議：1F 食品 → 2F 文具／午餐 → 有餘裕才上 3F 扭蛋。先向領隊確認集合入口；藥妝是賣場品類，免稅是購物手續，均不再列為獨立店家。",
    mainShops: [
      {
        name: "イオンスタイル名取",
        tag: "食品・日用品",
        location: `商場 1F 食品／化妝品賣場｜${mallAddress}`,
        hours: "食品 08:00–22:00；化妝品 09:00–22:00",
        note: "先買常溫零食、茶包與日用品，再挑其他樓層。不同賣場結帳與免稅受理方式請分別確認。",
        officialUrl:
          "https://natori.aeonmall.jp/shop/b41d19d6-c80e-4ffb-b38f-b4e5e6316785",
        mapQuery: `イオンスタイル名取 ${mallAddress}`,
      },
      {
        name: "丸亀製麺 イオンモール名取店",
        tag: "烏龍麵",
        location: "商場 2F Food Forest｜268-4",
        hours: "10:00–21:00；最後點餐 20:30",
        note: "需要快速吃熱食時，可選烏龍麵搭配天婦羅或飯糰。午間仍需預留排隊、找座位與返回集合點的時間。",
        officialUrl:
          "https://natori.aeonmall.jp/shop/ecbf2b7b-764c-4bdf-9c37-24e4bc7ace1f",
        mapQuery: `丸亀製麺 イオンモール名取店 ${mallAddress}`,
      },
    ],
    specialShops: [
      {
        name: "名取ロフト（LOFT）",
        tag: "文具・雜貨",
        location: "商場 2F｜224",
        hours: "10:00–21:00",
        note: "適合挑手帳、貼紙、筆與生活雜貨。購物清單先聚焦文具，較容易在有限停留時間內逛完。",
        officialUrl:
          "https://natori.aeonmall.jp/shop/c9f4d518-a64d-40e3-8dde-9d032ec8b098",
        mapQuery: `名取ロフト ${mallAddress}`,
      },
      {
        name: "NISHIKIYA KITCHEN イオンモール名取店",
        tag: "宮城伴手禮",
        location: `商場 2F｜${mallAddress}`,
        hours: "10:00–21:00",
        note: "宮城品牌的調理咖哩與湯品，可比較口味與兒童系列。帶回台灣前先逐包核對成分與檢疫規定，不把所有咖哩都視為可攜入。",
        officialUrl:
          "https://www.nishiki-shokuhin.jp/news/pkobo_news/upload/223-0link_file.pdf",
        sourceLabel: "品牌分店開幕公告",
        mapQuery: `NISHIKIYA KITCHEN イオンモール名取店 ${mallAddress}`,
      },
      {
        name: "ドリームカプセル イオンモール名取",
        tag: "扭蛋",
        location: "商場 3F｜304",
        hours: "10:00–21:00",
        note: "確切的扭蛋專門店。建議先約定次數與預算，完成食品、用餐與必買清單後再上樓。",
        officialUrl:
          "https://natori.aeonmall.jp/shop/f7898604-e4a6-4af4-ae70-512f0e9789c0",
        mapQuery: `ドリームカプセル イオンモール名取 ${mallAddress}`,
      },
    ],
  },
  {
    area: "仙台車站周邊 (Day 4 晚)",
    desc: "以仙台站直結的店家為主，減少雪夜走遠路。Day 5 上午已有松島，不另塞一輪仙台市區購物。",
    mapQuerySuffix: "仙台駅",
    verifiedAt: "2026-10-23",
    visitNote:
      "僅在飯店位置與團體晚餐安排容許時前往。若晚抵仙台，優先一間餐廳或一處伴手禮櫃，不把四間全部排成必訪。",
    mainShops: [
      {
        name: "味の牛たん喜助 エスパル店",
        tag: "牛舌定食",
        location: "S-PAL 仙台本館 B1F｜仙台市青葉区中央1-1-1",
        hours: "11:00–22:00；最後點餐 21:30",
        note: "在車站地下餐廳街吃牛舌定食。若團體已含晚餐，可跳過正餐，把自由活動時間留給散步與伴手禮。",
        officialUrl: "https://www.kisuke.co.jp/spal/",
        mapQuery: "味の牛たん喜助 エスパル店 仙台市青葉区中央1-1-1",
      },
      {
        name: "菓匠三全 エスパル仙台店",
        tag: "萩之月",
        location: "S-PAL 仙台本館 B1F｜仙台市青葉区中央1-1-1",
        hours: "日～四 10:00–20:00；五、六至 21:00",
        note: "挑選萩之月等仙台銘菓。先確認送禮人數、盒裝大小與保存期限，避免最後一天重複採買。",
        officialUrl: "https://www.s-pal.jp/sendai/floormap/菓匠三全/",
        mapQuery: "菓匠三全 エスパル仙台店 本館B1F",
      },
    ],
    specialShops: [
      {
        name: "ずんだ茶寮 仙台駅ずんだ小径店",
        tag: "毛豆甜點",
        location: "JR 仙台站 3F｜仙台市青葉区中央1-1-1",
        hours: "物販 09:00–21:00；喫茶最後點餐 18:00",
        note: "可挑毛豆甜點；晚間抵達時先確認喫茶是否已結束，不把外帶商品販售時間當成內用時間。",
        officialUrl: "https://www.sanzen.co.jp/store/078/",
        mapQuery: "ずんだ茶寮 仙台駅ずんだ小径店 仙台駅3F",
      },
      {
        name: "仙台ロフト",
        tag: "文具・雜貨",
        location: "仙台市青葉区中央1-10-10｜JR 仙台站西口步行約 3 分鐘",
        hours: "10:00–20:00（目前公告）",
        note: "車站西口的獨立分店，可經地下步道抵達。名取也有 LOFT，若只為文具採買，擇一即可。",
        officialUrl: "https://www.loft.co.jp/shop_list/detail.php?shop_id=285",
        mapQuery: "仙台ロフト 仙台市青葉区中央1-10-10",
      },
    ],
  },
  {
    area: "松島海岸 (Day 5)",
    desc: "以五大堂周邊與瑞巖寺參道的短程停留為主，不另外安排一頓牡蠣吃到飽。",
    mapQuerySuffix: "松島海岸",
    verifiedAt: "2026-10-23",
    visitNote:
      "笹蒲鉾體驗的實際承辦店尚待旅行社確認；下列阿部蒲鉾店是有資料可查的自由活動選項，並非已確認團體預約。",
    mainShops: [
      {
        name: "阿部蒲鉾店 松島寺町店",
        tag: "魚板・手烤體驗",
        location: "宮城県宮城郡松島町松島字町内58",
        note: "販售笹蒲鉾，官方觀光資料亦列有手烤體驗。體驗受理、費用與團體預約請另向店家／領隊確認，不重複自費預訂。",
        officialUrl:
          "https://datekan.jp/manabitabi/spots/笹かまぼこ手焼き体験-2/",
        sourceLabel: "觀光協會介紹",
        mapQuery: "阿部蒲鉾店 松島寺町店 宮城県宮城郡松島町松島字町内58",
      },
    ],
    specialShops: [
      {
        name: "松島 雪竹屋",
        tag: "煎餅・和雜貨",
        location: "宮城県宮城郡松島町松島字町内109｜五大堂前",
        hours: "10:00–17:00（觀光協會所列）",
        note: "散策途中可買煎餅與和雜貨；適合短暫停留。若排隊或接近集合時間，先返回集合點。",
        officialUrl:
          "https://www.matsushima-kanko.com/shopping/detail.php?id=58",
        sourceLabel: "觀光協會介紹",
        mapQuery: "松島 雪竹屋 宮城県宮城郡松島町松島字町内109",
      },
    ],
  },
  {
    area: "銀山溫泉街 (Day 2 上午)",
    desc: "白天沿銀山川看木造旅館，點心以順路、小份為主。伊豆之華等餐廳較晚開門，不硬排進上午散策。",
    mapQuerySuffix: "銀山温泉",
    verifiedAt: "2026-10-23",
    visitNote:
      "冬季入場與接駁方式先由旅行社確認。步行以溫泉街開放範圍為限，不把瀑布後方的雪封步道列為必走。",
    mainShops: [
      {
        name: "野川とうふや",
        tag: "豆腐點心",
        location: "銀山溫泉街｜以官方散策地圖定位",
        hours: "09:30–18:00；不定休（官方地圖所列）",
        note: "以站食豆腐為特色，可在散策時補一份小點；實際供應與休息日依店家現場。",
        officialUrl: ginzanMap,
        sourceLabel: "溫泉街官方地圖 PDF",
        mapQuery: "野川とうふや 山形県尾花沢市銀山新畑",
      },
      {
        name: "八木橋商店",
        tag: "地方伴手禮",
        location: "銀山溫泉街｜以官方散策地圖定位",
        hours: "10:00–18:00；不定休（官方地圖所列）",
        note: "選看山形地方伴手禮與在地酒款。若購酒，先確認同行人的行李空間及航空公司包裝要求。",
        officialUrl: "https://www.ginzanonsen.jp/store/",
        sourceLabel: "溫泉街官方介紹",
        mapQuery: "八木橋商店 銀山温泉 山形県尾花沢市",
      },
    ],
    specialShops: [
      {
        name: "おみやげの店 江戸屋",
        tag: "和風小物",
        location: "銀山溫泉街｜以官方散策地圖定位",
        hours: "10:00–17:30；週一、二休（官方地圖所列）",
        note: "可看和風小物、地方菓子與煎餅。Day 2 為週六，仍需留意冬季臨時休業；不為等開門耽誤團體集合。",
        officialUrl: "https://www.ginzanonsen.jp/store/",
        sourceLabel: "溫泉街官方介紹",
        mapQuery: "江戸屋 銀山温泉 山形県尾花沢市",
      },
    ],
  },
  {
    area: "角館 (Day 2 下午)",
    desc: "先走武家屋敷通，再依剩餘時間挑一間點心或樺細工店。木戶五郎兵衛村是文化體驗場地，不列作購物店家。",
    mapQuerySuffix: "角館",
    verifiedAt: "2026-10-23",
    visitNote:
      "唐土庵在武家屋敷通旁較順路；藤木伝四郎本店位於另一段街區，有餘裕再去。石黑家已公告 2026/11/30 後停止一般公開，本趟不安排入內。",
    mainShops: [
      {
        name: "唐土庵 武家屋敷店",
        tag: "秋田菓子",
        location: "秋田県仙北市角館町表町下丁17｜青柳家對面",
        hours: "08:30–17:30",
        note: "可挑以小豆粉製作的秋田點心「もろこし」。購買生もろこし等品項時，另確認保存方式與食用期限。",
        officialUrl: "https://www.morokosian.jp/store04.html",
        mapQuery: "唐土庵 武家屋敷店 秋田県仙北市角館町表町下丁17",
      },
    ],
    specialShops: [
      {
        name: "藤木伝四郎商店 本店",
        tag: "樺細工",
        location: "秋田県仙北市角館町下新町45",
        hours: "10:00–17:00；週三休",
        note: "看櫻樹皮製作的茶筒與生活器物。這間本店不在青柳家門口，離開武家屋敷通前先評估往返時間。",
        officialUrl: "https://fujikidenshiro.co.jp/?mode=f1",
        mapQuery: "藤木伝四郎商店 本店 秋田県仙北市角館町下新町45",
      },
    ],
  },
];
