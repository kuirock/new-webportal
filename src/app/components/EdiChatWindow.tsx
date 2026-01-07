import { useState, useRef, useEffect } from 'react';
import { Send, X, User, ExternalLink, ArrowRight } from 'lucide-react'; // Botアイコンは削除したよ
import { LinkItem } from './LinkGrid';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'edi';
    timestamp: Date;
    link?: { title: string; href: string };
    newsItem?: any;
}

interface EdiChatWindowProps {
    isOpen: boolean;
    onClose: () => void;
    userName?: string;
    newsList: any[];
    quickLinks: LinkItem[];
    onOpenNews: (news: any) => void;
}

export function EdiChatWindow({ isOpen, onClose, userName = '先輩', newsList = [], quickLinks = [], onOpenNews }: EdiChatWindowProps) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `あ、${userName}！何か手伝うことある？\nクイックアクセスにあるリンクなら「〜開いて」ですぐ開けるよ！`,
            sender: 'edi',
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // ★ここでエディちゃんの画像パスを指定！
    const EDI_IMAGE_SRC = '/public/Edi_stand2.png';

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            let replyText = '';
            let linkData = undefined;
            let targetNews = undefined;

            // --- エディちゃんの推論ロジック ---

            // 1. リンク検索
            const targetLink = quickLinks.find(link =>
                input.toLowerCase().includes(link.title.toLowerCase()) ||
                (input.includes('メール') && link.title.includes('Gmail')) ||
                (input.includes('ポライト') && link.title.includes('POLITE'))
            );

            const isLinkRequest = input.includes('開いて') || input.includes('行きたい') || input.includes('見たい');
            const isNewsRequest = input.includes('ニュース') || input.includes('お知らせ');

            if (targetLink && isLinkRequest) {
                window.open(targetLink.href, '_blank');
                replyText = `${targetLink.title} を開いたよ！\nいってらっしゃい！👋`;
                linkData = { title: targetLink.title, href: targetLink.href };

            } else if (isNewsRequest) {
                const keywords = ['奨学金', '休講', 'イベント', '試験', '食堂', 'バス', '留学'];
                const targetKeyword = keywords.find(k => input.includes(k));

                if (targetKeyword) {
                    const foundNews = newsList.find(n => n.title.includes(targetKeyword));

                    if (foundNews) {
                        replyText = `「${targetKeyword}」に関して、こんなニュースがあったよ！\n気になったら詳細を見てみてね！`;
                        targetNews = foundNews;
                    } else {
                        replyText = `うーん、「${targetKeyword}」に関する新しいニュースは見当たらないかも...🤔`;
                    }
                } else {
                    replyText = '最新のニュースだね！一番新しいのはこれかな？';
                    targetNews = newsList[0];
                }

            } else {
                // 通常会話
                if (input.includes('こんにちは') || input.includes('おはよう')) {
                    replyText = '元気そうで何より！今日も頑張ろうね！✨';
                } else if (input.includes('疲れた')) {
                    replyText = 'お疲れ様！甘いものでも食べて休憩しよ？🍫';
                } else if (input.includes('ありがとう')) {
                    replyText = 'どういたしまして！またいつでも呼んでね！';
                } else {
                    const randoms = ['うんうん、それで？', 'なるほどね〜！', 'もっと詳しく教えて！', 'それって情報の授業で習ったやつ？'];
                    replyText = randoms[Math.floor(Math.random() * randoms.length)];
                }
            }

            const ediMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: replyText,
                sender: 'edi',
                timestamp: new Date(),
                link: linkData,
                newsItem: targetNews
            };

            setMessages(prev => [...prev, ediMsg]);
            setIsTyping(false);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md h-[600px] max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border-4 border-blue-50 relative">

                {/* ヘッダー */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 flex items-center justify-between text-white shrink-0">
                    <div className="flex items-center gap-3">
                        {/* ★ヘッダーアイコン：エディちゃんの画像 */}
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 bg-white">
                            <img src={EDI_IMAGE_SRC} alt="Edi" className="w-full h-full object-cover object-top" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">エディ</h3>
                            <div className="flex items-center gap-1 text-xs text-blue-100">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Online
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* チャットエリア */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4" ref={scrollRef}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            {/* ★メッセージアイコン：ユーザーかエディちゃんかで分岐 */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border overflow-hidden ${msg.sender === 'user'
                                ? 'bg-gray-200 border-gray-300 text-gray-600'
                                : 'bg-white border-blue-200'
                                }`}>
                                {msg.sender === 'user' ? (
                                    <User className="w-4 h-4" />
                                ) : (
                                    <img src={EDI_IMAGE_SRC} alt="Edi" className="w-full h-full object-cover object-top" />
                                )}
                            </div>

                            {/* 吹き出し */}
                            <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}>
                                {msg.text}

                                {/* リンクボタン */}
                                {msg.link && (
                                    <a
                                        href={msg.link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        {msg.link.title}を開く
                                    </a>
                                )}

                                {/* ニュース詳細ボタン */}
                                {msg.newsItem && (
                                    <button
                                        onClick={() => {
                                            onOpenNews(msg.newsItem);
                                            onClose();
                                        }}
                                        className="mt-2 w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="text-xs text-blue-500 font-bold mb-1">{msg.newsItem.category}</div>
                                        <div className="font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 mb-2">{msg.newsItem.title}</div>
                                        <div className="flex items-center text-xs text-gray-400 font-bold gap-1">
                                            詳細を見る <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </button>
                                )}

                                <span className={`text-[10px] block mt-1 text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                                    }`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* 入力中インジケーター */}
                    {isTyping && (
                        <div className="flex items-end gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-200 bg-white">
                                <img src={EDI_IMAGE_SRC} alt="Edi" className="w-full h-full object-cover object-top" />
                            </div>
                            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 入力エリア */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="メッセージを入力..."
                            className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex items-center justify-center"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}