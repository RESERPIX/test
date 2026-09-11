import React, { useState } from 'react';
import Drawer from '../ui/Drawer';
import Button from '../ui/Button';
import SegmentedControl from '../ui/SegmentedControl';
import { 
  ArrowRightLeft, 
  Check, 
  X, 
  Clock, 
  User, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Gamepad2, 
  Info,
  ShieldCheck,
  History,
  Trash2
} from 'lucide-react';

export interface GameTransferItem {
  id: string;
  gameId: string;
  gameTitle: string;
  gameSlug: string;
  gameCover?: string;
  fromSubject: {
    type: 'user' | 'team';
    name: string;
    identifier: string; // @username or team-slug
  };
  toSubject: {
    type: 'user' | 'team';
    name: string;
    identifier: string;
  };
  monetizationType: 'free' | 'pwyw' | 'paid';
  price?: string;
  requiresSellerVerification?: boolean;
  recipientHasSellerProfile?: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
  direction: 'incoming' | 'outgoing';
}

export interface GameTransferAuditRecord {
  id: string;
  gameTitle: string;
  gameSlug: string;
  fromSubject: string;
  toSubject: string;
  initiatedBy: string;
  date: string;
  status: 'accepted' | 'rejected' | 'cancelled';
}

export interface GameTransfersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transfers: GameTransferItem[];
  auditLogs?: GameTransferAuditRecord[];
  onAcceptTransfer: (transfer: GameTransferItem) => void;
  onRejectTransfer: (transfer: GameTransferItem) => void;
  onCancelTransfer: (transfer: GameTransferItem) => void;
  onOpenSellerVerification?: () => void;
  onToggleSellerVerification?: (transferId: string) => void;
}

