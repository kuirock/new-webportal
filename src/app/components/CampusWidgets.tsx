import { useState, useEffect } from 'react';
import { Bus, Utensils, AlertCircle } from 'lucide-react';

// --- バス時刻表ウィジェット ---
export function BusTimerWidget() {
    const [nextBus, setNextBus] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>('--:--');
    const [status, setStatus] = useState<'normal' | 'hurry' | 'gone'>('normal');

    // モックの時刻表（時:分）
    const BUS_SCHEDULE = [
        { h: 10, m: 30 }, { h: 10, m: 45 },
        { h: 11, m: 0 }, { h: 11, m: 15 }, { h: 11, m: 30 },
        { h: 12, m: 0 }, { h: 12, m: 30 },
        { h: 13, m: 0 }, { h: 14, m: 0 },
        { h: 15, m: 0 }, { h: 16, m: 10 }, { h: 16, m: 25 }, { h: 16, m: 40 },
        { h: 17, m: 0 }, { h: 17, m: 15 }, { h: 17, m: 30 },
        { h: 18, m: 0 }, { h: 18, m: 30 },
        { h: 19, m: 0 }, { h: 20, m: 0 },
    ];

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const currentH = now.getHours();
            const currentM = now.getMinutes();
            const currentTotal = currentH * 60 + currentM;

            // 次のバスを探す
            const next = BUS_SCHEDULE.find(t => (t.h * 60 + t.m) > currentTotal);

            if (next) {
                const nextTotal = next.h * 60 + next.m;
                const diff = nextTotal - currentTotal;

                setNextBus(nextTotal);
                setTimeLeft(`${diff}分`);

                if (diff <= 5) setStatus('hurry');
                else setStatus('normal');
            } else {
                setStatus('gone');
                setTimeLeft('終了');
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 30000); // 30秒更新
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`p-4 rounded-xl border-2 transition-all ${status === 'hurry' ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-white border-gray-100'
            }`}>
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-700 flex items-center gap-2">
                    <Bus className={`w-5 h-5 ${status === 'hurry' ? 'text-red-500' : 'text-blue-500'}`} />
                    Next Bus
                </h4>
                <span className="text-xs font-bold text-gray-400">野幌駅行き</span>
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <div className="text-3xl font-black text-gray-800 tracking-tight flex items-baseline gap-1">
                        {timeLeft}
                        {status !== 'gone' && <span className="text-sm font-medium text-gray-500">後に発車</span>}
                    </div>
                    {status === 'hurry' && (
                        <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            急いで！乗り遅れるよ！
                        </p>
                    )}
                </div>
                {nextBus && (
                    <div className="text-right">
                        <div className="text-xs text-gray-400">発車時刻</div>
                        <div className="font-bold text-xl text-blue-600">
                            {Math.floor(nextBus / 60)}:{String(nextBus % 60).padStart(2, '0')}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- 学食メニューウィジェット ---
export function CafeteriaWidget() {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3 relative z-10">
                <h4 className="font-bold text-gray-700 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-orange-500" />
                    Today's Lunch
                </h4>
                <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    営業中 11:00-14:00
                </span>
            </div>

            <div className="flex gap-3 relative z-10">
                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    <img
                        src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=200&q=80"
                        alt="Lunch"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h5 className="font-bold text-gray-800 text-sm">若鶏の唐揚げ定食</h5>
                        <span className="font-bold text-orange-600 text-lg">¥450</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        サクサクジューシーな特製唐揚げ！ご飯大盛り無料です🍚
                    </p>
                    <div className="mt-2 flex gap-1">
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">A定食</span>
                        <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded">残りわずか</span>
                    </div>
                </div>
            </div>
        </div>
    );
}