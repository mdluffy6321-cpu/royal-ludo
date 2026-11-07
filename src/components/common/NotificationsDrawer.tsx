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
      case 'match':
        return <Swords className="w-4 h-4 text-amber-400" />;
      case 'reward':
        return <Sparkles className="w-4 h-4 text-royal-gold" />;
      case 'tournament':
        return <Trophy className="w-4 h-4 text-purple-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md rounded-l-3xl glass-panel-gold border-l border-royal-gold/40 p-6 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-royal-border/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-royal-gold flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-royal text-lg font-bold text-white">Notifications</h2>
                <span className="text-[10px] text-slate-400">Realm announcements & match alerts</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playClick();
                  onMarkAllRead();
                }}
                title="Mark all as read"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Read all</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No new notifications in the realm.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    playClick();
                    onNotificationClick(notif);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-slate-900/60 border-royal-border/60 text-slate-300'
                      : 'bg-amber-950/30 border-royal-gold/50 text-white shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 mt-0.5">
                      {getIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-white truncate">
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-royal-gold animate-pulse shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-1.5">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-royal-border/80 text-center text-[11px] text-slate-500">
            Royal Ludo Notification Center
          </div>

        </div>
      </div>
    </div>
  );
};

