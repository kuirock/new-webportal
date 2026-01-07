import { ArrowLeft, Calendar, Tag } from 'lucide-react';

interface NewsItem {
  id: number;
  date: string;
  category: string;
  categoryColor: string;
  categoryImage: string;
  title: string;
}

interface NewsDetailScreenProps {
  news: NewsItem;
  onBack: () => void;
}

// ダミーのニュース本文を生成
function generateNewsContent(news: NewsItem) {
  return `
    ${news.title}に関する詳細情報をお知らせいたします。

    【概要】
    この度、${news.category}に関する重要な情報がございます。学生の皆様には必ずご確認いただきますようお願いいたします。

    【詳細内容】
    1. 対象者について
       全学生を対象としております。特に該当する学年や学科の学生は必ず確認してください。

    2. 実施期間・日程
       ${news.date}より実施いたします。詳細なスケジュールは以下の通りです。

    3. 注意事項
       - 期限を守ってください
       - 不明な点がある場合は学生課までお問い合わせください
       - 関連書類は事前に準備しておいてください

    【お問い合わせ】
    ご不明な点がございましたら、学生課窓口までお問い合わせください。
    受付時間: 平日 9:00-17:00

    以上、よろしくお願いいたします。
  `;
}

export function NewsDetailScreen({ news, onBack }: NewsDetailScreenProps) {
  const content = generateNewsContent(news);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* 戻るボタン */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>ニュース一覧に戻る</span>
        </button>

        {/* ニュース詳細カード */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* サムネイル画像 */}
          <div className="aspect-video w-full overflow-hidden bg-gray-200">
            <img 
              src={news.categoryImage} 
              alt={news.category}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6 md:p-8">
            {/* カテゴリと日付 */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm text-white ${news.categoryColor}`}>
                {news.category}
              </span>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{news.date}</span>
              </div>
            </div>

            {/* タイトル */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {news.title}
            </h1>

            {/* 本文 */}
            <div className="prose prose-sm md:prose max-w-none">
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {content}
              </div>
            </div>

            {/* フッター */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>記事ID: {news.id}</div>
                <div>公開日: {news.date}</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}