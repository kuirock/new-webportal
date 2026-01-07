import { useState } from 'react';
import { X, Plus, Trash2, Save, BookOpen, MapPin } from 'lucide-react';

// 授業データの型定義
export interface ClassItem {
    id: string;
    day: string;    // 'Mon', 'Tue', ...
    period: number; // 1, 2, ...
    title: string;
    room: string;
}

interface ScheduleEditorProps {
    isOpen: boolean;
    onClose: () => void;
    schedule: ClassItem[];
    onSave: (newSchedule: ClassItem[]) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAY_LABELS = { Mon: '月', Tue: '火', Wed: '水', Thu: '木', Fri: '金' };
const PERIODS = [1, 2, 3, 4, 5, 6];

export function ScheduleEditor({ isOpen, onClose, schedule, onSave }: ScheduleEditorProps) {
    const [localSchedule, setLocalSchedule] = useState<ClassItem[]>(schedule);
    const [editingSlot, setEditingSlot] = useState<{ day: string, period: number } | null>(null);
    const [formData, setFormData] = useState({ title: '', room: '' });

    if (!isOpen) return null;

    // 指定したコマの授業を取得
    const getClass = (day: string, period: number) => {
        return localSchedule.find(c => c.day === day && c.period === period);
    };

    // 編集モード開始
    const handleEditClick = (day: string, period: number) => {
        const existing = getClass(day, period);
        setEditingSlot({ day, period });
        if (existing) {
            setFormData({ title: existing.title, room: existing.room });
        } else {
            setFormData({ title: '', room: '' });
        }
    };

    // 保存処理
    const handleSaveSlot = () => {
        if (!editingSlot || !formData.title) return;

        setLocalSchedule(prev => {
            // 既存の同枠を削除して追加（上書き）
            const filtered = prev.filter(c => !(c.day === editingSlot.day && c.period === editingSlot.period));
            return [...filtered, {
                id: `${editingSlot.day}-${editingSlot.period}`,
                day: editingSlot.day,
                period: editingSlot.period,
                title: formData.title,
                room: formData.room
            }];
        });
        setEditingSlot(null);
    };

    // 削除処理
    const handleDeleteSlot = () => {
        if (!editingSlot) return;
        setLocalSchedule(prev => prev.filter(c => !(c.day === editingSlot.day && c.period === editingSlot.period)));
        setEditingSlot(null);
    };

    // 全体保存して閉じる
    const handleSaveAll = () => {
        onSave(localSchedule);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

                {/* ヘッダー */}
                <div className="p-5 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-xl flex items-center gap-2 text-gray-800">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        時間割を編集
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* コンテンツ */}
                <div className="flex-1 overflow-auto p-6 bg-gray-50/50">

                    <div className="grid grid-cols-6 gap-2 min-w-[600px]">
                        {/* ヘッダー行（曜日） */}
                        <div className="col-span-1"></div>
                        {DAYS.map(day => (
                            <div key={day} className="text-center font-bold text-gray-600 py-2 bg-blue-50/50 rounded-lg">
                                {DAY_LABELS[day as keyof typeof DAY_LABELS]}
                            </div>
                        ))}

                        {/* 各時限の行 */}
                        {PERIODS.map(period => (
                            <>
                                {/* 時限ラベル */}
                                <div className="flex items-center justify-center font-bold text-gray-500 bg-gray-100 rounded-lg h-24">
                                    {period}限
                                </div>

                                {/* 各曜日のセル */}
                                {DAYS.map(day => {
                                    const classItem = getClass(day, period);
                                    return (
                                        <button
                                            key={`${day}-${period}`}
                                            onClick={() => handleEditClick(day, period)}
                                            className={`
                        relative h-24 p-2 rounded-xl border-2 text-left transition-all hover:scale-[1.02]
                        flex flex-col justify-center gap-1
                        ${classItem
                                                    ? 'bg-white border-blue-200 shadow-sm hover:border-blue-400'
                                                    : 'bg-gray-50 border-dashed border-gray-200 hover:bg-blue-50/30'
                                                }
                      `}
                                        >
                                            {classItem ? (
                                                <>
                                                    <div className="font-bold text-sm text-blue-900 line-clamp-2 leading-tight">
                                                        {classItem.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {classItem.room}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Plus className="w-6 h-6" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </>
                        ))}
                    </div>
                </div>

                {/* フッター */}
                <div className="p-4 border-t bg-white flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                        キャンセル
                    </button>
                    <button onClick={handleSaveAll} className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        保存して閉じる
                    </button>
                </div>
            </div>

            {/* 編集モーダル（子） */}
            {editingSlot && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] p-4 animate-in fade-in duration-100">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border-2 border-blue-100 space-y-4 animate-in zoom-in-95 duration-200">
                        <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">
                                {DAY_LABELS[editingSlot.day as keyof typeof DAY_LABELS]}曜 {editingSlot.period}限
                            </span>
                            の登録
                        </h4>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">講義名</label>
                                <input
                                    autoFocus
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="例: プログラミング基礎"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">教室</label>
                                <input
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="例: A-101"
                                    value={formData.room}
                                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => handleDeleteSlot()}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="削除"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <div className="flex-1 flex gap-2 justify-end">
                                <button
                                    onClick={() => setEditingSlot(null)}
                                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={handleSaveSlot}
                                    disabled={!formData.title}
                                    className="px-4 py-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    決定
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}