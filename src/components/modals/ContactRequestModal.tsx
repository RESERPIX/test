import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Building, 
  ShieldCheck, 
  User, 
  Users, 
  Globe, 
  ExternalLink,
  Check,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';

export interface ContactRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Subject type: user (individual author) or team (studio) */
  ownerType: 'user' | 'team';
  ownerName: string;
  /** Public team contacts (only rendered for team subjects per AC-CSP-010) */
  teamContacts?: {
    telegram?: string;
    vk?: string;
    website?: string;
    email?: string;
  };
  triggerToast?: (message: string, type?: any) => void;
}

export const ContactRequestModal: React.FC<ContactRequestModalProps> = ({
  isOpen,
  onClose,
  ownerType,
  ownerName,
  teamContacts = {
    telegram: '@nocturnal_biz',
    website: 'https://nocturnal.games',
    email: 'team@nocturnal.games',
    vk: 'https://vk.com/nocturnal'
  },
  triggerToast,
}) => {
  const [senderName, setSenderName] = useState('');
  const [organization, setOrganization] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [purpose, setPurpose] = useState('publishing'); // publishing, press, collaboration, localization, other
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !messageText.trim()) {
      if (triggerToast) triggerToast('Заполните обязательные поля формы', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (triggerToast) {
        triggerToast('Запрос успешно отправлен в личный кабинет автора', 'success');
      }
    }, 600);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setSenderName('');
    setOrganization('');
    setSenderEmail('');
    setMessageText('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={ownerType === 'team' ? `Контакты студии ${ownerName}` : `Связаться с автором ${ownerName}`}
      subtitle={
        ownerType === 'team'
          ? 'Официальные публичные каналы связи команды разработчиков'
          : 'Деловой запрос предложений и сотрудничества'
      }
      icon={ownerType === 'team' ? <Users className="w-5 h-5 text-accent" /> : <Mail className="w-5 h-5 text-accent" />}
      maxWidth="md"
    >
      <div className="flex flex-col gap-5 select-none pt-1">
        {/* PRIVACY NOTICE (BR-CSP-004, AC-CSP-009, AC-CSP-010) */}
        <div className="p-3.5 rounded-xl bg-surface-2 border border-borderDef flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center text-accent shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-accent" />
          </div>
          <div className="text-xs text-textSecondary leading-normal">
            {ownerType === 'team' ? (
              <span>
                Отображаются исключительно <strong>публичные контакты студии</strong>. Личные контакты и персональные данные участников команды защищены и не раскрываются.
              </span>
            ) : (
              <span>
                HUBIGR защищает приватность авторов. Персональный телефон и email автора скрыты. Ваш запрос будет доставлен в раздел <strong>Деловые запросы</strong> личного кабинета автора.
              </span>
            )}
          </div>
        </div>

        {/* TEAM PUBLIC CONTACTS VIEW (AC-CSP-010) */}
        {ownerType === 'team' ? (
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary">
              Публичные каналы команды
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teamContacts.email && (
                <div className="p-3 bg-surface-1 border border-borderDef rounded-xl flex items-center gap-3">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-textTertiary block">Email команды</span>
                    <span className="text-xs font-mono font-bold text-textPrimary truncate block">
                      {teamContacts.email}
                    </span>
                  </div>
                </div>
              )}
              {teamContacts.telegram && (
                <div className="p-3 bg-surface-1 border border-borderDef rounded-xl flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-[#0088cc] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-textTertiary block">Telegram</span>
                    <span className="text-xs font-mono font-bold text-textPrimary truncate block">
                      {teamContacts.telegram}
                    </span>
                  </div>
                </div>
              )}
              {teamContacts.website && (
                <div className="p-3 bg-surface-1 border border-borderDef rounded-xl flex items-center gap-3">
                  <Globe className="w-4 h-4 text-accent shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-textTertiary block">Сайт студии</span>
                    <a
                      href={teamContacts.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono font-bold text-accent hover:underline truncate block"
                    >
                      {teamContacts.website}
                    </a>
                  </div>
                </div>
              )}
              {teamContacts.vk && (
                <div className="p-3 bg-surface-1 border border-borderDef rounded-xl flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-textTertiary block">Сообщество VK</span>
                    <a
                      href={teamContacts.vk}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono font-bold text-accent hover:underline truncate block"
                    >
                      {teamContacts.vk}
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-3 border-t border-borderDef/60 mt-2">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Закрыть
              </Button>
            </div>
          </div>
        ) : (
          /* USER CONTACT REQUEST FLOW (AC-CSP-009) */
          isSuccess ? (
            <div className="p-6 bg-surface-2 rounded-2xl border border-borderDef text-center flex flex-col items-center gap-3 my-2">
              <div className="w-12 h-12 rounded-full bg-success/20 text-success flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-textPrimary">Запрос успешно отправлен!</h4>
              <p className="text-xs text-textSecondary max-w-sm leading-relaxed">
                Автор {ownerName} получил ваше предложение во входящих сообщениях Creator Dashboard. Ответ придёт на указанный вами email.
              </p>
              <Button type="button" variant="primary" size="sm" onClick={handleClose} className="mt-2">
                Понятно
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Алексей Смирнов"
                    className="h-10 bg-surface-2 border border-borderDef focus:border-accent text-xs px-3 rounded-xl outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary">
                    Организация / Студия
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Например: Indie Fund"
                    className="h-10 bg-surface-2 border border-borderDef focus:border-accent text-xs px-3 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary">
                    Email для ответа *
                  </label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="alex@publisher.com"
                    className="h-10 bg-surface-2 border border-borderDef focus:border-accent text-xs px-3 rounded-xl outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary">
                    Тема запроса
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="h-10 bg-surface-2 border border-borderDef focus:border-accent text-xs px-3 rounded-xl outline-none text-textPrimary"
                  >
                    <option value="publishing">Издательство и инвестиции</option>
                    <option value="press">Пресса, стриминг и обзор</option>
                    <option value="collaboration">Коллаборация разработчиков</option>
                    <option value="localization">Локализация и порт</option>
                    <option value="other">Другое деловое предложение</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary">
                  Сообщение автору *
                </label>
                <textarea
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Опишите суть предложения, сроки и условия сотрудничества..."
                  className="bg-surface-2 border border-borderDef focus:border-accent text-xs p-3 rounded-xl outline-none resize-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-borderDef/60">
                <Button type="button" variant="secondary" onClick={handleClose}>
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !senderName.trim() || !senderEmail.trim() || !messageText.trim()}
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить запрос'}
                </Button>
              </div>
            </form>
          )
        )}
      </div>
    </Modal>
  );
};

export default ContactRequestModal;