export const GameTransfersDrawer: React.FC<GameTransfersDrawerProps> = ({
  isOpen,
  onClose,
  transfers,
  auditLogs = [],
  onAcceptTransfer,
  onRejectTransfer,
  onCancelTransfer,
  onOpenSellerVerification,
  onToggleSellerVerification,
}) => {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'history'>('incoming');

  const incomingTransfers = transfers.filter(t => t.direction === 'incoming' && t.status === 'pending');
  const outgoingTransfers = transfers.filter(t => t.direction === 'outgoing' && t.status === 'pending');

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Трансферы проектов"
      subtitle="Центр подтверждения и передачи прав владения играми"
      icon={<ArrowRightLeft className="w-5 h-5 text-accent" />}
      size="lg"
    >
      <div className="flex flex-col h-full space-y-5">
        
        {/* Информационный баннер об инвариантах платформы (BR-ACC-047, BR-ACC-049) */}
        <div className="p-3.5 bg-surface-2 border border-borderDef rounded-control flex items-start gap-3 text-xs text-textSecondary">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed font-sans">
            <p className="font-semibold text-textPrimary">Правило единого владельца (User | Team)</p>
            <p>
              Игра в каждый момент времени принадлежит ровно одному субъекту. До момента принятия входящего запроса текущий владелец сохраняет все права. Долевое владение платформой не поддерживается.
            </p>
          </div>
        </div>

        {/* Переключатель вкладок: Входящие / Исходящие / История владения */}
        <SegmentedControl
          value={activeTab}
          onChange={(val) => setActiveTab(val as 'incoming' | 'outgoing' | 'history')}
          items={[
            { 
              key: 'incoming', 
              label: 'Входящие заявки',
              count: incomingTransfers.length
            },
            { 
              key: 'outgoing', 
              label: 'Исходящие заявки',
              count: outgoingTransfers.length
            },
            {
              key: 'history',
              label: 'Журнал аудита',
              count: auditLogs.length
            }
          ]}
        />

        {/* =========================================================================
            ВКЛАДКА 1: ВХОДЯЩИЕ ЗАЯВКИ (ACC-API-042, ACC-API-043, ACC-API-044)
            ========================================================================= */}
        {activeTab === 'incoming' && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1 animate-fadeIn">
            {incomingTransfers.length > 0 ? (
              incomingTransfers.map((t) => {
                const isPaid = t.monetizationType === 'paid';
                const sellerOk = t.recipientHasSellerProfile ?? false;

                return (
                  <div 
                    key={t.id} 
                    className="p-4 bg-surface-1 border border-borderDef hover:border-accent/40 rounded-card space-y-3.5 transition-all shadow-sm"
                  >
                    {/* Шапка карточки игры */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-lg bg-surface-2 border border-borderDef flex items-center justify-center overflow-hidden shrink-0">
                          {t.gameCover ? (
                            <img src={t.gameCover} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Gamepad2 className="w-5 h-5 text-accent" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-textPrimary text-sm truncate">{t.gameTitle}</h4>
                          <span className="text-[11px] font-mono text-textTertiary">/games/{t.gameSlug}</span>
                        </div>
                      </div>

                      {/* Бейдж монетизации */}
                      {isPaid ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent/10 text-accent border border-accent/20 shrink-0 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> Платная {t.price ? `(${t.price})` : ''}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-textTertiary bg-surface-2 border border-borderDef shrink-0">
                          Бесплатная
                        </span>
                      )}
                    </div>

                    {/* Субъекты передачи */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-surface-0 p-2.5 rounded-control border border-borderDef">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-textTertiary block">Текущий владелец</span>
                        <div className="flex items-center gap-1.5 font-medium text-textPrimary mt-0.5 truncate">
                          {t.fromSubject.type === 'team' ? <Users className="w-3.5 h-3.5 text-info shrink-0" /> : <User className="w-3.5 h-3.5 text-textSecondary shrink-0" />}
                          <span className="truncate">{t.fromSubject.name}</span>
                          <span className="text-textTertiary font-mono text-[11px]">({t.fromSubject.identifier})</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase text-textTertiary block">Назначенный получатель</span>
                        <div className="flex items-center gap-1.5 font-medium text-textPrimary mt-0.5 truncate">
                          {t.toSubject.type === 'team' ? <Users className="w-3.5 h-3.5 text-accent shrink-0" /> : <User className="w-3.5 h-3.5 text-accent shrink-0" />}
                          <span className="truncate">{t.toSubject.name}</span>
                          <span className="text-textTertiary font-mono text-[11px]">({t.toSubject.identifier})</span>
                        </div>
                      </div>
                    </div>

                    {/* Проверка Seller Boundary (BR-ACC-051, FR-ACC-048) */}
                    {isPaid && (
                      <div className={`p-3 rounded-control border text-xs flex flex-col gap-2.5 ${
                        sellerOk 
                          ? 'bg-success/5 border-success/30 text-success' 
                          : 'bg-warning/10 border-warning/30 text-warning'
                      }`}>
                        <div className="flex items-start gap-2.5">
                          {sellerOk ? (
                            <>
                              <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
                              <div className="text-textSecondary">
                                <span className="font-bold text-textPrimary">Seller Profile верифицирован: </span>
                                Продажи игры и коммерческие выплаты продолжатся без задержек.
                              </div>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                              <div className="text-textSecondary">
                                <span className="font-bold text-warning">Отсутствует Seller Profile (BR-ACC-051): </span>
                                Для принятия прав на платную игру получатель должен иметь подтверждённый статус продавца. 
                              </div>
                            </>
                          )}
                        </div>

                        {!sellerOk && (
                          <div className="flex items-center gap-2 pt-1 border-t border-warning/20">
                            {onOpenSellerVerification && (
                              <button
                                type="button"
                                onClick={onOpenSellerVerification}
                                className="px-2.5 py-1 bg-warning text-surface-0 font-bold rounded text-[11px] hover:bg-warning/90 transition-colors cursor-pointer"
                              >
                                Подключить Seller Profile
                              </button>
                            )}
                            {onToggleSellerVerification && (
                              <button
                                type="button"
                                onClick={() => onToggleSellerVerification(t.id)}
                                className="px-2.5 py-1 bg-surface-2 hover:bg-surface-3 text-textPrimary font-mono rounded text-[11px] transition-colors cursor-pointer"
                              >
                                Симулировать верификацию
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Время и кнопки принятия / отклонения */}
                    <div className="flex items-center justify-between pt-2 border-t border-borderDef/60 flex-wrap gap-2">
                      <span className="text-[11px] font-mono text-textTertiary flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Получено {t.createdAt}
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onRejectTransfer(t)}
                        >
                          <X className="w-3.5 h-3.5 mr-1" /> Отклонить
                        </Button>
                        <Button
                          variant={isPaid && !sellerOk ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => onAcceptTransfer(t)}
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Принять права
                        </Button>
                      </div>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center text-textTertiary text-xs space-y-2 border border-dashed border-borderDef rounded-card bg-surface-1">
                <ArrowRightLeft className="w-8 h-8 mx-auto text-textTertiary/60 mb-2" />
                <p className="font-bold text-textSecondary text-sm">Нет входящих заявок</p>
                <p className="text-[11px] text-textTertiary max-w-xs mx-auto">
                  Когда другие авторы или команды предложат передать вам проект, уведомление появится здесь.
                </p>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            ВКЛАДКА 2: ИСХОДЯЩИЕ ЗАЯВКИ (ACC-API-042, CANCEL FLOW)
            ========================================================================= */}
        {activeTab === 'outgoing' && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1 animate-fadeIn">
            {outgoingTransfers.length > 0 ? (
              outgoingTransfers.map((t) => (
                <div 
                  key={t.id} 
                  className="p-4 bg-surface-1 border border-borderDef rounded-card space-y-3.5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-surface-2 border border-borderDef flex items-center justify-center overflow-hidden shrink-0">
                        {t.gameCover ? (
                          <img src={t.gameCover} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Gamepad2 className="w-5 h-5 text-accent" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-textPrimary text-sm truncate">{t.gameTitle}</h4>
                        <span className="text-[11px] font-mono text-textTertiary">/games/{t.gameSlug}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-warning/10 text-warning border border-warning/20 shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Ожидает ответа
                    </span>
                  </div>

                  <div className="bg-surface-0 p-2.5 rounded-control border border-borderDef text-xs">
                    <span className="text-[10px] font-bold uppercase text-textTertiary block">Запрос направлен получателю</span>
                    <div className="flex items-center gap-1.5 font-medium text-textPrimary mt-0.5">
                      {t.toSubject.type === 'team' ? <Users className="w-3.5 h-3.5 text-accent shrink-0" /> : <User className="w-3.5 h-3.5 text-accent shrink-0" />}
                      <span>{t.toSubject.name}</span>
                      <span className="text-textTertiary font-mono text-[11px]">({t.toSubject.identifier})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-borderDef/60 flex-wrap gap-2">
                    <span className="text-[11px] font-mono text-textTertiary flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Отправлено {t.createdAt}
                    </span>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onCancelTransfer(t)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Отозвать запрос
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-textTertiary text-xs space-y-2 border border-dashed border-borderDef rounded-card bg-surface-1">
                <CheckCircle2 className="w-8 h-8 mx-auto text-textTertiary/60 mb-2" />
                <p className="font-bold text-textSecondary text-sm">Нет ожидающих исходящих запросов</p>
                <p className="text-[11px] text-textTertiary max-w-xs mx-auto">
                  Инициируйте передачу владения из меню любой вашей игры в Кабинете автора или на странице профиля.
                </p>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            ВКЛАДКА 3: ЖУРНАЛ АУДИТА ИСТОРИИ ВЛАДЕНИЯ (BR-ACC-050, FR-ACC-047)
            ========================================================================= */}
        {activeTab === 'history' && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1 animate-fadeIn">
            <div className="flex items-center justify-between gap-2 text-xs font-mono text-textTertiary pb-1 border-b border-borderDef">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-textSecondary">
                <History className="w-4 h-4 text-accent" /> Журнал аудита смены владельцев
              </span>
              <span>BR-ACC-050 Immutable</span>
            </div>

            {auditLogs.length > 0 ? (
              <div className="space-y-2.5">
                {auditLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="p-3.5 bg-surface-1 border border-borderDef rounded-control text-xs space-y-2 hover:bg-surface-2/60 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-textPrimary text-sm font-sans">{log.gameTitle}</span>
                      {log.status === 'accepted' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/10 text-success border border-success/20">
                          Завершено (Accepted)
                        </span>
                      ) : log.status === 'rejected' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-textTertiary bg-surface-2 border border-borderDef">
                          Отклонено (Rejected)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-warning bg-warning/10 border border-warning/20">
                          Отозвано (Cancelled)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-textSecondary font-mono text-[11px] flex-wrap">
                      <span className="text-textPrimary">{log.fromSubject}</span>
                      <ArrowRightLeft className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="text-accent font-bold">{log.toSubject}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-borderDef/50 text-[11px] font-mono text-textTertiary">
                      <span>Инициатор: {log.initiatedBy}</span>
                      <span>{log.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-textTertiary text-xs space-y-2 border border-dashed border-borderDef rounded-card bg-surface-1">
                <History className="w-8 h-8 mx-auto text-textTertiary/60 mb-2" />
                <p className="font-bold text-textSecondary text-sm">Журнал аудита пуст</p>
                <p className="text-[11px] text-textTertiary max-w-xs mx-auto">
                  История всех успешно завершённых и отклонённых передач прав на ваши проекты сохраняется здесь.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </Drawer>
  );
};

export default GameTransfersDrawer;
