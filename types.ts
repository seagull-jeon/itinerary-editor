
export interface CostDetail {
  id: string;
  item: string; // e.g., "Lunch set"
  amount: number;
  payer: string; // e.g., "Mike"
}

export interface ItineraryItem {
  id: string;
  startTime: string;
  endTime: string;
  activity: string;
  location: string;
  category?: 'transport' | 'food' | 'activity' | 'shopping' | 'concert';
  lastEditedBy?: string;
  costs?: CostDetail[];
}

export interface DaySchedule {
  id: string;
  dateLabel: string; // e.g., "12/20 Fri."
  dayLabel: string;  // e.g., "Day 1"
  items: ItineraryItem[];
}
