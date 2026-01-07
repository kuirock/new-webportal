import { useState, useEffect, useCallback } from 'react';
import {
  Bell, Calendar, ChevronRight, User, Coins, Shirt, Sparkles, X,
  ExternalLink, GraduationCap, Clock, Mic, Image as ImageIcon,
  MessageCircle, Edit3
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';

import { SplashScreen } from './components/SplashScreen';
import { NotificationScreen } from './components/NotificationScreen';
import { NewsDetailScreen } from './components/NewsDetailScreen';
import { CelebrationModal } from './components/CelebrationModal';
import { ChatbotButton } from './components/ChatbotButton';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NewsList } from './components/NewsList';
import { LinkGrid, LinkItem } from './components/LinkGrid';
import { EdiAvatar } from './components/EdiAvatar';
import { EdiChatWindow } from './components/EdiChatWindow';
import { ScheduleEditor, ClassItem } from './components/ScheduleEditor';
import { BusTimerWidget, CafeteriaWidget } from './components/CampusWidgets';

type Screen = 'splash' | 'notifications' | 'news-list' | 'news-detail';

const CHARACTER_PROFILE = {
  name: 'エディ',
  image: '/Edi_stand2.png',
};

// --- アイテム定義 ---
const AVATAR_ITEMS = [
  // 背景
  { id: 'bg_default', name: 'マイルーム', type: 'bg', rarity: 'N', cost: 0, icon: '🏠', image: '' },
  { id: 'bg_classroom', name: 'いつもの教室', type: 'bg', rarity: 'R', cost: 500, icon: '🏫', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80' },
  { id: 'bg_library', name: '静かな図書館', type: 'bg', rarity: 'R', cost: 500, icon: '📚', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80' },
  { id: 'bg_night', name: '夜のキャンパス', type: 'bg', rarity: 'SR', cost: 1000, icon: '🌃', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80' },
  { id: 'bg_forest', name: '野幌の森', type: 'bg', rarity: 'SR', cost: 1000, icon: '🌲', image: 'https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?auto=format&fit=crop&w=600&q=80' },
  // ボイス
  { id: 'voice_cheer', name: '応援ボイス', type: 'voice', rarity: 'N', cost: 300, icon: '📣', text: '諦めないで！私がついてるよ！' },
  { id: 'voice_tsundere', name: 'ツンデレな一言', type: 'voice', rarity: 'SR', cost: 1500, icon: '😤', text: 'べ、別にあんたの為に応援してるわけじゃないんだからね！' },
  { id: 'voice_worry', name: '心配ボイス', type: 'voice', rarity: 'R', cost: 800, icon: '🥺', text: '顔色悪いよ？ちゃんと休んでる？' },
  { id: 'voice_study', name: '勉強催促', type: 'voice', rarity: 'N', cost: 300, icon: '✏️', text: 'スマホばっかり見てないで、課題やろ？' },
  { id: 'voice_love', name: '秘密の告白', type: 'voice', rarity: 'SR', cost: 3000, icon: '💌', text: 'ずっと...先輩の隣にいたいな。' },
] as const;

const GACHA_COST = 100;

// --- ニュースデータ定義 ---
const categories = [
  { name: '学生生活', color: 'bg-pink-500', image: 'https://images.unsplash.com/photo-1693011142814-aa33d7d1535c?auto=format&fit=crop&w=400&q=80' },
  { name: '就職', color: 'bg-purple-500', image: 'https://images.unsplash.com/photo-1758518730162-09a142505bfd?auto=format&fit=crop&w=400&q=80' },
  { name: '重要', color: 'bg-gray-500', image: 'https://images.unsplash.com/photo-1610768861752-3c31563054d7?auto=format&fit=crop&w=400&q=80' },
  { name: 'イベント', color: 'bg-blue-500', image: 'https://images.unsplash.com/photo-1761503390713-a1fd8b8bb6c5?auto=format&fit=crop&w=400&q=80' },
  { name: '教務', color: 'bg-green-500', image: 'https://images.unsplash.com/photo-1608986596619-eb50cc56831f?auto=format&fit=crop&w=400&q=80' },
  { name: '図書館', color: 'bg-indigo-500', image: 'https://images.unsplash.com/photo-1706528010331-0f12582db334?auto=format&fit=crop&w=400&q=80' },
];

function generateNewsItem(id: number) {
  const templates = ['食堂利用券配布', 'アンケート実施', 'ランチ案内', '科目試験について', 'イベント募集', '奨学金について', '休講情報', '企業説明会', 'サークル勧誘', '落とし物のお知らせ', '図書館新着図書', 'システムメンテナンス', '留学説明会', 'ボランティア募集', '学園祭のお知らせ'];
  const category = categories[id % categories.length];
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(id / 2));
  return {
    id,
    date: `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`,
    category: category.name,
    categoryColor: category.color,
    categoryImage: category.image,
    title: `［${id}］${templates[id % templates.length]}`,
  };
}

// デフォルトリンク
const DEFAULT_LINKS: LinkItem[] = [
  { id: '1', title: '教務情報Webシステム', href: 'https://www.do-johodai.ac.jp/' },
  { id: '2', title: 'Gmail', href: 'https://mail.google.com/' },
  { id: '3', title: 'POLITE', href: 'https://polite.do-johodai.ac.jp/' },
  { id: '4', title: 'Microsoft365', href: 'https://www.office.com/' },
  { id: '5', title: 'シラバス検索', href: '#' },
  { id: '6', title: 'HIUアカウントパスワード変更', href: '#' },
  { id: '7', title: 'Googleドライブ', href: 'https://drive.google.com/' },
  { id: '8', title: 'I-Job(就職情報サイト)', href: '#' },
  { id: '9', title: '就職希望登録', href: '#' },
  { id: '10', title: '学習支援センター', href: '#' },
  { id: '11', title: '学生便覧', href: '#' },
  { id: '12', title: '感染症に関する届明書', href: '#' },
  { id: '13', title: '図書館', href: '#' },
  { id: '14', title: '情報センター', href: '#' },
  { id: '15', title: '公開資料', href: '#' },
  { id: '16', title: '証明書申請', href: '#' },
  { id: '17', title: '学生相談室', href: '#' },
  { id: '18', title: 'Zドライブ', href: '#' },
];

// デフォルト時間割
const DEFAULT_SCHEDULE: ClassItem[] = [
  { id: 'Mon-1', day: 'Mon', period: 1, title: '英語コミュニケーション', room: 'B-201' },
  { id: 'Mon-3', day: 'Mon', period: 3, title: 'データベース設計', room: 'A-301' },
  { id: 'Tue-2', day: 'Tue', period: 2, title: '線形代数', room: 'C-105' },
  { id: 'Wed-3', day: 'Wed', period: 3, title: 'プログラミング基礎', room: 'PC-1' },
  { id: 'Fri-4', day: 'Fri', period: 4, title: 'ゼミナール', room: '研究室' },
];

export default function App() {
  // --- ステート定義 ---
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [shouldShowSplash, setShouldShowSplash] = useState(true);

  // ニュース
  const [news, setNews] = useState(() => Array.from({ length: 15 }, (_, i) => generateNewsItem(i + 1)));
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [accessCount, setAccessCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // ローカルストレージ読み込みヘルパー
  const loadStorage = (key: string, def: any) => {
    if (typeof window === 'undefined') return def;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : def;
  };

  // ユーザーデータ
  const [points, setPoints] = useState<number>(() => loadStorage('userPoints', 1250));
  const [loginDays, setLoginDays] = useState<number>(() => loadStorage('userLoginDays', 1));
  const [inventory, setInventory] = useState<string[]>(() => loadStorage('userInventory', ["bg_default"]));
  const [equipped, setEquipped] = useState<any>(() => loadStorage('userEquipped', { bg: "bg_default" }));

  // リンク・チャット・スケジュール
  const [links, setLinks] = useState<LinkItem[]>(() => loadStorage('customLinks', DEFAULT_LINKS));
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [schedule, setSchedule] = useState<ClassItem[]>(() => loadStorage('userSchedule', DEFAULT_SCHEDULE));
  const [isScheduleEditorOpen, setIsScheduleEditorOpen] = useState(false);

  // ガチャ・モーダル
  const [showShopModal, setShowShopModal] = useState(false);
  const [gachaResult, setGachaResult] = useState<any>(null);

  // --- useEffect (保存・ロジック) ---
  useEffect(() => localStorage.setItem('userPoints', JSON.stringify(points)), [points]);
  useEffect(() => localStorage.setItem('userLoginDays', JSON.stringify(loginDays)), [loginDays]);
  useEffect(() => localStorage.setItem('userInventory', JSON.stringify(inventory)), [inventory]);
  useEffect(() => localStorage.setItem('userEquipped', JSON.stringify(equipped)), [equipped]);
  useEffect(() => localStorage.setItem('userSchedule', JSON.stringify(schedule)), [schedule]);
  useEffect(() => localStorage.setItem('customLinks', JSON.stringify(links)), [links]);

  const addPoints = (amount: number, reason: string) => {
    setPoints(prev => prev + amount);
    toast.success(`${reason} +${amount}pt`, { icon: '🪙', duration: 3000 });
  };

  // ログイン判定（1日1回スプラッシュ）
  useEffect(() => {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('lastLoginDate');

    if (lastLogin !== today) {
      localStorage.setItem('lastLoginDate', today);
      addPoints(50, 'ログインボーナス');
      setLoginDays(prev => prev + 1);
      setShouldShowSplash(true);
    } else {
      setShouldShowSplash(false);
      setCurrentScreen('news-list');
    }
  }, []);

  const handleLoadMoreNews = useCallback(() => {
    if (isNewsLoading) return;
    setIsNewsLoading(true);
    setTimeout(() => {
      setNews(prev => [...prev, ...Array.from({ length: 6 }, (_, i) => generateNewsItem(prev.length + i + 1))]);
      setIsNewsLoading(false);
    }, 800);
  }, [isNewsLoading]);

  const handleNewsClick = (newsItem: any) => {
    const newCount = accessCount + 1;
    setAccessCount(newCount);
    const isBonus = newCount % 10 === 0;
    addPoints(isBonus ? 100 : 10, isBonus ? 'キリ番ボーナス！' : 'ニュース閲覧');

    if (isBonus) setShowCelebration(true);
    setSelectedNews(newsItem);
    setCurrentScreen('news-detail');
    window.history.pushState({ screen: 'news-detail' }, '', '#detail');
  };

  useEffect(() => {
    const handlePopState = () => {
      if (currentScreen === 'news-detail') {
        setCurrentScreen('news-list');
        setSelectedNews(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentScreen]);

  const handleGacha = () => {
    if (points < GACHA_COST) {
      toast.error('ポイントが足りないよ！ニュースを見よう！');
      return;
    }
    setPoints(prev => prev - GACHA_COST);

    const unowned = AVATAR_ITEMS.filter(item => !inventory.includes(item.id));
    const pool = unowned.length > 0 ? unowned : AVATAR_ITEMS;
    const result = pool[Math.floor(Math.random() * pool.length)];

    if (!inventory.includes(result.id)) {
      setInventory(prev => [...prev, result.id]);
    }
    setGachaResult(result);
    toast.success(`${result.name}をゲット！`);
  };

  const getTodayClasses = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayKey = days[new Date().getDay()];
    return schedule
      .filter(c => c.day === todayKey)
      .sort((a, b) => a.period - b.period);
  };
  const todayClasses = getTodayClasses();

  const currentBgItem = AVATAR_ITEMS.find(i => i.id === equipped.bg);
  const currentBgImage = currentBgItem?.type === 'bg' ? (currentBgItem as any).image : '';
  const unlockedVoices = AVATAR_ITEMS
    .filter(item => item.type === 'voice' && inventory.includes(item.id))
    .map(item => (item as any).text);

  if (currentScreen === 'splash' && shouldShowSplash) return <SplashScreen onComplete={() => setCurrentScreen('notifications')} />;
  if (currentScreen === 'notifications') return <NotificationScreen onComplete={() => setCurrentScreen('news-list')} />;
  if (currentScreen === 'news-detail' && selectedNews) {
    return <><NewsDetailScreen news={selectedNews} onBack={() => window.history.back()} /><ChatbotButton /><Toaster /></>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* ★レイアウト修正: flexのみにして、サイドバーを左に寄せる */}
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full">
          {/* ★コンテンツエリアのみ中央寄せ */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* --- 左カラム: ニュース・リンク --- */}
              <div className="lg:col-span-8 space-y-10">
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <span className="bg-blue-600 w-1.5 h-8 rounded-full"></span>
                      新着ニュース
                    </h2>
                    <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                      {news.length}件の新着
                    </span>
                  </div>
                  <NewsList
                    news={news}
                    categories={categories}
                    onNewsClick={handleNewsClick}
                    onLoadMore={handleLoadMoreNews}
                    isLoading={isNewsLoading}
                  />
                </section>

                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <span className="bg-green-500 w-1.5 h-8 rounded-full"></span>
                      クイックアクセス
                    </h2>
                  </div>
                  <LinkGrid
                    links={links}
                    onLinksChange={setLinks}
                    defaultLinks={DEFAULT_LINKS}
                  />
                </section>
              </div>

              {/* --- 右カラム: My Desk --- */}
              <aside className="lg:col-span-4 space-y-6">
                <div className="sticky top-24 space-y-6">

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">My Desk</h3>
                          <p className="text-blue-100 text-xs flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" /> 情報メディア学科 1年
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <div className="text-2xl font-bold tracking-tight">{loginDays}</div>
                            <div className="text-[10px] text-blue-100 uppercase tracking-wider">Days</div>
                          </div>
                          <div className="w-px h-8 bg-blue-400/50"></div>
                          <div>
                            <div className="text-2xl font-bold tracking-tight">{points.toLocaleString()}</div>
                            <div className="text-[10px] text-blue-100 uppercase tracking-wider">Points</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-6 -mt-10 mx-auto w-4/5 relative">
                        <EdiAvatar
                          imageSrc={CHARACTER_PROFILE.image}
                          points={points}
                          isSidebarOpen={isSidebarOpen}
                          bgImage={currentBgImage}
                          unlockedVoices={unlockedVoices}
                        />

                        {/* ★ z-50 を追加してボタンを手前に表示 */}
                        <button
                          onClick={() => setIsChatOpen(true)}
                          className="absolute -bottom-3 -right-3 z-50 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform animate-bounce-slow"
                        >
                          <MessageCircle className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                          onClick={() => setShowShopModal(true)}
                          className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                        >
                          <Shirt className="w-5 h-5 text-gray-600 group-hover:text-blue-600 mb-1" />
                          <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600">ガチャ・設定</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all group">
                          <div className="relative">
                            <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 mb-1" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                          </div>
                          <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600">通知 (3)</span>
                        </button>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Today's Schedule
                          </h4>
                          <button
                            onClick={() => setIsScheduleEditorOpen(true)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            編集
                          </button>
                        </div>

                        <div className="space-y-2">
                          {todayClasses.length > 0 ? (
                            todayClasses.map((cls) => (
                              <div key={cls.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setIsScheduleEditorOpen(true)}>
                                <div className="w-10 text-center text-sm font-bold text-gray-400 group-hover:text-blue-500 transition-colors">
                                  {cls.period}限
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-bold text-gray-800">{cls.title}</div>
                                  <div className="text-xs text-gray-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                    {cls.room}
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-xs text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                              今日の授業はありません<br />
                              <span className="text-[10px]">（編集ボタンから登録してね！）</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-100 p-4">
                    <h3 className="text-sm font-bold text-orange-800 mb-1 flex items-center gap-2">
                      <span className="animate-pulse">🔥</span> Pickup
                    </h3>
                    <p className="text-xs text-orange-700 leading-relaxed mb-2">
                      次回のハッカソン参加者募集中！参加するだけで500ptゲットのチャンス！
                    </p>
                    <button className="text-xs font-bold text-orange-600 underline flex items-center gap-1">
                      詳細を見る <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <BusTimerWidget />
                  <CafeteriaWidget />

                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>

      <Toaster position="top-right" />

      {showCelebration && <CelebrationModal accessCount={accessCount} onClose={() => setShowCelebration(false)} />}

      {/* チャット機能連携 */}
      <EdiChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userName="情報 太郎"
        newsList={news}
        quickLinks={links}
        onOpenNews={handleNewsClick}
      />

      <ScheduleEditor
        isOpen={isScheduleEditorOpen}
        onClose={() => setIsScheduleEditorOpen(false)}
        schedule={schedule}
        onSave={(newSchedule) => setSchedule(newSchedule)}
      />

      {showShopModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-xl flex items-center gap-2 text-gray-800">
                <Shirt className="w-6 h-6 text-blue-600" />
                コレクション & ガチャ
              </h3>
              <button onClick={() => setShowShopModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              {gachaResult && (
                <div className="mb-8 p-6 bg-white rounded-2xl text-center border-2 border-yellow-200 shadow-lg animate-in zoom-in duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-yellow-50/50 opacity-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="relative">
                    <h4 className="text-yellow-600 font-bold mb-4 text-lg">NEW ITEM!</h4>
                    <div className="text-8xl mb-4 animate-bounce">{gachaResult.icon}</div>
                    <div className="font-bold text-2xl text-gray-800 mb-2">{gachaResult.name}</div>

                    {gachaResult.type === 'voice' && (
                      <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-sm font-bold mb-4">
                        「{(gachaResult as any).text}」
                      </div>
                    )}

                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4 ${gachaResult.rarity === 'SR' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-blue-400'
                      }`}>
                      Rarity: {gachaResult.rarity}
                    </div>
                    <button onClick={() => setGachaResult(null)} className="block mx-auto text-sm text-gray-400 hover:text-gray-600 underline">
                      戻る
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <button
                  onClick={handleGacha}
                  disabled={points < GACHA_COST}
                  className={`w-full py-4 rounded-2xl font-bold text-lg shadow-md transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${points >= GACHA_COST
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-xl hover:brightness-110'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <Sparkles className="w-6 h-6" />
                  ガチャを回す <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{GACHA_COST} pt</span>
                </button>
                <div className="flex justify-between items-center mt-2 px-1">
                  <p className="text-xs text-gray-500">※背景、ボイス、レアアイテムが出現</p>
                  <p className="text-sm font-bold text-gray-600">所持: {points} pt</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    背景コレクション
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {AVATAR_ITEMS.filter(item => item.type === 'bg' && inventory.includes(item.id)).map((item) => {
                      const isEquipped = equipped.bg === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setEquipped((prev: any) => ({ ...prev, bg: item.id }))}
                          className={`relative h-20 rounded-xl border-2 transition-all flex items-center justify-center gap-2 overflow-hidden ${isEquipped
                            ? 'border-blue-500 ring-2 ring-blue-100 ring-offset-2'
                            : 'border-gray-200 hover:border-gray-400'
                            }`}
                        >
                          {(item as any).image ? (
                            <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${(item as any).image})` }}></div>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-60"></div>
                          )}
                          <div className="relative z-10 flex items-center gap-1 font-bold text-gray-800 text-sm shadow-sm bg-white/80 px-2 py-1 rounded">
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                          </div>
                          {isEquipped && (
                            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-white z-10"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    解放済みボイス
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {AVATAR_ITEMS.filter(item => item.type === 'voice' && inventory.includes(item.id)).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="text-2xl">{item.icon}</div>
                        <div>
                          <div className="text-xs font-bold text-gray-500">{item.name}</div>
                          <div className="text-sm font-medium text-blue-900">「{(item as any).text}」</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
