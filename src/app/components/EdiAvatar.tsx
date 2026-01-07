import { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Sun, Moon, Sunset, CloudSun, MapPin } from 'lucide-react';

interface EdiAvatarProps {
    imageSrc: string;
    points: number;
    isSidebarOpen: boolean;
    bgImage?: string; // ここが追加されてないとエラーになる！
    unlockedVoices?: string[]; // これも！
}

export function EdiAvatar({ imageSrc, points, isSidebarOpen, bgImage, unlockedVoices = [] }: EdiAvatarProps) {
    const [animation, setAnimation] = useState<'idle' | 'bounce' | 'shake'>('idle');
    const [message, setMessage] = useState<string | null>(null);
    const [timeZone, setTimeZone] = useState<'morning' | 'day' | 'evening' | 'night'>('day');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) setTimeZone('morning');
        else if (hour >= 11 && hour < 16) setTimeZone('day');
        else if (hour >= 16 && hour < 19) setTimeZone('evening');
        else setTimeZone('night');
    }, []);

    useEffect(() => {
        if (points > 0) {
            setAnimation('bounce');
            setMessage('わぁ！ポイントゲット！✨');
            const timer = setTimeout(() => {
                setAnimation('idle');
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [points]);

    const handleClick = () => {
        const reactions = ['bounce', 'shake'];
        setAnimation(reactions[Math.floor(Math.random() * reactions.length)] as 'bounce' | 'shake');

        const baseTalks = {
            morning: ['眠くない？コーヒー飲む？', '一限遅刻しないようにね！'],
            day: ['eDCタワー登ってみたいなぁ', '学食のメニュー何かな？'],
            evening: ['日が沈んできたね〜', '帰りにコンビニ寄る？'],
            night: ['そろそろ寝ないと明日辛いよ？', '夜更かしは美容に悪いぞ〜']
        };

        const currentTalks = [...baseTalks[timeZone], ...unlockedVoices];
        setMessage(currentTalks[Math.floor(Math.random() * currentTalks.length)]);

        setTimeout(() => {
            setAnimation('idle');
            setMessage(null);
        }, 3000);
    };

    return (
        <div className="relative group cursor-pointer" onClick={handleClick}>
            <div className={`
        relative w-full aspect-[3/4] 
        rounded-2xl border-2 border-white shadow-xl
        overflow-hidden transition-all duration-300
        hover:shadow-2xl hover:scale-[1.02]
        ring-1 ring-blue-100
      `}>
                {/* 背景画像 */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                    style={{
                        backgroundImage: bgImage ? `url(${bgImage})` : 'linear-gradient(to bottom, #eff6ff, #ffffff)',
                    }}
                >
                    {bgImage && <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>}
                </div>

                {/* 時間帯アイコン */}
                <div className="absolute top-3 right-3 text-blue-900/40 z-10">
                    {timeZone === 'morning' && <Sun className="w-8 h-8 animate-spin-slow" />}
                    {timeZone === 'day' && <CloudSun className="w-8 h-8" />}
                    {timeZone === 'evening' && <Sunset className="w-8 h-8" />}
                    {timeZone === 'night' && <Moon className="w-8 h-8" />}
                </div>

                {/* キャラクター画像 */}
                <div className={`
          relative z-10 w-full h-full flex items-end justify-center
          transition-transform duration-500 ease-in-out
          ${animation === 'idle' ? 'animate-breathe' : ''}
          ${animation === 'bounce' ? 'animate-bounce-custom' : ''}
          ${animation === 'shake' ? 'animate-shake-custom' : ''}
        `}>
                    <img
                        src={imageSrc}
                        onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?q=80&w=1000&auto=format&fit=crop";
                        }}
                        alt="Edi"
                        className="w-[95%] h-auto object-cover object-top drop-shadow-2xl"
                        style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))' }}
                    />
                </div>

                {/* 吹き出し */}
                {message && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-[90%] z-20 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white/95 backdrop-blur-sm border-2 border-blue-100 text-blue-900 text-sm font-bold p-3 rounded-2xl rounded-bl-none shadow-lg relative">
                            <MessageCircle className="w-4 h-4 absolute -top-2 -left-2 text-blue-500 fill-white" />
                            {message}
                        </div>
                    </div>
                )}

                {/* エフェクト */}
                {animation === 'bounce' && (
                    <>
                        <Sparkles className="absolute top-1/4 right-1/4 text-yellow-400 w-8 h-8 animate-ping z-20" />
                        <Sparkles className="absolute top-1/3 left-1/4 text-pink-400 w-5 h-5 animate-bounce z-20" />
                    </>
                )}
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                <span className="bg-black/60 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-md shadow-lg">
                    Click to talk
                </span>
            </div>

            {bgImage && (
                <div className="absolute bottom-2 right-2 opacity-50 text-[10px] text-gray-500 bg-white/50 px-1 rounded">
                    <MapPin className="w-3 h-3 inline mr-0.5" />
                    Location Changed
                </div>
            )}

            <style>{`
        @keyframes breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-1.5%) scale(1.01); }
        }
        .animate-breathe { animation: breathe 4s infinite ease-in-out; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce-custom {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        .animate-bounce-custom { animation: bounce-custom 0.5s ease-out; }
        @keyframes shake-custom {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        .animate-shake-custom { animation: shake-custom 0.5s ease-in-out; }
      `}</style>
        </div>
    );
}