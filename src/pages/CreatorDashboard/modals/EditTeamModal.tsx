import React, { useState, useEffect } from 'react';
import { 
  Settings, Upload, Save, Building, Ghost, Globe, Briefcase, 
  Users, Mail, Send, EyeOff, ShieldCheck, Heart, AlertCircle, Plus, Trash2 
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Team, TeamType, TeamContacts, TeamSupportLink, TeamSettings } from '../../../types/team';

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | any;
  onEditTeam: (data: { 
    name: string; 
    slug: string; 
    type?: TeamType;
    customType?: string;
    description: string;
    logo?: string;
    contacts?: TeamContacts;
    supportLinks?: TeamSupportLink[];
    settings?: TeamSettings;
  }) => void;
}

const TEAM_TYPE_OPTIONS: Array<{
  type: TeamType;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { type: 'indie_team', label: 'Инди-команда', desc: 'Коллектив авторов', icon: Ghost },
  { type: 'studio', label: 'Студия', desc: 'Студия разработки проектов', icon: Building },
  { type: 'collective', label: 'Объединение', desc: 'Свободное сообщество', icon: Users },
  { type: 'company_organization', label: 'Компания / Организация', desc: 'Юридическое лицо', icon: Briefcase },
  { type: 'other', label: 'Другое', desc: 'Иной формат союза', icon: Globe },
];

