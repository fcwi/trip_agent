// User-selected planning defaults: first named hotel in each night's supplier list.
// These are map/reference locations, not confirmed reservations.
export const tohokuTourUrl =
  "https://tour.colatour.com.tw/itinerary?TourCode=NSA012205JX7&TourDate=2027/01/22";

export const tohokuProvisionalHotels = [
  {
    name: "天童溫泉 滝之湯",
    mapQuery: "ほほえみの宿 滝の湯 山形県天童市鎌田本町1-1-30",
    phone: "+81-23-654-2211",
    address: "山形県天童市鎌田本町1-1-30",
    officialUrl: "https://www.takinoyu.com/",
    coordinateSource: "https://www.takinoyu.com/access/",
    lat: 38.358993,
    lon: 140.380691,
  },
  {
    name: "田澤湖 Lake Resort",
    mapQuery: "天然温泉 田沢湖レイクリゾート 秋田県仙北市",
    phone: "+81-187-46-2016",
    address: "秋田県仙北市田沢湖生保内字下高野82-117",
    officialUrl: "https://tazawako-lakeresort.com/",
    coordinateSource: "https://mapfan.com/spots/SC5CC,J,H65",
    lat: 39.7411688,
    lon: 140.7270967,
  },
  {
    name: "繫溫泉紫苑",
    mapQuery: "盛岡つなぎ温泉 ホテル紫苑 岩手県盛岡市繋湯ノ舘74-2",
    phone: "+81-19-689-2288",
    address: "岩手県盛岡市繋字湯ノ舘74-2",
    officialUrl: "https://www.hotel-shion.com/",
    coordinateSource: "https://iwatetabi.jp/spots/6394/",
    lat: 39.678669634023,
    lon: 141.0255793,
  },
  {
    name: "京阪仙台飯店",
    mapQuery: "ホテル京阪 仙台 宮城県仙台市青葉区中央3丁目3-5",
    phone: "+81-22-263-0321",
    address: "宮城県仙台市青葉区中央3丁目3-5",
    officialUrl: "https://sendai.hotelkeihan.co.jp/zh-hant/location/",
    coordinateSource: "https://sendai.hotelkeihan.co.jp/zh-hant/location/",
    lat: 38.2597425,
    lon: 140.876656,
  },
];

export function provisionalHotelLocation(index) {
  const hotel = tohokuProvisionalHotels[index];
  return {
    mapQuery: hotel.mapQuery,
    lat: hotel.lat,
    lon: hotel.lon,
    locationProvisional: true,
    sources: [
      { text: "旅行社｜住宿候選與行程", url: tohokuTourUrl },
      { text: `${hotel.name}｜飯店官網`, url: hotel.officialUrl },
    ],
  };
}
