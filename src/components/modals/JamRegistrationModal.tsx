import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

export interface JamRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jamTitle: string;
  jamId: string;
  jamStartDate: string;
  userTeams?: Array<{ id: string; name: string; role: string }>;
  triggerToast?: (message: string, type?: any) => void;
  // Режим редактирования
  isEditMode?: boolean;
  currentData?: {
    participationType: 'solo' | 'team';
    teamId?: string;
    role: string;
    isLookingForTeam: boolean;
  };
}

const ROLES = [
  'Программист',
  '2D/3D Художник',
  'Геймдизайнер',
  'Композитор / Саунд-дизайнер',
  'Нарративный дизайнер',
  'Тестировщик',
];

const MOCK_TEAM_MEMBERS: Record<string, Array<{id: string, name: string, role: string}>> = {
  'team_1': [
    { id: 'usr_1', name: 'Вы (Организатор от команды)', role: 'Lead Programmer' },
    { id: 'usr_2', name: 'Елена Соколова', role: '2D Artist' },
    { id: 'usr_3', name: 'Максим Петров', role: 'Game Designer' }
  ],
  'team_2': [
    { id: 'usr_1', name: 'Вы (Организатор от команды)', role: 'Tech Lead' },
    { id: 'usr_4', name: 'Сара Коннор', role: 'Sound Designer' }
  ]
};