export const EditTeamModal: React.FC<EditTeamModalProps> = ({ isOpen, onClose, team, onEditTeam }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'contacts' | 'support' | 'settings'>('general');

  // General fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<TeamType>('indie_team');
  const [customType, setCustomType] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [error, setError] = useState('');

  // Contacts fields
  const [telegram, setTelegram] = useState('');
  const [vk, setVk] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  // Support links fields
  const [supportLinks, setSupportLinks] = useState<TeamSupportLink[]>([]);
  const [newPlatform, setNewPlatform] = useState('Boosty');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Visibility Settings
  const [hideMembers, setHideMembers] = useState(false);
  const [hideJamAchievements, setHideJamAchievements] = useState(false);

  useEffect(() => {
    if (isOpen && team) {
      setName(team.name || '');
      setSlug(team.slug || '');
      setType(team.type || 'indie_team');
      setCustomType(team.customType || '');
      setDescription(team.description || '');
      setLogo(team.logo || '');
      setError('');

      setTelegram(team.contacts?.telegram || '');
      setVk(team.contacts?.vk || '');
      setEmail(team.contacts?.email || '');
      setWebsite(team.contacts?.website || '');

      setSupportLinks(team.supportLinks || [
        { id: '1', platform: 'Boosty', url: 'https://boosty.to/studio', verified: true, desc: 'Ранний доступ к билдам' }
      ]);

      setHideMembers(team.settings?.hideMembers || false);
      setHideJamAchievements(team.settings?.hideJamAchievements || false);
      setActiveTab('general');
    }
  }, [isOpen, team]);

  if (!isOpen || !team) return null;

  const handleAddSupportLink = () => {
    if (!newUrl.trim()) return;
    const newLink: TeamSupportLink = {
      id: `sup_${Date.now()}`,
      platform: newPlatform,
      url: newUrl.trim(),
      verified: true, // Auto-verified in prototype
      desc: newDesc.trim() || undefined
    };
    setSupportLinks(prev => [...prev, newLink]);
    setNewUrl('');
    setNewDesc('');
  };

  const handleRemoveSupportLink = (id: string) => {
    setSupportLinks(prev => prev.filter(l => l.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Укажите название команды');
      setActiveTab('general');
      return;
    }
    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    onEditTeam({ 
      name: name.trim(), 
      slug: finalSlug, 
      type,
      customType: type === 'other' ? customType.trim() : undefined,
      description: description.trim(),
      logo,
      contacts: {
        telegram: telegram.trim() || undefined,
        vk: vk.trim() || undefined,
        email: email.trim() || undefined,
        website: website.trim() || undefined
      },
      supportLinks,
      settings: {
        hideMembers,
        hideJamAchievements
      }
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Настройки профиля команды"
      subtitle="Управление публичной информацией, классификацией, контактами и донатами"
      icon={<Settings className="w-5 h-5 text-accent" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-textPrimary font-sans">
        {/* TAB NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-borderDef pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'general', label: 'Основное' },
            { id: 'contacts', label: 'Контакты' },
            { id: 'support', label: 'Поддержка / Донаты' },
            { id: 'settings', label: 'Публичность блоков' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-control text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface-2 text-textSecondary hover:text-textPrimary hover:bg-surface-3'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ОСНОВНОЕ */}
        {activeTab === 'general' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-caption font-mono uppercase font-bold text-textSecondary block mb-1">
                  Название команды *
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  className="w-full h-10 bg-surface-2 border border-borderDef focus:border-accent text-textPrimary px-3 rounded-control text-xs outline-none"
                  required
                />
                {error && <p className="text-caption font-mono text-danger mt-1">{error}</p>}
              </div>

              <div>
                <label className="text-caption font-mono uppercase font-bold text-textSecondary block mb-1">
                  URL Слэг команды *
                </label>
                <div className="flex items-center h-10 bg-surface-2 border border-borderDef focus-within:border-accent rounded-control px-3 text-xs font-mono">
                  <span className="text-textTertiary shrink-0">hubigr.com/teams/</span>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    className="w-full bg-transparent text-accent font-semibold outline-none pl-1"
                    required
                  />
                </div>
                {team.slug && slug !== team.slug && (
                  <p className="text-[11px] font-mono text-warning mt-1">
                    Старый адрес /teams/{team.slug} будет сохранен как alias-редирект (AC-TEAM-067).
                  </p>
                )}
              </div>
            </div>

            {/* Тип команды */}
            <div>
              <label className="text-caption font-mono uppercase font-bold text-textSecondary block mb-1.5">
                Тип команды (BR-TEAM-001, AC-TEAM-070)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TEAM_TYPE_OPTIONS.map(opt => {
                  const IconComp = opt.icon;
                  const isSelected = type === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setType(opt.type)}
                      className={`p-2.5 rounded-control border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-accent bg-accent/10'
                          : 'border-borderDef bg-surface-2 hover:bg-surface-3'
                      }`}
                    >
                      <IconComp className={`w-4 h-4 ${isSelected ? 'text-accent' : 'text-textTertiary'}`} />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-textPrimary block truncate">{opt.label}</span>
                        <span className="text-[10px] text-textTertiary block truncate">{opt.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {type === 'other' && (
                <div className="mt-2">
                  <input 
                    type="text" 
                    value={customType} 
                    onChange={e => setCustomType(e.target.value)}
                    placeholder="Уточните тип: например, Коллаборация, Арт-объединение"
                    className="w-full h-8 bg-surface-2 border border-borderDef text-textPrimary text-xs px-2.5 rounded-control outline-none"
                  />
                </div>
              )}
            </div>

            {/* Описание */}
            <div>
              <label className="text-caption font-mono uppercase font-bold text-textSecondary block mb-1">
                Описание студии
              </label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-surface-2 border border-borderDef focus:border-accent text-textPrimary p-3 rounded-control text-xs outline-none resize-none"
              />
            </div>

            {/* Логотип */}
            <div className="flex items-center gap-4 bg-surface-2 border border-borderDef rounded-card p-3">
              <img src={logo || team.logo} alt="Logo" className="w-12 h-12 rounded-control border border-borderDef object-cover bg-surface-1" />
              <div className="flex-1">
                <button type="button" className="text-xs font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" /> Загрузить новый логотип
                </button>
                <span className="text-caption text-textTertiary font-mono block mt-0.5">PNG, JPG или SVG до 2 МБ</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: КОНТАКТЫ (AC-TEAM-044) */}
        {activeTab === 'contacts' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-textSecondary">
              Публичные каналы связи студии для игроков, партнеров и организаторов джемов.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-caption font-mono uppercase font-bold text-textSecondary block mb-1">Telegram</label>
                <div className="flex items-center h-9 bg-surface-2 border border-borderDef focus-within:border-accent rounded-control px-2.5 text-xs">
                  <Send className="w-3.5 h-3.5 text-info shrink-0 mr-2" />
                  <input 
                    type="text" 
                    value={telegram}
                    onChange={e => setTelegram(e.target.value)}
                    placeholder="@studio_official"
                    className="w-full bg-transparent text-textPrimary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-caption font-mono uppercase font-bold text-textSecondary block mb-1">Email для связи</label>
                <div className="flex items-center h-9 bg-surface-2 border border-borderDef focus-within:border-accent rounded-control px-2.5 text-xs">
                  <Mail className="w-3.5 h-3.5 text-textTertiary shrink-0 mr-2" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="contact@studio.com"
                    className="w-full bg-transparent text-textPrimary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-caption font-mono uppercase font-bold text-textSecondary block mb-1">Сообщество VK</label>
                <div className="flex items-center h-9 bg-surface-2 border border-borderDef focus-within:border-accent rounded-control px-2.5 text-xs">
                  <Globe className="w-3.5 h-3.5 text-accent shrink-0 mr-2" />
                  <input 
                    type="text" 
                    value={vk}
                    onChange={e => setVk(e.target.value)}
                    placeholder="https://vk.com/studio"
                    className="w-full bg-transparent text-textPrimary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-caption font-mono uppercase font-bold text-textSecondary block mb-1">Официальный сайт</label>
                <div className="flex items-center h-9 bg-surface-2 border border-borderDef focus-within:border-accent rounded-control px-2.5 text-xs">
                  <Globe className="w-3.5 h-3.5 text-success shrink-0 mr-2" />
                  <input 
                    type="url" 
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://mystudio.dev"
                    className="w-full bg-transparent text-textPrimary outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ССЫЛКИ ПОДДЕРЖКИ (FE-CSP-002) */}
        {activeTab === 'support' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-xs text-textSecondary flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>
                HUBIGR не принимает донаты во внутренний кошелек и не удерживает комиссий (0%). Укажите прямые ссылки на внешние сервисы краудфандинга студии. Все переходы защищены проверкой Safe Redirect.
              </span>
            </div>

            {/* Список добавленных */}
            <div className="space-y-2">
              {supportLinks.map((link) => (
                <div key={link.id} className="p-3 bg-surface-2 border border-borderDef rounded-control flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-reaction shrink-0" />
                      <span className="text-xs font-bold text-textPrimary">{link.platform}</span>
                      {link.verified && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-success/10 text-success border border-success/30 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Проверено
                        </span>
                      )}
                    </div>
                    <span className="text-caption font-mono text-textTertiary block truncate mt-0.5">{link.url}</span>
                    {link.desc && <span className="text-[11px] text-textSecondary block mt-0.5">{link.desc}</span>}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSupportLink(link.id)}
                    className="p-1.5 text-textTertiary hover:text-danger hover:bg-danger/10 rounded-control transition-colors cursor-pointer"
                    aria-label="Удалить ссылку"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Добавление новой */}
            <div className="p-3.5 bg-surface-2/60 border border-dashed border-borderDef rounded-card space-y-2.5">
              <span className="text-caption font-mono uppercase font-bold text-textSecondary block">Добавить платформу поддержки</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select 
                  value={newPlatform} 
                  onChange={e => setNewPlatform(e.target.value)}
                  className="h-9 bg-surface-1 border border-borderDef rounded-control text-xs text-textPrimary px-2 outline-none"
                >
                  <option value="Boosty">Boosty</option>
                  <option value="CloudTips">CloudTips (СБП)</option>
                  <option value="DonationAlerts">DonationAlerts</option>
                  <option value="ЮMoney">ЮMoney</option>
                  <option value="Patreon">Patreon</option>
                </select>
                <input 
                  type="url" 
                  value={newUrl} 
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://boosty.to/..."
                  className="sm:col-span-2 h-9 bg-surface-1 border border-borderDef rounded-control text-xs text-textPrimary px-2.5 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={newDesc} 
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Описание цели сбора (например, Озвучка персонажей)"
                  className="flex-1 h-9 bg-surface-1 border border-borderDef rounded-control text-xs text-textPrimary px-2.5 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSupportLink}
                  disabled={!newUrl.trim()}
                  className="h-9 px-3.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white rounded-control text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Добавить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: НАСТРОЙКИ ПУБЛИЧНОСТИ БЛОКОВ */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-textSecondary">
              Настройте, какие секции команды должны быть видны гостям на публичной странице профиля.
            </p>

            <div className="divide-y divide-borderDef/60 bg-surface-2 rounded-card p-4 border border-borderDef space-y-3">
              <label className="flex items-center justify-between gap-4 cursor-pointer pt-1">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-textPrimary block">Скрыть блок состава участников</span>
                  <span className="text-caption text-textTertiary block">
                    Список членов команды и их роли будут доступны только авторизованным участникам студии
                  </span>
                </div>
                <input 
                  type="checkbox"
                  checked={hideMembers}
                  onChange={e => setHideMembers(e.target.checked)}
                  className="w-4 h-4 accent-accent rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between gap-4 cursor-pointer pt-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-textPrimary block">Скрыть достижения в джемах</span>
                  <span className="text-caption text-textTertiary block">
                    Не отображать блок наград и историю участия в хакатонах и джемах
                  </span>
                </div>
                <input 
                  type="checkbox"
                  checked={hideJamAchievements}
                  onChange={e => setHideJamAchievements(e.target.checked)}
                  className="w-4 h-4 accent-accent rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-borderDef">
          <button 
            type="button" 
            onClick={onClose} 
            className="h-10 px-4 rounded-control bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary hover:text-textPrimary text-xs font-semibold transition-colors cursor-pointer"
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className="h-10 px-5 rounded-control bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" /> Сохранить изменения
          </button>
        </div>
      </form>
    </Modal>
  );
};
