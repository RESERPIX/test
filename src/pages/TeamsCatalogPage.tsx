import React, { useState } from 'react';
import { Search, Users, Building, Ghost, Globe, Briefcase, ArrowRight, Plus } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { TeamType } from '../types/team';

export interface CatalogTeamItem {
  id: string;
  slug: string;
  name: string;
  type: TeamType;
  customType?: string;
  membersCount: number;
  gamesCount: number;
  description: string;
  logo: string | null;
}

// Mock Data for Teams (FE-TEAM-001: AC-TEAM-007, AC-TEAM-070, AC-TEAM-071)
const MOCK_TEAMS: CatalogTeamItem[] = [
  { 
    id: 't_nocturnal', 
    slug: 'nocturnal-devs', 
    name: 'NocturnalDevs Studio', 
    type: 'studio', 
    membersCount: 4, 
    gamesCount: 3, 
    description: 'Инди-студия разработки атмосферных киберпанк и хоррор проектов на Unity и WebGL.', 
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=nocturnal' 
  },
  { 
    id: 't_pixel', 
    slug: 'pixel-pioneers', 
    name: 'Pixel Pioneers', 
    type: 'indie_team', 
    membersCount: 2, 
    gamesCount: 1, 
    description: 'Команда пиксельных энтузиастов и ретро-платформеров.', 
    logo: 'https://api.dicebear.com/7.x/bottts/svg?seed=pixel' 
  },
  { 
    id: 't_cyber', 
    slug: 'cyber-crafters', 
    name: 'Cyber Crafters Studio', 
    type: 'studio', 
    membersCount: 5, 
    gamesCount: 2, 
    description: 'Создаем динамичные неоновые аркады и симуляторы выживания.', 
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=cybercrafters' 
  },
  { 
    id: 't_open', 
    slug: 'open-collective', 
    name: 'Open Collective', 
    type: 'collective', 
    membersCount: 120, 
    gamesCount: 5, 
    description: 'Открытое сообщество единомышленников. Вместе делаем открытые и jam-проекты.', 
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=opencollective' 
  },
  { 
    id: 't_corp', 
    slug: 'megacorp', 
    name: 'MegaCorp Games', 
    type: 'company_organization', 
    membersCount: 45, 
    gamesCount: 12, 
    description: 'Издатель и разработчик независимых коммерческих игр для ПК и веба.', 
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=megacorp' 
  },
  { 
    id: 't_audio', 
    slug: 'vaporwave-audio', 
    name: 'Vaporwave Sound Guild', 
    type: 'other', 
    customType: 'Аудио-гильдия',
    membersCount: 8, 
    gamesCount: 4, 
    description: 'Коллектив саунд-дизайнеров и композиторов для инди-игр.', 
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=vaporwave' 
  }
];

export const TEAM_TYPES: Record<TeamType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  indie_team: { label: 'Инди-команда', icon: Ghost, color: 'text-accent' },
  studio: { label: 'Студия', icon: Building, color: 'text-info' },
  collective: { label: 'Объединение', icon: Users, color: 'text-success' },
  company_organization: { label: 'Компания', icon: Briefcase, color: 'text-warning' },
  other: { label: 'Другое', icon: Globe, color: 'text-textTertiary' },
};

export default function TeamsCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<TeamType | null>(null);

  const filteredTeams = MOCK_TEAMS.filter(team => {
    if (selectedType && team.type !== selectedType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = team.name.toLowerCase().includes(q);
      const matchDesc = team.description.toLowerCase().includes(q);
      const matchCustom = team.customType?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCustom) return false;
    }
    return true;
  });

  const goTeam = (slug: string) => {
    if ((window as any).__hubigrNavigate) {
      (window as any).__hubigrNavigate(`/teams/${slug}`);
    } else {
      window.location.href = `/teams/${slug}`;
    }
  };

  const goCreateTeam = () => {
    if ((window as any).__hubigrNavigate) {
      (window as any).__hubigrNavigate('/creator-dashboard?tab=teams');
    } else {
      window.location.href = '/creator-dashboard?tab=teams';
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface-0 pt-16 md:pt-24 pb-20 font-sans text-textPrimary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-textPrimary tracking-tight mb-2">
              Каталог команд и студий
            </h1>
            <p className="text-sm text-textSecondary max-w-2xl leading-relaxed">
              Найдите единомышленников, изучайте портфолио любимых студий или создайте собственную команду для разработки (FE-TEAM-001).
            </p>
          </div>

          <button
            onClick={goCreateTeam}
            className="h-10 px-4 rounded-control bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-sm self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Создать команду</span>
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-surface-1 p-4 rounded-card border border-borderDef shadow-sm">
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textTertiary" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию или описанию студии..." 
              className="pl-9 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
            <button
              onClick={() => setSelectedType(null)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-control text-xs font-bold transition-colors cursor-pointer ${
                !selectedType 
                  ? 'bg-textPrimary text-surface-0' 
                  : 'bg-surface-2 text-textSecondary hover:bg-surface-3 hover:text-textPrimary'
              }`}
            >
              Все
            </button>
            {(Object.entries(TEAM_TYPES) as [TeamType, typeof TEAM_TYPES[TeamType]][]).map(([typeKey, config]) => {
              const Icon = config.icon;
              const isSelected = selectedType === typeKey;
              return (
                <button
                  key={typeKey}
                  onClick={() => setSelectedType(typeKey)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-control text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-textPrimary text-surface-0' 
                      : 'bg-surface-2 text-textSecondary hover:bg-surface-3 hover:text-textPrimary'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* GRID */}
        {filteredTeams.length === 0 ? (
          <div className="text-center py-16 bg-surface-1 border border-borderDef rounded-card p-6">
            <Users className="w-12 h-12 text-textTertiary mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-textPrimary mb-1">Команды не найдены</h3>
            <p className="text-xs text-textSecondary mb-4">Попробуйте изменить параметры поиска или фильтра.</p>
            <Button onClick={() => { setSearchQuery(''); setSelectedType(null); }}>
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTeams.map(team => {
              const typeConfig = TEAM_TYPES[team.type] || TEAM_TYPES.other;
              const TypeIcon = typeConfig.icon;
              const displayLabel = (team.type === 'other' && team.customType) ? team.customType : typeConfig.label;
              
              return (
                <div 
                  key={team.id}
                  onClick={() => goTeam(team.slug)}
                  className="group bg-surface-1 border border-borderDef rounded-card p-5 hover:border-accent hover:shadow-md transition-all cursor-pointer flex flex-col relative"
                >
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <div className="w-12 h-12 rounded-card bg-surface-2 border border-borderDef overflow-hidden flex items-center justify-center shrink-0">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-6 h-6 text-textTertiary" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-textPrimary group-hover:text-accent transition-colors truncate">
                        {team.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <TypeIcon className={`w-3.5 h-3.5 ${typeConfig.color} shrink-0`} />
                        <span className="text-[11px] font-semibold text-textSecondary uppercase tracking-wider truncate">
                          {displayLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-textSecondary line-clamp-2 mb-4 flex-1 leading-relaxed">
                    {team.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3.5 border-t border-borderDef/60 text-[11px] font-mono text-textTertiary">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1" title="Количество участников">
                        <Users className="w-3.5 h-3.5" /> {team.membersCount}
                      </span>
                      <span className="flex items-center gap-1" title="Выпущено игр">
                        <Globe className="w-3.5 h-3.5" /> {team.gamesCount} игр
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-textSecondary group-hover:text-accent font-sans font-bold text-xs transition-colors">
                      Профиль <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

