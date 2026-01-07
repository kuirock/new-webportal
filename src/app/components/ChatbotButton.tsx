import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'こんにちは！何かお困りですか？', sender: 'bot' as const },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    // ユーザーメッセージを追加
    const userMessage = { id: messages.length + 1, text: inputText, sender: 'user' as const };
    setMessages([...messages, userMessage]);

    // ボットの自動返信
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: 'ご質問ありがとうございます。担当者が確認して折り返しご連絡いたします。',
        sender: 'bot' as const,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);

    setInputText('');
  };

  return (
    <>
      {/* チャットボット吹き出しボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="チャットボットを開く"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* チャットウィンドウ */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[500px]">
          {/* ヘッダー */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg">
            <div className="font-bold">チャットサポート</div>
            <div className="text-xs text-blue-100">質問や困りごとをお聞かせください</div>
          </div>

          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 入力エリア */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="メッセージを入力..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                送信
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
