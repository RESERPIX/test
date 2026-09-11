import React, { useState } from 'react';
import { Users, Plus, Upload, Building, Ghost, Globe, Briefcase, Info } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { TeamType } from '../../../types/team';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (data: { 
    name: string; 
    slug: string; 
    type: TeamType; 
    customType?: string; 
    description: string;
    logo?: string;
  }) => void;
}

const TEAM_TYPE_OPTIONS: Array<{
  type: TeamType;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { 
    type: 'indie_team', 
    label: 'Инди-команда', 
    desc: 'Небольшой независимый коллектив авторов',
    icon: Ghost 
  },
  { 
    type: 'studio', 
    label: 'Студия', 
    desc: 'Постоянная студия разработки нескольких проектов',
    icon: Building 
  },
  { 
    type: 'collective', 
    label: 'Объединение', 
    desc: 'Свободное открытое сообщество единомышленников',
    icon: Users 
  },
  { 
    type: 'company_organization', 
    label: 'Компания / Организация', 
    desc: 'Зарегистрированное юридическое лицо',
    icon: Briefcase 
  },
  { 
    type: 'other', 
    label: 'Другое', 
    desc: 'Иной формат творческого союза с уточнением',
    icon: Globe 
  },
];

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onCreateTeam }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedType, setSelectedType] = useState<TeamType>('indie_team');
  const [customType, setCustomType] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    setError('');
    // Auto-generate slug if user hasn't manually edited it
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9а-яё]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(autoSlug);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Укажите название команды');
      return;
    }
    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    onCreateTeam({ 
      name: name.trim(), 
      slug: finalSlug, 
      type: selectedType,
      customType: selectedType === 'other' ? customType.trim() : undefined,
      description: description.trim(),
      logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name.trim())}`
    });
    setName('');
    setSlug('');
    setSelectedType('indie_team');
    setCustomType('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Создать новую команду / студию"
      subtitle="Единый субъект владения играми, публикации девлогов и участия в джемах"
      icon={<Users className="w-5 h-5 text-accent" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-textPrimary font-sans">
        {/* 1. НАЗВАНИЕ И СЛЭГ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-caption font-mono uppercase font-bold text-textSecondary block mb-1.5">
              Название команды *
            </label>
            <input 
              type="text" 
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="Например: NocturnalDevs Studio"
              className="w-full h-10 bg-surface-2 border border-borderDef focus:border-accent text-textPrimary px-3 rounded-control text-sm outline-none transition-colors"
              required
            />
            {error && <p className="text-caption font-mono text-danger mt-1">{error}</p>}
          </div>

          <div>
            <label className="text-caption font-mono uppercase font-bold text-textSecondary block mb-1.5">
              URL Слэг команды (уникальный) *
            </label>
            <div className="flex items-center h-10 bg-surface-2 border border-borderDef focus-within:border-accent rounded-control px-3 text-xs font-mono transition-colors">
              <span className="text-textTertiary shrink-0">hubigr.com/teams/</span>
              <input 
                type="text" 
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="nocturnal-devs"
                className="w-full bg-transparent text-accent font-semibold outline-none pl-1"
                required
              />
            </div>
          </div>
        </div>

        {/* 2. ВЫБОР ТИПА КОМАНДЫ (BR-TEAM-001, AC-TEAM-001, AC-TEAM-070) */}
        <div>
          <label className="text-caption font-mono uppercase font-bold text-textSecondary block mb-2">
            Тип команды (публичная классификация) *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TEAM_TYPE_OPTIONS.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = selectedType === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setSelectedType(opt.type)}
                  className={`p-3 rounded-card border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-accent bg-accent/10 shadow-sm'
                      : 'border-borderDef bg-surface-2 hover:border-borderStrong hover:bg-surface-3'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-control flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-accent text-white' : 'bg-surface-3 text-textSecondary'
                  }`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-textPrimary flex items-center justify-between">
                      <span>{opt.label}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-textTertiary mt-0.5 leading-snug">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Уточнение типа для 'other' */}
          {selectedType === 'other' && (
            <div className="mt-2.5 animate-fadeIn">
              <label className="text-[11px] font-mono text-textTertiary block mb-1">
                Укажите ваш формат объединения:
              </label>
              <input
                type="text"
                value={customType}
                onChange={e => setCustomType(e.target.value)}
                placeholder="Например: Студенческая лаборатория, арт-хаб"
                className="w-full h-9 bg-surface-2 border border-borderDef focus:border-accent text-textPrimary px-3 rounded-control text-xs outline-none"
              />
            </div>
          )}

          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-textTertiary">
            <Info className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>Тип команды служит для фильтрации в каталоге и не ограничивает коммерческий статус продавца (BR-TEAM-001).</span>
          </div>
        </div>

        {/* 3. ОПИСАНИЕ СТУДИИ */}
        <div>
          <label className="text-caption font-mono uppercase font-bold text-textSecondary block mb-1.5">
            Описание команды
          </label>
          <textarea 
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Расскажите об истории создания, игровых движках и текущих проектах студии..."
            rows={3}
            className="w-full bg-surface-2 border border-borderDef focus:border-accent text-textPrimary p-3 rounded-control text-xs outline-none resize-none transition-colors"
          />
        </div>

        {/* 4. ЛОГОТИП */}
        <div className="border border-dashed border-borderDef hover:border-accent rounded-card p-4 text-center cursor-pointer transition-colors bg-surface-2/40">
          <Upload className="w-5 h-5 text-textTertiary mx-auto mb-1.5" />
          <span className="text-xs text-textSecondary block font-medium">Загрузить логотип команды (опционально)</span>
          <span className="text-caption text-textTertiary font-mono">PNG, JPG, SVG до 2 МБ (по умолчанию сгенерируется идентикон)</span>
        </div>

        {/* 5. КНОПКИ ДЕЙСТВИЯ */}
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
            className="h-10 px-5 rounded-control bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Создать команду
          </button>
        </div>
      </form>
    </Modal>
  );
};