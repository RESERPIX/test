import React, { useState } from 'react';
import Button from '../components/ui/Button';
import FontStyles from '../components/ui/FontStyles';

interface SupportPageProps {
  onNavigate?: (path: string) => void;
}

export default function SupportPage({ onNavigate }: SupportPageProps) {
  const [watching, setWatching] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleWatchAd = () => {
    setWatching(true);
    setTimeout(() => {
      setWatching(false);
      setCompleted(true);
    }, 3000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("https://hubigr.ru/support");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-0 text-textPrimary">
      <FontStyles />
      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-12 md:pt-20 pb-12 sm:pb-16 md:pb-20 border-b border-borderDef bg-surface-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-2 border border-borderDef rounded-full text-xs font-mono text-textTertiary">
                <i className="ri-heart-handshake-line text-accent"></i>
                ПОДДЕРЖАТЬ HUBIGR / ХАБИГР
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-textPrimary leading-tight tracking-tight">
                Поддержите HUBIGR (Хабигр) — <br className="hidden sm:inline" />
                <span className="text-accent">платформу для игр и геймджемов</span>
              </h1>

              <div className="space-y-3 text-sm sm:text-base text-textSecondary max-w-3xl leading-relaxed">
                <p>
                  Мы пока не зарабатываем на проекте. HUBIGR держится на энтузиазме, времени и желании сделать полезную платформу для разработчиков игр, участников джемов и игрового сообщества.
                </p>
                <p className="text-textTertiary text-xs sm:text-sm">
                  Если вам нравится то, что мы делаем, вы можете помочь любой суммой. Эти деньги пойдут на серверы, разработку, улучшение интерфейса и новые функции.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    const el = document.getElementById('qr-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Поддержать проект
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    const el = document.getElementById('ad-support');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Помочь без денег
                </Button>
              </div>
            </div>

            {/* WHERE SUPPORT GOES CARD */}
            <div className="lg:col-span-5 bg-surface-1 border border-borderDef rounded-2xl p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-elevation-base">
              <div className="flex items-center gap-3 border-b border-borderDef pb-4">
                <div className="w-9 h-9 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center text-success shrink-0">
                  <i className="ri-shield-check-line text-lg"></i>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-textPrimary">Куда пойдёт поддержка</h2>
                  <span className="text-[11px] sm:text-xs font-mono text-textTertiary block">Только на развитие и стабильную работу</span>
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                <div className="bg-surface-2 border border-borderDef p-3 sm:p-3.5 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-textPrimary font-mono">
                    <i className="ri-server-line text-accent"></i>
                    Серверы и хранение файлов
                  </div>
                  <p className="text-[11px] sm:text-xs text-textTertiary leading-relaxed">
                    Проекту нужны стабильные серверы, база данных, хранение изображений, билдов и материалов игр.
                  </p>
                </div>

                <div className="bg-surface-2 border border-borderDef p-3 sm:p-3.5 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-textPrimary font-mono">
                    <i className="ri-tools-line text-accent"></i>
                    Разработка и поддержка
                  </div>
                  <p className="text-[11px] sm:text-xs text-textTertiary leading-relaxed">
                    Мы улучшаем платформу, исправляем ошибки, добавляем новые страницы, фильтры, профили, джемы и инструменты.
                  </p>
                </div>

                <div className="bg-surface-2 border border-borderDef p-3 sm:p-3.5 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-textPrimary font-mono">
                    <i className="ri-layout-grid-line text-accent"></i>
                    Интерфейс и новые функции
                  </div>
                  <p className="text-[11px] sm:text-xs text-textTertiary leading-relaxed">
                    Поддержка помогает делать HUBIGR удобнее, быстрее и приятнее для участников, авторов и организаторов.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR SECTION */}
      <section id="qr-section" className="py-12 sm:py-16 md:py-24 border-b border-borderDef bg-surface-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="bg-surface-1 border border-borderDef rounded-2xl p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8 shadow-elevation-base">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-5 flex flex-col items-center text-center space-y-3 bg-surface-2 border border-borderDef p-5 sm:p-6 rounded-xl">
                <div className="w-44 h-44 sm:w-52 sm:h-52 bg-white p-3 rounded-2xl shadow-elevation-raised flex items-center justify-center">
                  <svg className="w-full h-full text-black" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0,0 h35 v35 h-35 z M5,5 v25 h25 v-25 z M10,10 h15 v15 h-15 z"/>
                    <path d="M65,0 h35 v35 h-35 z M70,5 v25 h25 v-25 z M75,10 h15 v15 h-15 z"/>
                    <path d="M0,65 h35 v35 h-35 z M5,70 v25 h25 v-25 z M10,75 h15 v15 h-15 z"/>
                    <rect x="42" y="5" width="16" height="8"/>
                    <rect x="42" y="18" width="8" height="16"/>
                    <rect x="52" y="26" width="8" height="8"/>
                    <rect x="5" y="42" width="16" height="8"/>
                    <rect x="25" y="42" width="12" height="12"/>
                    <rect x="42" y="42" width="16" height="16"/>
                    <rect x="62" y="42" width="12" height="8"/>
                    <rect x="80" y="42" width="15" height="15"/>
                    <rect x="42" y="65" width="8" height="18"/>
                    <rect x="54" y="65" width="16" height="8"/>
                    <rect x="54" y="78" width="8" height="16"/>
                    <rect x="68" y="78" width="12" height="16"/>
                    <rect x="84" y="65" width="11" height="11"/>
                    <rect x="84" y="82" width="11" height="12"/>
                  </svg>
                </div>
                <span className="text-xs font-mono text-textTertiary">
                  Отсканируйте QR-код через банковское приложение.
                </span>
              </div>

              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-surface-2 border border-borderDef rounded-full text-xs font-mono text-textTertiary">
                  <i className="ri-qr-code-line text-accent"></i>
                  ПЕРЕВОД ПО QR-КОДУ
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-textPrimary leading-tight">
                  Поддержите проект любой <span className="text-accent">удобной суммой</span>
                </h2>

                <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                  Откройте банковское приложение, наведите камеру на QR-код и отправьте любую сумму. Даже небольшой перевод помогает нам оплачивать серверы, развивать платформу и выпускать новые функции.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 font-mono">
                  <div className="bg-surface-2 border border-borderDef p-3 rounded-xl space-y-1">
                    <span className="text-accent font-bold text-base">1</span>
                    <div className="text-xs text-textPrimary font-sans font-semibold">Откройте приложение банка</div>
                  </div>
                  <div className="bg-surface-2 border border-borderDef p-3 rounded-xl space-y-1">
                    <span className="text-accent font-bold text-base">2</span>
                    <div className="text-xs text-textPrimary font-sans font-semibold">Отсканируйте QR-код</div>
                  </div>
                  <div className="bg-surface-2 border border-borderDef p-3 rounded-xl space-y-1">
                    <span className="text-accent font-bold text-base">3</span>
                    <div className="text-xs text-textPrimary font-sans font-semibold">Укажите любую сумму</div>
                  </div>
                </div>

                <div className="flex items-start sm:items-center gap-2.5 bg-warning/10 border border-warning/30 p-3 rounded-xl text-xs text-warning">
                  <i className="ri-checkbox-circle-line text-base shrink-0 mt-0.5 sm:mt-0"></i>
                  <span>Поддержка добровольная. Это не покупка услуги, а помощь в развитии платформы.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AD SUPPORT SECTION */}
      <section id="ad-support" className="py-12 sm:py-16 md:py-24 border-b border-borderDef bg-surface-1">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="bg-surface-2 border border-borderDef p-5 sm:p-8 md:p-10 rounded-2xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-1 border border-borderDef rounded-full text-xs font-mono text-textTertiary">
                  <i className="ri-sparkling-line text-accent"></i>
                  ПОДДЕРЖКА БЕЗ ПЕРЕВОДА
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-textPrimary leading-tight">
                  Посмотрите рекламу и помогите <span className="text-accent">проекту развиваться</span>
                </h2>

                <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                  Если сейчас неудобно поддержать деньгами, можно просто открыть рекламный блок. Для вас это несколько секунд, а для проекта — помощь в оплате серверов, разработке и улучшении платформы.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={watching}
                  onClick={handleWatchAd}
                >
                  {watching ? "Загрузка блока..." : completed ? "Спасибо за просмотр!" : "Посмотреть рекламу"}
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={handleShare}
                >
                  {copied ? "Ссылка скопирована!" : "Поделиться"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING BANNER */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-borderDef bg-surface-1">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="bg-surface-2 border border-borderDef p-6 sm:p-8 md:p-10 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left max-w-2xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-textPrimary">
                Спасибо за любую поддержку
              </h2>
              <p className="text-xs sm:text-sm text-textSecondary">
                Не можете поддержать деньгами? Просто посмотрите короткую рекламу или поделитесь проектом с друзьями. Для вас это мелочь, а для нас — реальная помощь.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
              <Button 
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => onNavigate?.('/market')}
              >
                В маркет
              </Button>
              <Button 
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => onNavigate?.('/jams')}
              >
                Смотреть джемы
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
