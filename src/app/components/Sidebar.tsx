import { Home, Newspaper, Calendar, Users, Building2, FileText, MessageSquare, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: 'ホーム', href: '#' },
  { icon: Newspaper, label: 'ニュース', href: '#', active: true },
  { icon: Calendar, label: '行事予定', href: '#' },
  { icon: Users, label: '各教室利用予定', href: '#' },
  { icon: Building2, label: '休講・振替授業情報', href: '#' },
  { icon: FileText, label: 'ご講義教室変更情報', href: '#' },
  { icon: MessageSquare, label: '教員全不在・連絡先オフィスアワー', href: '#' },
  { icon: Users, label: '教員連絡掲示板', href: '#' },
  { icon: Users, label: '学生相談室', href: '#' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-gray-800 text-white w-64 z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-700">
          <span className="font-bold">メニュー</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