export const JamRegistrationModal: React.FC<JamRegistrationModalProps> = ({
  isOpen,
  onClose,
  jamTitle,
  jamId,
  jamStartDate,
  userTeams = [],
  triggerToast,
  isEditMode = false,
  currentData,
}) => {
  const [participationType, setParticipationType] = useState<'solo' | 'team'>('solo');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('Геймдизайнер');
  const [isLookingForTeam, setIsLookingForTeam] = useState<boolean>(false);
  const [acceptRules, setAcceptRules] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [teamRoster, setTeamRoster] = useState<string[]>(['usr_1']);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && currentData) {
        // Режим редактирования - загружаем текущие данные
        setParticipationType(currentData.participationType);
        setSelectedTeamId(currentData.teamId || '');
        setSelectedRole(currentData.role);
        setIsLookingForTeam(currentData.isLookingForTeam);
        setAcceptRules(true); // В режиме редактирования правила уже приняты
        setTeamRoster(['usr_1', 'usr_2']); // Мок
      } else {
        // Режим новой регистрации
        setParticipationType('solo');
        setSelectedTeamId('');
        setSelectedRole('Геймдизайнер');
        setIsLookingForTeam(false);
        setAcceptRules(false);
        setTeamRoster(['usr_1']);
      }
    }
  }, [isOpen, isEditMode, currentData]);

  // Сброс и предзаполнение ростера при смене команды
  useEffect(() => {
    if (selectedTeamId && MOCK_TEAM_MEMBERS[selectedTeamId]) {
      // По умолчанию берем всех
      setTeamRoster(MOCK_TEAM_MEMBERS[selectedTeamId].map(m => m.id));
    } else {
      setTeamRoster(['usr_1']);
    }
  }, [selectedTeamId]);

  const handleSubmit = () => {
    if (!acceptRules) {
      if (triggerToast) triggerToast('Необходимо принять правила джема', 'warning');
      return;
    }

    if (participationType === 'team') {
      if (!selectedTeamId && userTeams.length > 0) {
        if (triggerToast) triggerToast('Выберите команду для участия', 'warning');
        return;
      }
      if (teamRoster.length === 0) {
        if (triggerToast) triggerToast('В ростере должен быть хотя бы один участник', 'warning');
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      if (triggerToast) {
        const message = isEditMode 
          ? 'Данные участия успешно обновлены!' 
          : `Вы успешно зарегистрировались на ${jamTitle}!`;
        triggerToast(message, 'success');
      }
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Управление участием' : 'Регистрация на джем'}
      icon={<UserPlus className="w-5 h-5" />}
      size="md"
      footer={
        <button 
          onClick={handleSubmit}
          disabled={!acceptRules || isSubmitting}
          className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 text-white font-bold text-sm py-3.5 rounded-xl tracking-wide transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting 
            ? (isEditMode ? 'Сохранение...' : 'Регистрация...') 
            : (isEditMode ? 'Сохранить изменения' : 'Подтвердить участие')}
        </button>
      }
    >
      <div className="flex flex-col gap-6 -mx-6 -my-6 p-6">
        
        {/* Информация о джеме */}
        <div className="p-4 bg-surface-2 border border-borderDef rounded-lg">
          <p className="text-sm font-bold text-textPrimary leading-snug">{jamTitle}</p>
          <p className="text-xs text-textTertiary font-mono mt-1">Старт: {jamStartDate}</p>
        </div>

        {/* 1. Формат участия */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-textPrimary">
            <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">1.</span> Формат участия <span className="text-danger">*</span>
          </label>
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
            <button 
              onClick={() => setParticipationType('solo')}
              className={`py-3 px-3 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer text-center ${
                participationType === 'solo' 
                  ? 'bg-surface-2 border-accent text-accent' 
                  : 'bg-surface-2 border-borderDef text-textTertiary hover:border-borderStrong'
              }`}
            >
              Соло участник
            </button>
            <button 
              onClick={() => setParticipationType('team')}
              className={`py-3 px-3 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer text-center ${
                participationType === 'team' 
                  ? 'bg-surface-2 border-accent text-accent' 
                  : 'bg-surface-2 border-borderDef text-textTertiary hover:border-borderStrong'
              }`}
            >
              В составе команды
            </button>
          </div>
        </div>

        {/* Выбор команды (если team) */}
        {participationType === 'team' && (
          <div className="flex flex-col gap-1.5 animate-fadeIn">
            <label className="block text-sm font-semibold text-textPrimary">
              <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">2.</span> Выберите команду <span className="text-danger">*</span>
            </label>
            {userTeams.length > 0 ? (
              <select 
                value={selectedTeamId} 
                onChange={e => setSelectedTeamId(e.target.value)} 
                className="bg-surface-2 border border-borderDef text-textPrimary p-3 text-sm rounded-lg outline-none focus:border-accent transition-colors"
              >
                <option value="">Выберите команду</option>
                {userTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.role})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-surface-2 border border-borderDef rounded-lg text-xs text-textTertiary">
                У вас пока нет команд. <button className="text-accent hover:underline font-bold">Создать команду</button>
              </div>
            )}
          </div>
        )}

        {/* Выбор ростера (Team Jam roster - BR-JORG-040) */}
        {participationType === 'team' && selectedTeamId && MOCK_TEAM_MEMBERS[selectedTeamId] && (
          <div className="flex flex-col gap-1.5 animate-fadeIn mt-1">
            <label className="block text-sm font-semibold text-textPrimary">
              <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">3.</span> Состав команды на джем <span className="text-danger">*</span>
            </label>
            <div className="text-xs text-textSecondary mb-1 leading-relaxed">
              Выберите участников команды, которые будут работать над проектом в рамках этого джема. После дедлайна состав будет заморожен.
            </div>
            <div className="flex flex-col gap-1.5 bg-surface-1/40 p-2.5 rounded-lg border border-borderDef/50">
              {MOCK_TEAM_MEMBERS[selectedTeamId].map(member => (
                <label key={member.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-surface-2 rounded-md transition-colors border border-transparent hover:border-borderDef">
                  <input
                    type="checkbox"
                    checked={teamRoster.includes(member.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTeamRoster([...teamRoster, member.id]);
                      } else {
                        setTeamRoster(teamRoster.filter(id => id !== member.id));
                      }
                    }}
                    disabled={member.id === 'usr_1'}
                    className="accent-accent w-4 h-4 cursor-pointer disabled:opacity-50 mt-0.5"
                  />
                  <div className="flex flex-col">
                    <span className={`text-sm font-semibold ${member.id === 'usr_1' ? 'text-textPrimary' : 'text-textSecondary'}`}>
                      {member.name}
                    </span>
                    <span className="text-[11px] text-textTertiary">
                      {member.role}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 2/3/4. Роль */}
        <div className="flex flex-col gap-1.5 animate-fadeIn">
          <label className="block text-sm font-semibold text-textPrimary">
            <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">{participationType === 'team' ? (selectedTeamId ? '4' : '3') : '2'}.</span> Ваша основная роль на джеме
          </label>
          <select 
            value={selectedRole} 
            onChange={e => setSelectedRole(e.target.value)} 
            className="bg-surface-2 border border-borderDef text-textPrimary p-3 text-sm rounded-lg outline-none transition-colors"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Опциональные чекбоксы */}
        <div className="flex flex-col gap-3 pt-3 border-t border-borderDef">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isLookingForTeam}
              onChange={(e) => setIsLookingForTeam(e.target.checked)}
              disabled={isSubmitting}
              className="accent-accent w-4 h-4 mt-0.5 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-textPrimary">
                Ищу команду / открыт к предложениям
              </span>
              <span className="text-caption text-textTertiary">
                Пометить профиль во вкладке участников
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptRules}
              onChange={(e) => setAcceptRules(e.target.checked)}
              disabled={isSubmitting}
              className="accent-accent w-4 h-4 mt-0.5 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-textPrimary">
                Я принимаю правила и регламент проведения джема <span className="text-danger">*</span>
              </span>
            </div>
          </label>
        </div>
      </div>
    </Drawer>
  );
};

export default JamRegistrationModal;
