import { DaySchedule } from './types';
import { v4 as uuidv4 } from 'uuid'; // We will simulate uuid with a simple helper since we can't install packages

// Simple ID generator since we can't rely on external packages in this environment
const generateId = () => Math.random().toString(36).substr(2, 9);

export const INITIAL_SCHEDULE: DaySchedule[] = [
  {
    id: 'day1',
    dateLabel: '12/20 Fri.',
    dayLabel: 'Day 1',
    items: [
      {
        id: generateId(),
        startTime: '06:45',
        endTime: '10:00',
        activity: '航班：TPE → FUK',
        location: '桃園/福岡機場',
        category: 'transport'
      },
      {
        id: generateId(),
        startTime: '10:45',
        endTime: '12:00',
        activity: '入境、領行李、前往飯店寄放',
        location: '福岡市區飯店',
        category: 'transport'
      },
      {
        id: generateId(),
        startTime: '12:00',
        endTime: '13:30',
        activity: '午餐：博多拉麵',
        location: '博多站周邊',
        category: 'food'
      },
      {
        id: generateId(),
        startTime: '13:30',
        endTime: '14:30',
        activity: '咖啡：REC COFFEE',
        location: 'REC COFFEE HAKATA',
        category: 'food'
      },
      {
        id: generateId(),
        startTime: '14:30',
        endTime: '18:00',
        activity: '前往 PayPay Dome (購買周邊)',
        location: 'PayPay Dome',
        category: 'shopping'
      },
      {
        id: generateId(),
        startTime: '18:00',
        endTime: '21:30',
        activity: 'SEVENTEEN 演唱會 (Day 1)',
        location: 'PayPay Dome',
        category: 'concert'
      },
      {
        id: generateId(),
        startTime: '21:30',
        endTime: '23:00',
        activity: '宵夜：聖誕市集',
        location: 'JR 博多站前廣場',
        category: 'food'
      },
      {
        id: generateId(),
        startTime: '23:00',
        endTime: '23:30',
        activity: '返回飯店休息',
        location: '福岡市區飯店',
        category: 'transport'
      }
    ]
  },
  {
    id: 'day2',
    dateLabel: '12/21 Sat.',
    dayLabel: 'Day 2',
    items: [
      {
        id: generateId(),
        startTime: '10:00',
        endTime: '11:30',
        activity: '早餐/咖啡：Stereo Coffee',
        location: '藥院/渡邊通',
        category: 'food'
      },
      {
        id: generateId(),
        startTime: '12:00',
        endTime: '13:30',
        activity: '午餐：博多水炊鍋',
        location: '鳥田 博多本店 或 IROHA 博多本店',
        category: 'food'
      },
      {
        id: generateId(),
        startTime: '15:30',
        endTime: '16:30',
        activity: '福岡塔觀光',
        location: '福岡塔',
        category: 'activity'
      },
      {
        id: generateId(),
        startTime: '18:00',
        endTime: '21:30',
        activity: 'SEVENTEEN 演唱會 (Day 2)',
        location: 'PayPay Dome',
        category: 'concert'
      },
      {
        id: generateId(),
        startTime: '21:30',
        endTime: '22:30',
        activity: '輕鬆宵夜或直接回飯店休息',
        location: '福岡市區',
        category: 'food'
      }
    ]
  },
  {
    id: 'day3',
    dateLabel: '12/22 Mon.',
    dayLabel: 'Day 3',
    items: [
      {
        id: generateId(),
        startTime: '09:00',
        endTime: '10:00',
        activity: '早餐：FUGLEN FUKUOKA (店內享用)',
        location: 'FUGLEN FUKUOKA',
        category: 'food'
      },
      {
        id: generateId(),
        startTime: '10:00',
        endTime: '10:30',
        activity: '採購：Full full 明太子麵包',
        location: 'Full full 天神店',
        category: 'food'
      },
      {
        id: generateId(),
        startTime: '10:30',
        endTime: '12:00',
        activity: '天神逛街 & Blue Bottle Coffee',
        location: '天神/Blue Bottle Coffee',
        category: 'shopping'
      },
      {
        id: generateId(),
        startTime: '13:00',
        endTime: '13:40',
        activity: 'SEVENTEEN POP-UP Store (固定時段)',
        location: '天神 PARCO',
        category: 'shopping'
      },
      {
        id: generateId(),
        startTime: '14:00',
        endTime: '15:00',
        activity: '午餐：在地炸豬排/漢堡排',
        location: '天神周邊',
        category: 'food'
      },
      {
        id: generateId(),
        startTime: '15:00',
        endTime: '16:00',
        activity: '文化漫步：櫛田神社 & 博多町家故鄉館',
        location: '祇園/博多',
        category: 'activity'
      },
      {
        id: generateId(),
        startTime: '16:00',
        endTime: '17:00',
        activity: '採購：茶葉/粉末採購',
        location: '博多阪急百貨 (B1)',
        category: 'shopping'
      },
      {
        id: generateId(),
        startTime: '17:00',
        endTime: '18:30',
        activity: '特色景點：福岡城跡/舞鶴公園',
        location: '舞鶴公園',
        category: 'activity'
      },
      {
        id: generateId(),
        startTime: '18:30',
        endTime: '20:00',
        activity: '宙～SORA～大濠公園日本庭園',
        location: '大濠公園',
        category: 'activity'
      },
      {
        id: generateId(),
        startTime: '20:00',
        endTime: '21:30',
        activity: '宵夜：博多一口餃子',
        location: '大名/春吉',
        category: 'food'
      }
    ]
  },
  {
    id: 'day4',
    dateLabel: '12/23 Tues.',
    dayLabel: 'Day 4',
    items: [
      {
        id: generateId(),
        startTime: '08:00',
        endTime: '09:30',
        activity: '早餐：爐端ノいとおかし (預約確認)',
        location: '六本松',
        category: 'food'
      },
      {
        id: generateId(),
        startTime: '10:30',
        endTime: '12:30',
        activity: '購物：在地雜貨與甜點',
        location: '藥院/今泉',
        category: 'shopping'
      },
      {
        id: generateId(),
        startTime: '12:30',
        endTime: '14:00',
        activity: '午餐：福岡在地炸牛排或漢堡排',
        location: '藥院/渡邊通',
        category: 'food'
      },
      {
        id: generateId(),
        startTime: '14:00',
        endTime: '17:00',
        activity: '最終伴手禮採購',
        location: 'JR 博多城 / HAKATA DEITOS',
        category: 'shopping'
      },
      {
        id: generateId(),
        startTime: '20:55',
        endTime: '22:35',
        activity: '航班：FUK → TPE',
        location: '福岡機場/桃園機場',
        category: 'transport'
      }
    ]
  }
];