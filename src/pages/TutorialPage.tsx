import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { SearchInput } from '../components/ui/Input';
import FontStyles from '../components/ui/FontStyles';

interface TutorialPageProps {
  onNavigate?: (path: string) => void;
}

export default function TutorialPage({ onNavigate }: TutorialPageProps) {
  const allowed = [
    "Использовать собственные наработки, если это не запрещено правилами конкретного джема.",
    "Работать в команде, если на странице джема нет ограничений по составу.",
    "Использовать готовые ассеты, музыку, шрифты и инструменты при наличии прав на использование.",
    "Публиковать devlog, делиться прогрессом и показывать процесс разработки.",
    "Использовать AI-инструменты, если это отдельно не ограничено организаторами."
  ];

  const forbidden = [
    "Отправлять проект после дедлайна, если джем не допускает позднюю подачу.",
    "Нарушать авторские права на графику, код, звук, видео или другие материалы.",
    "Публиковать чужую работу под своим именем.",
    "Размещать оскорбительный, дискриминационный или запрещённый контент.",
    "Нарушать дополнительные правила конкретного джема, указанные на его странице."
  ];

  const steps = [
    { num: '01', title: 'Выберите джем', desc: 'Перейдите на страницу интересующего джема, изучите тему, сроки проведения и условия участия.' },
    { num: '02', title: 'Зарегистрируйтесь', desc: 'Войдите в аккаунт и подтвердите участие. После этого вы сможете следить за обновлениями и отправить проект.' },
    { num: '03', title: 'Создайте игру', desc: 'Сделайте проект в рамках темы и дедлайна. Можно работать одному или в команде, если это разрешено конкретным джемом.' },
    { num: '04', title: 'Отправьте работу', desc: 'Загрузите билд, описание, скриншоты и необходимые ссылки до окончания приёма работ.' }
  ];

  const faqItems = [
    {
      q: "Можно ли участвовать одному?",
      a: "Да, если на странице конкретного джема не указано иное. Большинство джемов поддерживают как одиночное, так и командное участие."
    },
    {
      q: "Можно ли использовать старый проект?",
      a: "Обычно это зависит от правил джема. Если допускаются заготовки, ассет-паки или базовые прототипы, это отдельным пунктом оговаривается на странице джема."
    },
    {
      q: "Можно ли использовать AI-инструменты?",
      a: "Да, если организаторы джема не ввели отдельные ограничения. Всегда проверяйте правила конкретного состязания."
    },
    {
      q: "Что будет, если я не успею к дедлайну?",
      a: "После окончания приёма работ отправка файлов автоматически замораживается. Иногда организаторы оставляют короткое техническое окно на позднюю подачу."
    },
    {
      q: "Нужно ли публиковать исходный код?",
      a: "Нет, если это прямо не требуется правилами джема. В большинстве случаев достаточно рабочего архива билда, описания и скриншотов."
    },
    {
      q: "Где смотреть актуальные правила конкретного джема?",
      a: "Всегда на странице самого джема. Данное руководство описывает общие платформенные стандарты HUBIGR."
    }
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filteredFaq = faqItems.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface-0 text-textPrimary">
      <FontStyles />
      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-12 md:pt-20 pb-12 sm:pb-16 md:pb-20 border-b border-borderDef bg-surface-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-2 border border-borderDef rounded-full text-xs font-mono text-textTertiary">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              РУКОВОДСТВО ДЛЯ УЧАСТНИКОВ
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-textPrimary leading-tight tracking-tight">
              Как участвовать <br className="hidden sm:inline" />
              в <span className="text-accent">геймджемах</span> на HUBIGR
            </h1>

            <p className="text-sm sm:text-base text-textSecondary max-w-3xl leading-relaxed">
              Полная инструкция по участию в джемах: от подготовки команды и выбора состязания до правил публикации сборок и взаимодействия с организаторами.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => onNavigate?.('/jams')}
              >
                Перейти к джемам
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
          </div>
        </div>
      </section>

      {/* STEPS SECTION */}
      <section className="py-12 sm:py-16 md:py-24 border-b border-borderDef bg-surface-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="max-w-2xl mb-8 sm:mb-12 space-y-3">
            <span className="text-xs font-mono text-textTertiary uppercase tracking-widest block font-bold">ПОШАГОВЫЙ ПРОЦЕСС</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary">
              Как это <span className="text-accent">работает</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textSecondary">
              Четыре последовательных шага от выбора соревнования до финальной подачи билда.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map((s, i) => (
              <div key={i} className="bg-surface-1 border border-borderDef p-6 sm:p-8 rounded-2xl space-y-3 sm:space-y-4 hover:border-borderStrong transition-colors shadow-elevation-base">
                <span className="text-3xl sm:text-4xl font-mono font-black text-accent block">{s.num}</span>
                <h3 className="text-base sm:text-lg font-bold text-textPrimary">{s.title}</h3>
                <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RULES SECTION */}
      <section className="py-12 sm:py-16 md:py-24 border-b border-borderDef bg-surface-1">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="max-w-2xl mb-8 sm:mb-12 space-y-3">
            <span className="text-xs font-mono text-textTertiary uppercase tracking-widest block font-bold">РЕГЛАМЕНТ</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary">
              Правила <span className="text-accent">участия</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textSecondary">
              Соблюдение общих платформенных стандартов обеспечивает честную конкуренцию и комфорт для всех участников.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-surface-2 border border-borderDef p-6 sm:p-8 rounded-2xl space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3 border-b border-borderDef pb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center text-success shrink-0">
                  <i className="ri-checkbox-circle-line text-xl"></i>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-textPrimary">Что можно</h3>
                  <span className="text-[11px] sm:text-xs font-mono text-textTertiary">Разрешённые практики</span>
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-4">
                {allowed.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-textSecondary leading-relaxed">
                    <i className="ri-check-line text-success text-base shrink-0 mt-0.5"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface-2 border border-borderDef p-6 sm:p-8 rounded-2xl space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3 border-b border-borderDef pb-4">
                <div className="w-10 h-10 rounded-xl bg-danger/10 border border-danger/30 flex items-center justify-center text-danger shrink-0">
                  <i className="ri-close-circle-line text-xl"></i>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-textPrimary">Что нельзя</h3>
                  <span className="text-[11px] sm:text-xs font-mono text-textTertiary">Запрещённые нарушения</span>
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-4">
                {forbidden.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-textSecondary leading-relaxed">
                    <i className="ri-close-line text-danger text-base shrink-0 mt-0.5"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-12 sm:py-16 md:py-24 border-b border-borderDef bg-surface-1">
        <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8 sm:space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-borderDef pb-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-textTertiary uppercase tracking-widest block font-bold">ВОПРОСЫ И ОТВЕТЫ</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary">
                Часто задаваемые <span className="text-accent">вопросы</span>
              </h2>
            </div>

            <div className="w-full sm:w-72">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Поиск по вопросам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 bg-surface-2 border border-borderDef focus:border-accent text-xs sm:text-sm text-textPrimary placeholder:text-textTertiary rounded-xl outline-none transition-colors font-sans touch-manipulation"
                />
                <i className="ri-search-line absolute left-3.5 top-3.5 text-textTertiary text-sm"></i>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaq.length === 0 ? (
              <div className="p-8 text-center text-xs sm:text-sm text-textTertiary bg-surface-2 border border-borderDef rounded-xl font-mono">
                По вашему запросу ничего не найдено.
              </div>
            ) : (
              filteredFaq.map((item, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div key={idx} className="bg-surface-2 border border-borderDef rounded-xl overflow-hidden transition-colors">
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-surface-3 transition-colors cursor-pointer touch-manipulation select-none"
                    >
                      <span className="text-sm sm:text-base text-textPrimary font-bold">{item.q}</span>
                      <i className={`ri-add-line text-lg text-textTertiary transition-transform shrink-0 ${isOpen ? 'rotate-45 text-accent' : ''}`}></i>
                    </button>

                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-textSecondary border-t border-borderDef/60 pt-3 sm:pt-4 bg-surface-1/40 animate-fadeIn leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
