import { useState, useRef, useEffect } from 'react';

interface NewsItem {
  id: number;
  date: string;
  category: string;
  categoryColor: string;
  categoryImage: string;
  title: string;
}

interface NewsListProps {
  news: NewsItem[];
  categories: { name: string; color: string; image: string }[];
  onNewsClick?: (news: NewsItem) => void;
  onLoadMore: () => void;
  isLoading: boolean;
}

export function NewsList({ news, categories, onNewsClick, onLoadMore, isLoading }: NewsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('全て');
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      {
        root: scrollRef.current,
        rootMargin: '100px',
      }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [onLoadMore, isLoading]);

  // フィルタリングされたニュース
  const filteredNews = selectedCategory === '全て'
    ? news
    : news.filter(item => item.category === selectedCategory);

  const handleNewsClick = (newsItem: NewsItem) => {
    if (onNewsClick) {
      onNewsClick(newsItem);
    }
  };

  return (
    <div>
      {/* カテゴリタブ */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setSelectedCategory('全て')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === '全て'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
        >
          全て
        </button>
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === category.name
                ? `${category.color} text-white`
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* ニュースリスト */}
      <div
        ref={scrollRef}
        className="max-h-[600px] overflow-y-auto pr-1 custom-scrollbar"
      >
        {/* グリッドを3列にしてコンパクトに */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {filteredNews.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNewsClick(item)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-left w-full overflow-hidden group"
            >
              {/* サムネイル画像（高さを低く固定） */}
              <div className="h-24 w-full overflow-hidden bg-gray-200 relative">
                <img
                  src={item.categoryImage}
                  alt={item.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] text-white font-bold shadow-sm ${item.categoryColor}`}>
                  {item.category}
                </div>
              </div>

              {/* コンテンツ（パディングを小さく） */}
              <div className="p-3">
                <div className="text-xs text-gray-500 mb-1">
                  {item.date}
                </div>
                <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {item.title.replace(/^［\d+］/, '')}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* 無限スクロールのトリガー要素 */}
        <div ref={sentinelRef} className="h-4" />

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-xs">読み込み中...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}