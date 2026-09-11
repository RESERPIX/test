import React, { useState } from 'react';
import Button from '../components/ui/Button';
import FontStyles from '../components/ui/FontStyles';
import SegmentedControl from '../components/ui/SegmentedControl';

const ROLE_DATA: Record<string, {
  badge: string;
  title: string;
  desc: string;
  features: { title: string; desc: string; icon: string }[];
  image: string;
}> = {
  dev: {
    badge: 'РАЗРАБОТЧИКАМ',
    title: 'Всё для создания и роста проекта',
    desc: 'От концепта до релиза — управляйте проектом, участвуйте в джемах, ведите девлоги и собирайте аудиторию вокруг своей игры.',
    features: [
      { title: 'Страница проекта', desc: 'Живой хаб с медиа, описанием, командой и историей версий', icon: 'ri-folders-line' },
      { title: 'Джемы', desc: 'Участвуйте в соревнованиях, загружайте сабмиты, получайте оценки', icon: 'ri-trophy-line' },
      { title: 'DevLogs', desc: 'Публичная хроника разработки с подписками и комментариями', icon: 'ri-article-line' },
      { title: 'Версионирование', desc: 'Храните все билды — от прототипа до стабильного релиза', icon: 'ri-stack-line' }
    ],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop'
  },
  player: {
    badge: 'ИГРОКАМ',
    title: 'Будьте частью создания',
    desc: 'Наблюдайте за разработкой через девлоги, тестируйте ранние билды, давайте обратную связь и влияйте на развитие любимых проектов.',
    features: [
      { title: 'Каталог игр', desc: 'Находите инди-проекты по жанрам, тегам и статусу разработки', icon: 'ri-apps-line' },
      { title: 'Ранний доступ', desc: 'Играйте в экспериментальные билды до официального релиза', icon: 'ri-gamepad-line' },
      { title: 'DevLogs', desc: 'Читайте хронику разработки и следите за прогрессом', icon: 'ri-newspaper-line' },
      { title: 'Обратная связь', desc: 'Комментируйте, оценивайте и помогайте проектам расти', icon: 'ri-chat-1-line' }
    ],
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1000&auto=format&fit=crop'
  },
  organizer: {
    badge: 'ОРГАНИЗАТОРАМ',
    title: 'Полная инфраструктура джемов',
    desc: 'Создавайте мероприятия любого масштаба: от мини-джемов до больших сезонных состязаний с жюри и публичным голосованием.',
    features: [
      { title: 'Регламент', desc: 'Публикуйте правила, ограничения и тему во встроенном редакторе', icon: 'ri-file-list-line' },
      { title: 'Приём работ', desc: 'Автоматизированный сбор сабмишенов с валидацией билдов', icon: 'ri-inbox-archive-line' },
      { title: 'Судейство', desc: 'Гибкий контур: голосование участников, жюри или публичное', icon: 'ri-auction-line' },
      { title: 'Итоги', desc: 'Автоматический подиум, результаты и уведомления участникам', icon: 'ri-medal-line' }
    ],
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop'
  }
};

interface AboutPageProps {
  onNavigate?: (path: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const [activeRole, setActiveRole] = useState('dev');
  const current = ROLE_DATA[activeRole];

  return (
    <div className="min-h-screen flex flex-col bg-surface-0 text-textPrimary">
      <FontStyles />
      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-12 md:pt-20 pb-12 sm:pb-16 md:pb-24 border-b border-borderDef overflow-hidden bg-surface-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-2 border border-borderDef rounded-full text-xs font-mono text-textTertiary">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                ПЛАТФОРМА ДЛЯ ИНДИ-РАЗРАБОТКИ
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-textPrimary leading-[1.12] tracking-tight">
                Одно пространство <br className="hidden sm:inline" />
                для <span className="text-accent">инди-игр</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-textSecondary max-w-xl leading-relaxed">
                Создавайте игры, участвуйте в джемах, публикуйте билды и растите аудиторию — всё в одной экосистеме. Без разрозненных инструментов.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => onNavigate?.('/jams')}
                >
                  Найти джем
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => onNavigate?.('/market')}
                >
                  В маркет
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-10 border-t border-borderDef/60 font-mono text-center sm:text-left">
                <div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent">100%</div>
                  <div className="text-[11px] sm:text-xs text-textTertiary mt-0.5 sm:mt-1">Бесплатный доступ</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent">WebGL</div>
                  <div className="text-[11px] sm:text-xs text-textTertiary mt-0.5 sm:mt-1">Запуск в браузере</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent">M7</div>
                  <div className="text-[11px] sm:text-xs text-textTertiary mt-0.5 sm:mt-1">Соавторство и роли</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative rounded-2xl overflow-hidden border border-borderDef shadow-elevation-raised bg-surface-1 p-2">
                <img 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop" 
                  alt="HUBIGR Setup Preview" 
                  className="w-full h-56 sm:h-72 lg:h-[400px] rounded-xl border border-borderDef/60 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="py-12 sm:py-16 md:py-24 border-b border-borderDef bg-surface-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="max-w-2xl mb-8 sm:mb-12 space-y-3">
            <span className="text-xs font-mono text-textTertiary uppercase tracking-widest block font-bold">ПОЧЕМУ HUBIGR</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary leading-tight">
              Разработка игр разбросана <br className="hidden sm:inline" />
              по <span className="text-accent">десятку сервисов</span>
            </h2>
            <p className="text-sm sm:text-base text-textSecondary leading-relaxed">
              Один инструмент для публикации, другой для джемов, третий для коммуникации с игроками, четвёртый для хранения версий. HUBIGR объединяет весь цикл в одном пространстве.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-surface-1 border border-borderDef p-6 sm:p-8 rounded-2xl space-y-3 sm:space-y-4 hover:border-borderStrong transition-colors">
              <div className="text-accent font-mono text-xs font-bold uppercase tracking-wider">
                Создание
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-textPrimary">Единый проект</h3>
              <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                Идея, команда, прототип, джем-сабмит — всё в одном проекте с историей версий и девлогами.
              </p>
            </div>

