import React from 'react';
import { AppNotification } from '../../types';
import { useSound } from '../../context/SoundContext';
import { X, Bell, Check, Sparkles, Swords, Trophy, Info } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onNotificationClick: (notif: AppNotification) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onNotificationClick,
}) => {
  const { playClick } = useSound();

  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'match': return <Swords className="w-4 h-4 text-[#4A87D6]" />;
      case 'reward': return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'tournament': return <Trophy className="w-4 h-4 text-[#D4A7D7]" />;
      default: return <Info className="w-4 h-4 text-[#6E6962]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 animate-in fade-in duration-200" onClick={onClose}>
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10" onClick={e => e.stopPropagation()}>
        <div className="w-screen max-w-md bg-[#FFFFFF] border-l border-[#DDD6CB] p-6 flex flex-col shadow-xl">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#DDD6CB]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F7F4ED] border border-[#DDD6CB] flex items-center justify-center">
                <Bell className="w-4 h-4 text-[#6E6962]" />
              </div>
              <div>
                <h2 className="text-base font-black text-[#000000] tracking-tight">Notifications</h2>
                <span className="text-[10px] text-[#6E6962]">Alerts & announcements</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { playClick(); onMarkAllRead(); }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-xs text-[#6E6962] hover:border-[#000000] hover:text-[#000000] transition-all"
              >
                <Check className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
              <button
                onClick={() => { playClick(); onClose(); }}
                className="p-1.5 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-[#6E6962] hover:border-[#000000] hover:text-[#000000] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-[#6E6962]">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No new notifications.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => { playClick(); onNotificationClick(notif); }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all hover:border-[#000000] ${
                    notif.read
                      ? 'bg-[#FFFFFF] border-[#DDD6CB] text-[#6E6962]'
                      : 'bg-[#F7F4ED] border-[#DDD6CB] text-[#000000]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#F7F4ED] border border-[#DDD6CB] mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-[#000000] truncate">{notif.title}</span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#000000] shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-[#6E6962] leading-relaxed mb-1.5">{notif.message}</p>
                      <span className="text-[10px] text-[#6E6962] font-mono">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-[#DDD6CB] text-center text-[11px] text-[#6E6962]">
            Royal Ludo — Notification Center
          </div>
        </div>
      </div>
    </div>
  );
};
