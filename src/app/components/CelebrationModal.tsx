import { Trophy, Sparkles, Star } from 'lucide-react';
import { useEffect } from 'react';

interface CelebrationModalProps {
  accessCount: number;
  onClose: () => void;
}

const praises = [
  '素晴らしい！',
  '天才！',
  '素敵ですね！',
  '完璧です！',
  '最高！',
  'すごい！',
  '驚異的！',
  'やったね！',
  '素晴らしい成果です！',
  'とても素敵！',
];

export function CelebrationModal({ accessCount, onClose }: CelebrationModalProps) {
  const randomPraise = praises[Math.floor(Math.random() * praises.length)];

  useEffect(() => {
    // 5秒後に自動で閉じる
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* アイコン */}
        <div className="mb-6 relative">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          <Sparkles className="w-6 h-6 text-yellow-400 absolute top-0 right-1/3 animate-pulse" />
          <Star className="w-5 h-5 text-yellow-400 absolute bottom-0 left-1/3 animate-pulse" />
        </div>

        {/* メッセージ */}
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-800 mb-2">
            アクセス{accessCount}回！
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {randomPraise}
          </div>
          <p className="text-gray-600">
            ニュースへの関心が高いですね！<br />
            これからも情報をチェックしましょう！
          </p>
        </div>

        {/* デコレーション */}
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
