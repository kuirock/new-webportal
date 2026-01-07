import { AlertTriangle, BookOpen, Newspaper } from 'lucide-react';

const classChanges = [
  {
    id: 1,
    type: 'cancellation',
    subject: 'データベース設計',
    date: '12/25(水)',
    period: '3限',
    reason: '講師都合のため',
  },
  {
    id: 2,
    type: 'room-change',
    subject: 'プログラミング基礎',
    date: '12/26(木)',
    period: '2限',
    oldRoom: 'A301',
    newRoom: 'B205',
  },
];

const recommendedNews = [
  {
    id: 1,
    title: '冬季休業期間のお知らせ',
    category: '重要',
    date: '2024/12/24',
  },
  {
    id: 2,
    title: '就職セミナー開催のご案内',
    category: '就職',
    date: '2024/12/23',
  },
  {
    id: 3,
    title: '図書館年末年始の開館時間について',
    category: '図書館',
    date: '2024/12/22',
  },
];

export function NotificationScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="text-blue-500 text-3xl font-bold mb-2">本日の情報</div>
          <div className="text-gray-600">重要な情報を確認してください</div>
        </div>

        {/* 休講・教室変更情報 */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-800">休講・教室変更情報</h2>
          </div>
          
          <div className="space-y-3">
            {classChanges.map((change) => (
              <div 
                key={change.id}
                className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-500"
              >
                {change.type === 'cancellation' ? (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-bold text-red-600">【休講】</div>
                      <div className="text-sm text-gray-600">{change.date}</div>
                    </div>
                    <div className="text-gray-800 font-medium mb-1">
                      {change.subject} - {change.period}
                    </div>
                    <div className="text-sm text-gray-600">理由: {change.reason}</div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-bold text-blue-600">【教室変更】</div>
                      <div className="text-sm text-gray-600">{change.date}</div>
                    </div>
                    <div className="text-gray-800 font-medium mb-1">
                      {change.subject} - {change.period}
                    </div>
                    <div className="text-sm text-gray-600">
                      {change.oldRoom} → <span className="font-bold text-blue-600">{change.newRoom}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* あなたにおすすめのニュース */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">あなたにおすすめのニュース</h2>
          </div>
          
          <div className="space-y-3">
            {recommendedNews.map((news) => (
              <div 
                key={news.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs text-white bg-blue-500">
                        {news.category}
                      </span>
                      <span className="text-sm text-gray-600">{news.date}</span>
                    </div>
                    <div className="text-gray-800 font-medium">{news.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 次へボタン */}
        <div className="flex justify-center">
          <button
            onClick={onComplete}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors"
          >
            ニュース一覧へ
          </button>
        </div>
      </div>
    </div>
  );
}