            <div className="bg-surface-1 border border-borderDef p-6 sm:p-8 rounded-2xl space-y-3 sm:space-y-4 hover:border-borderStrong transition-colors">
              <div className="text-accent font-mono text-xs font-bold uppercase tracking-wider">
                Публикация
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-textPrimary">Мгновенный доступ</h3>
              <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                Страница проекта, билды для WebGL и десктопа, аналитика загрузок и просмотров.
              </p>
            </div>

            <div className="bg-surface-1 border border-borderDef p-6 sm:p-8 rounded-2xl space-y-3 sm:space-y-4 hover:border-borderStrong transition-colors">
              <div className="text-accent font-mono text-xs font-bold uppercase tracking-wider">
                Сообщество
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-textPrimary">Рост аудитории</h3>
              <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                Подписчики, комментарии, обратная связь, оценки — аудитория растёт вокруг проекта.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROLES SECTION */}
      <section className="py-12 sm:py-16 md:py-24 border-b border-borderDef bg-surface-1">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="max-w-2xl mb-8 sm:mb-10 space-y-3">
            <span className="text-xs font-mono text-textTertiary uppercase tracking-widest block font-bold">ВОЗМОЖНОСТИ</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary">
              Для <span className="text-accent">разных</span> ролей
            </h2>
            <p className="text-sm md:text-base text-textSecondary">
              Одна платформа, но каждый участник экосистемы получает инструменты под свои задачи.
            </p>
          </div>

          <div className="w-full sm:w-fit mb-8 sm:mb-12 overflow-x-auto touch-scroll no-scrollbar">
            <SegmentedControl
              value={activeRole}
              onChange={setActiveRole}
              fullWidth={false}
              items={[
                { key: 'dev', label: 'Разработчикам' },
                { key: 'player', label: 'Игрокам' },
                { key: 'organizer', label: 'Организаторам' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center animate-fadeIn" key={activeRole}>
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <span className="text-xs font-mono text-textTertiary uppercase tracking-wider block font-bold">{current.badge}</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">{current.title}</h3>
              <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">{current.desc}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                {current.features.map((feat, i) => (
                  <div key={i} className="bg-surface-2 p-4 rounded-xl border border-borderDef space-y-1.5">
                    <i className={`${feat.icon} text-lg text-accent`}></i>
                    <h4 className="text-sm font-bold text-textPrimary">{feat.title}</h4>
                    <p className="text-xs text-textTertiary leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-borderDef bg-surface-2">
                <img src={current.image} alt={current.title} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANY SECTION */}
      <section className="py-12 sm:py-16 md:py-24 border-b border-borderDef bg-surface-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="w-11 h-11 bg-surface-2 border border-borderDef rounded-xl flex items-center justify-center text-accent text-xl">
                <i className="ri-building-2-line"></i>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-textPrimary leading-tight">
                Разработчик и владелец проекта
              </h2>
              <p className="text-xs sm:text-sm text-textSecondary leading-relaxed max-w-xl">
                Платформа HUBIGR разработана и принадлежит <strong className="text-textPrimary font-semibold">ООО «СЭД СКФО»</strong>. Проект развивается как отдельная цифровая платформа для инди-игр, геймджемов и игрового сообщества.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-surface-1 border border-borderDef rounded-2xl p-5 sm:p-8 space-y-4 shadow-elevation-raised">
                <div className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
                  ООО «СЭД СКФО»
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-textPrimary">
                  Официальный сайт компании
                </h3>
                <p className="text-xs text-textSecondary leading-relaxed">
                  На сайте компании можно узнать больше о разработчике проекта и других цифровых решениях ООО «СЭД СКФО».
                </p>
                <div className="pt-2">
                  <a
                    href="https://sedskfo.ru/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 bg-surface-2 hover:bg-surface-3 active:scale-[0.98] border border-borderDef text-textPrimary text-xs font-mono font-bold rounded-xl transition-all touch-manipulation"
                  >
                    Перейти на sedskfo.ru
                    <i className="ri-external-link-line text-sm"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
