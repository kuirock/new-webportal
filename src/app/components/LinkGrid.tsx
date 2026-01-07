import { ExternalLink, Plus, Edit2, Trash2, GripVertical, RotateCcw } from 'lucide-react';
import { useState, useRef } from 'react';

// Linkの型定義をexportして他でも使えるようにする
export interface LinkItem {
  id: string;
  title: string;
  href: string;
}

// デフォルトリンクのデータは App.tsx に移動するから、ここでは受け取る形にするよ！

interface LinkGridProps {
  links: LinkItem[];              // 親からリンク一覧をもらう
  onLinksChange: (links: LinkItem[]) => void; // 変更したら親に伝える
  defaultLinks: LinkItem[];       // デフォルトデータも親からもらう
}

export function LinkGrid({ links, onLinksChange, defaultLinks }: LinkGridProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [formData, setFormData] = useState({ title: '', href: '' });
  const [activeTab, setActiveTab] = useState<'custom' | 'preset'>('custom');

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // リンクを追加
  const handleAddCustom = () => {
    if (!formData.title || !formData.href) return;
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: formData.title,
      href: formData.href,
    };
    onLinksChange([...links, newLink]);
    setFormData({ title: '', href: '' });
    setShowAddModal(false);
  };

  // デフォルトから復元
  const handleRestore = (defLink: LinkItem) => {
    const newLink: LinkItem = {
      ...defLink,
      id: Date.now().toString(),
    };
    onLinksChange([...links, newLink]);
  };

  // 更新
  const handleUpdate = () => {
    if (!editingLink || !formData.title || !formData.href) return;
    const updatedLinks = links.map(link =>
      link.id === editingLink.id
        ? { ...link, title: formData.title, href: formData.href }
        : link
    );
    onLinksChange(updatedLinks);
    setFormData({ title: '', href: '' });
    setEditingLink(null);
    setShowAddModal(false);
  };

  // 削除
  const handleDelete = (id: string) => {
    if (confirm('このリンクを削除してもよろしいですか？')) {
      onLinksChange(links.filter(link => link.id !== id));
    }
  };

  // 並び替え
  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const _links = [...links];
    const draggedItemContent = _links.splice(dragItem.current, 1)[0];
    _links.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    onLinksChange(_links);
  };

  // 未追加のデフォルトリンクを計算
  const unaddedLinks = defaultLinks.filter(def =>
    !links.some(l => l.title === def.title && l.href === def.href)
  );

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg transition-colors ${isEditing
              ? 'bg-gray-500 hover:bg-gray-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
        >
          {isEditing ? '編集終了' : 'リンク編集'}
        </button>
        {isEditing && (
          <button
            onClick={() => {
              setEditingLink(null);
              setFormData({ title: '', href: '' });
              setActiveTab('custom');
              setShowAddModal(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            追加
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {links.map((link, index) => (
          <div
            key={link.id}
            draggable={isEditing}
            onDragStart={() => (dragItem.current = index)}
            onDragEnter={() => (dragOverItem.current = index)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
            className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all relative group ${isEditing ? 'cursor-move hover:shadow-md border-blue-200 border-2 border-dashed' : 'hover:shadow-md'
              }`}
          >
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <div className="text-sm text-gray-700 font-medium truncate">{link.title}</div>
                </div>
                <div className="flex gap-2 pl-6">
                  <button
                    onClick={() => {
                      setEditingLink(link);
                      setFormData({ title: link.title, href: link.href });
                      setActiveTab('custom');
                      setShowAddModal(true);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    削除
                  </button>
                </div>
              </div>
            ) : (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between">
                <span className="text-sm text-blue-600 group-hover:text-blue-700">{link.title}</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </a>
            )}
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] flex flex-col">
            <h3 className="text-xl font-bold mb-4">{editingLink ? 'リンクを編集' : 'リンクを追加'}</h3>

            {!editingLink && (
              <div className="flex border-b mb-4">
                <button
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'custom' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('custom')}
                >
                  手動入力
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'preset' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('preset')}
                >
                  デフォルトから追加
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto min-h-0">
              {activeTab === 'custom' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: Gmail" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input type="text" value={formData.href} onChange={(e) => setFormData({ ...formData, href: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: https://..." />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {unaddedLinks.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">すべてのデフォルトリンクが追加済みです</div>
                  ) : (
                    unaddedLinks.map((link) => (
                      <button key={link.id} onClick={() => handleRestore(link)} className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all group">
                        <span className="text-sm text-gray-700 font-medium">{link.title}</span>
                        <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="w-4 h-4" /><span className="text-xs font-bold">追加</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => { setShowAddModal(false); setEditingLink(null); setFormData({ title: '', href: '' }); }} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors">
                {activeTab === 'preset' && !editingLink ? '閉じる' : 'キャンセル'}
              </button>
              {activeTab === 'custom' && (
                <button onClick={editingLink ? handleUpdate : handleAddCustom} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  {editingLink ? '更新' : '追加'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}