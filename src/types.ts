// Interface for a holding
export interface Holding {
  id: string;
  name: string;
  symbol: string;
  coinGeckoId: string;
  quantity: number;
}

// Interface for price data used in charts
export interface PriceData {
  date: string;
  price: number;
}