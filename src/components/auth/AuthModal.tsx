import React, { useState, useEffect, useRef, ChangeEvent, FormEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Checkbox } from '../ui/Checkbox';

type AuthView = 'LOGIN' | 'REGISTER' | 'VERIFY_EMAIL' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD' | 'OAUTH_COMPLETION';
type DevSimStatus = 'success' | 'wrong' | 'banned' | 'conflict' | 'limit';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

const RESERVED_NICKS = ['admin', 'support', 'mod', 'hubigr', 'api', 'null', 'root', 'system'];

const Icons = {
  X: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Info: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  AlertCircle: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  EyeOff: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
  ),
  Check: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  MailOpen: () => (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  Loader2: () => (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
  ShieldAlert: () => (
    <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authView, setAuthView, contextMessage, login } = useAuth();

  const [simStatus, setSimStatus] = useState<DevSimStatus>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login Form
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRemember, setLoginRemember] = useState(true);
  const [isCaptchaSolved, setIsCaptchaSolved] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loginError, setLoginError] = useState<React.ReactNode | null>(null);

  // Registration Form
  const [regEmail, setRegEmail] = useState('');
  const [regEmailStatus, setRegEmailStatus] = useState<{ text: string; type: 'idle' | 'loading' | 'error' | 'success' }>({ text: '', type: 'idle' });
  const [regNick, setRegNick] = useState('');
  const [regNickStatus, setRegNickStatus] = useState<{ text: string; type: 'idle' | 'loading' | 'error' | 'success' }>({ text: '', type: 'idle' });
  const [regNickErr, setRegNickErr] = useState<string | null>(null);
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regDOB, setRegDOB] = useState('');
  const [regTerms, setRegTerms] = useState(false);
  const [regError, setRegError] = useState<React.ReactNode | null>(null);

  // Completion Form (OAuth)
  const [completionNick, setCompletionNick] = useState('');
  const [completionNickStatus, setCompletionNickStatus] = useState<{ text: string; type: 'idle' | 'loading' | 'error' | 'success' }>({ text: '', type: 'idle' });
  const [completionDOB, setCompletionDOB] = useState('');
  const [completionTerms, setCompletionTerms] = useState(false);

  // OTP Verification Form
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(59);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Reset Password Forms
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const emailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerActive && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, resendTimer]);

  const startResendTimer = () => {
    setResendTimer(59);
    setIsTimerActive(true);
  };

  const switchAuthView = (targetView: AuthView) => {
    setAuthView(targetView);
    setLoginError(null);
    setRegError(null);

    if (targetView === 'VERIFY_EMAIL') {
      setOtpValues(['', '', '', '', '', '']);
      startResendTimer();
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  };

  const quickSwitchToLogin = (prefillEmail: string = '') => {
    switchAuthView('LOGIN');
    if (prefillEmail) {
      setLoginInput(prefillEmail);
    }
  };

  const resetAllForms = () => {
    setLoginInput('');
    setLoginPassword('');
    setShowCaptcha(false);
    setIsCaptchaSolved(false);
    setLoginError(null);

    setRegEmail('');
    setRegEmailStatus({ text: '', type: 'idle' });
    setRegNick('');
    setRegNickStatus({ text: '', type: 'idle' });
    setRegNickErr(null);
    setRegPassword('');
    setShowRegPassword(false);
    setRegDOB('');
    setRegTerms(false);
    setRegError(null);

    setCompletionNick('');
    setCompletionNickStatus({ text: '', type: 'idle' });
    setCompletionDOB('');
    setCompletionTerms(false);

    setOtpValues(['', '', '', '', '', '']);
    setForgotEmail('');
    setForgotSubmitted(false);
    setResetPassword('');
    setResetConfirmPassword('');
  };

  const handleRegEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRegEmail(val);
    setRegEmailStatus({ text: 'проверка...', type: 'loading' });

    if (emailTimerRef.current) clearTimeout(emailTimerRef.current);

    emailTimerRef.current = setTimeout(() => {
      const cleanVal = val.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!cleanVal) {
        setRegEmailStatus({ text: '', type: 'idle' });
      } else if (!emailRegex.test(cleanVal)) {
        setRegEmailStatus({ text: 'некорректный email', type: 'error' });
      } else if (cleanVal === 'taken@example.com' || cleanVal === 'busy@example.com') {
        setRegEmailStatus({ text: 'занят', type: 'error' });
      } else {
        setRegEmailStatus({ text: 'свободен', type: 'success' });
      }
    }, 300);
  };

  const handleRegNickChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRegNick(val);
    setRegNickStatus({ text: 'проверка...', type: 'loading' });
    setRegNickErr(null);

    if (nickTimerRef.current) clearTimeout(nickTimerRef.current);

    nickTimerRef.current = setTimeout(() => {
      const cleanVal = val.toLowerCase().trim();
      if (RESERVED_NICKS.includes(cleanVal)) {
        setRegNickStatus({ text: 'зарезервирован', type: 'error' });
        setRegNickErr('Этот никнейм зарезервирован системой платформы.');
      } else if (cleanVal.length > 0 && cleanVal.length < 2) {
        setRegNickStatus({ text: 'минимум 2 символа', type: 'error' });
      } else if (cleanVal.length >= 2) {
        setRegNickStatus({ text: 'доступен', type: 'success' });
      } else {
        setRegNickStatus({ text: '', type: 'idle' });
      }
    }, 300);
  };

  const calculatePasswordStrength = (pass: string): number => {
    let score = 0;
    if (pass.length > 0) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const renderStrengthMeter = (score: number) => {
    let colorClass = 'bg-danger';
    if (score === 3) colorClass = 'bg-warning';
    if (score === 4) colorClass = 'bg-success';

    return (
      <div className="flex gap-1.5 pt-1 h-1.5">
        {[1, 2, 3, 4].map((seg) => (
          <div key={seg} className="flex-1 bg-surface-0 rounded-full overflow-hidden">
            <div
              className={`h-full w-full transition-colors duration-300 ${
                seg <= score ? colorClass : 'bg-surface-3'
              }`}
            />
          </div>
        ))}
      </div>
    );
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/[^0-9]/g, '');
    if (!cleanVal && value !== '') return;

    const newValues = [...otpValues];
    newValues[index] = cleanVal.slice(-1);
    setOtpValues(newValues);

    if (cleanVal && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').substring(0, 6);
    if (pastedData) {
      const newValues = [...otpValues];
      for (let i = 0; i < pastedData.length; i++) {
        newValues[i] = pastedData[i];
      }
      setOtpValues(newValues);
      if (pastedData.length < 6) {
        otpRefs.current[pastedData.length]?.focus();
      } else {
        otpRefs.current[5]?.blur();
      }
    }
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    setTimeout(() => {
      setIsSubmitting(false);

      if (simStatus === 'wrong') {
        setLoginError('Неверный логин или пароль.');
        return;
      }

      if (simStatus === 'banned') {
        setLoginError(
          <span>
            Ваш аккаунт заблокирован.
            <br />
            <span className="text-xs opacity-90">
              Причина: Спам и нарушение правил.
              <br />
              Срок блокировки: до 31.12.2026 23:59
            </span>
          </span>
        );
        return;
      }

      if (simStatus === 'limit') {
        if (!showCaptcha) {
          setShowCaptcha(true);
          setLoginError('Превышен лимит попыток. Подтвердите, что вы не робот.');
          return;
        } else if (!isCaptchaSolved) {
          setLoginError('Пожалуйста, пройдите проверку капчи.');
          return;
        }
      }

      // Success - mock user login
      login({
        id: 'user_123',
        email: loginInput.includes('@') ? loginInput : 'user@hubigr.com',
        nickname: loginInput.includes('@') ? loginInput.split('@')[0] : loginInput,
      });
      showToast('Успешный вход в систему!', 'success');
      resetAllForms();
    }, 600);
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanNick = regNick.toLowerCase().trim();

    if (RESERVED_NICKS.includes(cleanNick)) {
      showToast('Использование зарезервированного никнейма запрещено', 'error');
      return;
    }

    setIsSubmitting(true);
    setRegError(null);

    setTimeout(() => {
      setIsSubmitting(false);

      if (simStatus === 'conflict') {
        setRegError(
          <span>
            Пользователь с такой почтой уже зарегистрирован.{' '}
            <button
              type="button"
              onClick={() => quickSwitchToLogin(regEmail)}
              className="font-bold underline hover:text-textPrimary ml-1"
            >
              Войти?
            </button>
          </span>
        );
        return;
      }

      switchAuthView('VERIFY_EMAIL');
    }, 600);
  };

  const handleVerifySubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      
      // Success - mock user registration
      login({
        id: 'user_new',
        email: regEmail,
        nickname: regNick,
      });
      showToast('Почта успешно подтверждена!', 'success');
      resetAllForms();
    }, 600);
  };

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setForgotSubmitted(true);
    }, 600);
  };

  const handleResetSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (resetPassword !== resetConfirmPassword) {
      showToast('Пароли не совпадают!', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Пароль изменён! Сессии аннулированы.', 'success');
      switchAuthView('LOGIN');
    }, 600);
  };

  const handleCloseModal = () => {
    closeAuthModal();
    setTimeout(() => {
      resetAllForms();
    }, 300);
  };

  if (!isAuthModalOpen) return null;

  return (
    <>
      {/* Auth Modal Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto animate-fadeIn safe-area-pb"
        onClick={handleCloseModal}
      >
        <div
          className="relative w-full max-w-[440px] bg-surface-1 border-t sm:border border-borderDef rounded-t-2xl sm:rounded-card shadow-elevation-overlay max-h-[92vh] sm:max-h-[90vh] overflow-y-auto touch-scroll p-6 sm:p-7 animate-slideUpBottom sm:animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Drag Handle */}
          <div className="w-10 h-1.5 bg-surface-4 rounded-full mx-auto -mt-2 mb-4 sm:hidden shrink-0 cursor-grab" />

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={handleCloseModal}
            className="absolute top-4 right-4 p-2 text-textTertiary hover:text-textPrimary rounded-control hover:bg-surface-2 active:bg-surface-3 transition-colors z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent touch-manipulation cursor-pointer"
            aria-label="Закрыть"
          >
            <Icons.X />
          </button>

          {/* Return Context Notice Banner */}
          {contextMessage && (
            <div className="mb-5 p-3 bg-warning/10 border border-warning/30 rounded-control text-xs text-textPrimary flex items-center gap-2.5">
              <Icons.Info />
              <span className="leading-snug font-sans">{contextMessage}</span>
            </div>
          )}

          {/* LOGIN View */}
          {authView === 'LOGIN' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-textPrimary tracking-tight">Вход в аккаунт</h2>
                <p className="text-xs text-textTertiary mt-1 font-sans">С возвращением на платформу HUBIGR</p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-control flex items-start gap-2.5">
                  <Icons.AlertCircle />
                  <div className="text-danger text-xs leading-snug">{loginError}</div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="login-input" className="block text-caption font-bold text-textSecondary uppercase tracking-wider font-mono">
                    Никнейм или Email
                  </label>
                  <input
                    type="text"
                    id="login-input"
                    required
                    autoComplete="username"
                    placeholder="user@example.com или @nickname"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className="w-full h-10 px-3.5 bg-surface-2 border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent rounded-control text-xs text-textPrimary placeholder:text-textTertiary transition-all outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-password" className="block text-caption font-bold text-textSecondary uppercase tracking-wider font-mono">
                      Пароль
                    </label>
                    <button
                      type="button"
                      onClick={() => switchAuthView('FORGOT_PASSWORD')}
                      className="text-caption font-mono text-textTertiary hover:text-accent transition-colors"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      id="login-password"
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full h-10 pl-3.5 pr-10 bg-surface-2 border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent rounded-control text-xs text-textPrimary placeholder:text-textTertiary transition-all tracking-widest outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-textTertiary hover:text-textPrimary p-1 rounded-control transition-colors"
                      tabIndex={-1}
                    >
                      {showLoginPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>
                </div>

                {/* Rate Limiting Captcha Simulation */}
                {showCaptcha && (
                  <div className="p-3 bg-surface-2 border border-borderDef rounded-control flex items-center justify-between">
                    <Checkbox 
                      checked={isCaptchaSolved}
                      onChange={setIsCaptchaSolved}
                      label="Я не робот (reCAPTCHA)"
                    />
                    <Icons.ShieldAlert />
                  </div>
                )}

                {/* Remember Me */}
                <div className="pt-1">
                  <Checkbox 
                    checked={loginRemember}
                    onChange={setLoginRemember}
                    label="Запомнить меня"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 mt-2 bg-accent hover:bg-accent-hover active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-control transition-all duration-fast flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? <Icons.Loader2 /> : 'Вход'}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-borderDef/50"></div>
                </div>
                <div className="relative flex justify-center text-[11px]">
                  <span className="bg-surface-1 px-3 text-textTertiary uppercase tracking-wider font-bold">Или войти через</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-2">
                <button type="button" className="flex items-center justify-center h-10 bg-[#0077FF]/10 text-[#0077FF] hover:bg-[#0077FF]/20 rounded-control transition-colors font-bold text-xs" onClick={() => switchAuthView('OAUTH_COMPLETION')}>
                  VK
                </button>
                <button type="button" className="flex items-center justify-center h-10 bg-[#FC3F1D]/10 text-[#FC3F1D] hover:bg-[#FC3F1D]/20 rounded-control transition-colors font-bold text-xs" onClick={() => switchAuthView('OAUTH_COMPLETION')}>
                  Яндекс
                </button>
                <button type="button" className="flex items-center justify-center h-10 bg-surface-2 text-textPrimary hover:bg-surface-3 border border-borderDef rounded-control transition-colors font-bold text-xs" onClick={() => switchAuthView('OAUTH_COMPLETION')}>
                  Госуслуги
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-borderDef/30 text-center text-xs text-textSecondary font-sans">
                У вас еще нет аккаунта?{' '}
                <button
                  type="button"
                  onClick={() => switchAuthView('REGISTER')}
                  className="font-bold text-textPrimary hover:text-accent transition-colors cursor-pointer"
                >
                  Зарегистрироваться
                </button>
              </div>
            </div>
          )}

          {/* REGISTER View */}
          {authView === 'REGISTER' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-textPrimary tracking-tight">Создать аккаунт</h2>
                <p className="text-sm text-textSecondary mt-1.5">Присоединяйтесь к платформе HUBIGR</p>
              </div>

              {regError && (
                <div className="mb-5 p-3.5 bg-danger/10 border border-danger/20 rounded-control flex items-start gap-2.5">
                  <Icons.AlertCircle />
                  <div className="text-danger text-sm leading-snug">{regError}</div>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="reg-email" className="block text-xs font-bold text-textPrimary uppercase tracking-wider font-mono">
                      Email <span className="text-danger">*</span>
                    </label>
                    <span
                      className={`text-xs font-mono ${
                        regEmailStatus.type === 'error'
                          ? 'text-danger'
                          : regEmailStatus.type === 'success'
                          ? 'text-success'
                          : 'text-textTertiary'
                      }`}
                    >
                      {regEmailStatus.text}
                    </span>
                  </div>
                  <input
                    type="email"
                    id="reg-email"
                    required
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={handleRegEmailChange}
                    className="w-full h-11 px-4 bg-surface-2 border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent rounded-control text-xs text-textPrimary placeholder:text-textTertiary transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="reg-nick" className="block text-xs font-bold text-textPrimary uppercase tracking-wider font-mono">
                      Никнейм <span className="text-danger">*</span>
                    </label>
                    <span
                      className={`text-xs font-mono ${
                        regNickStatus.type === 'error'
                          ? 'text-danger'
                          : regNickStatus.type === 'success'
                          ? 'text-success'
                          : 'text-textTertiary'
                      }`}
                    >
                      {regNickStatus.text}
                    </span>
                  </div>
                  <input
                    type="text"
                    id="reg-nick"
                    required
                    minLength={2}
                    maxLength={20}
                    pattern="[A-Za-z0-9_]+"
                    placeholder="От 2 до 20 символов (a-z, 0-9, _)"
                    value={regNick}
                    onChange={handleRegNickChange}
                    className="w-full h-11 px-4 bg-surface-2 border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent rounded-control text-xs text-textPrimary placeholder:text-textTertiary transition-all outline-none"
                  />
                  {regNickErr && <p className="text-xs text-danger mt-1">{regNickErr}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="reg-password" className="block text-xs font-bold text-textPrimary uppercase tracking-wider font-mono">
                    Пароль <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      id="reg-password"
                      required
                      minLength={8}
                      placeholder="Минимум 8 символов"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full h-11 pl-4 pr-11 bg-surface-2 border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent rounded-control text-xs text-textPrimary placeholder:text-textTertiary transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary p-1.5 rounded-control"
                      tabIndex={-1}
                    >
                      {showRegPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>

                  {renderStrengthMeter(calculatePasswordStrength(regPassword))}
                </div>

                <div className="space-y-2">
                  <label htmlFor="reg-dob" className="block text-xs font-bold text-textPrimary uppercase tracking-wider font-mono">
                    Дата рождения <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    id="reg-dob"
                    required
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 12)).toISOString().split('T')[0]} // 12+ validation
                    value={regDOB}
                    onChange={(e) => setRegDOB(e.target.value)}
                    className="w-full h-11 px-4 bg-surface-2 border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent rounded-control text-xs text-textPrimary placeholder:text-textTertiary transition-all outline-none"
                  />
                  <p className="text-[11px] text-textTertiary">Для регистрации вам должно быть не менее 12 лет.</p>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer group pt-2 select-none">
                  <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      required
                      checked={regTerms}
                      onChange={(e) => setRegTerms(e.target.checked)}
                      className="peer appearance-none w-4 h-4 rounded-control border border-borderDef bg-surface-2 checked:bg-accent checked:border-accent transition-colors cursor-pointer"
                    />
                    <span className="absolute opacity-0 peer-checked:opacity-100 text-black pointer-events-none transition-opacity">
                      <Icons.Check />
                    </span>
                  </div>
                  <span className="text-xs text-textSecondary leading-snug group-hover:text-textPrimary transition-colors font-sans">
                    Я принимаю{' '}
                    <a href="#" className="text-textPrimary underline hover:text-accent transition-colors" onClick={(e) => e.stopPropagation()}>
                      Условия использования
                    </a>{' '}
                    и{' '}
                    <a href="#" className="text-textPrimary underline hover:text-accent transition-colors" onClick={(e) => e.stopPropagation()}>
                      Политику конфиденциальности
                    </a>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 mt-4 bg-accent hover:bg-accent-hover active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-control transition-all duration-fast flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? <Icons.Loader2 /> : 'Зарегистрироваться'}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-borderDef/50"></div>
                </div>
                <div className="relative flex justify-center text-[11px]">
                  <span className="bg-surface-1 px-3 text-textTertiary uppercase tracking-wider font-bold">Или через соцсети</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-2">
                <button type="button" className="flex items-center justify-center h-10 bg-[#0077FF]/10 text-[#0077FF] hover:bg-[#0077FF]/20 rounded-control transition-colors font-bold text-xs" onClick={() => switchAuthView('OAUTH_COMPLETION')}>
                  VK
                </button>
                <button type="button" className="flex items-center justify-center h-10 bg-[#FC3F1D]/10 text-[#FC3F1D] hover:bg-[#FC3F1D]/20 rounded-control transition-colors font-bold text-xs" onClick={() => switchAuthView('OAUTH_COMPLETION')}>
                  Яндекс
                </button>
                <button type="button" className="flex items-center justify-center h-10 bg-surface-2 text-textPrimary hover:bg-surface-3 border border-borderDef rounded-control transition-colors font-bold text-xs" onClick={() => switchAuthView('OAUTH_COMPLETION')}>
                  Госуслуги
                </button>
              </div>

              <div className="mt-8 text-center text-xs text-textSecondary font-sans">
                Уже есть аккаунт?{' '}
                <button
                  type="button"
                  onClick={() => switchAuthView('LOGIN')}
                  className="font-bold text-textPrimary hover:text-accent transition-colors cursor-pointer"
                >
                  Войти
                </button>
              </div>
            </div>
          )}

          {/* OAUTH COMPLETION View */}
          {authView === 'OAUTH_COMPLETION' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-textPrimary tracking-tight">Завершение регистрации</h2>
                <p className="text-sm text-textSecondary mt-1.5">Вы вошли через соцсеть. Пожалуйста, укажите недостающие данные.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); login({ id: 'social', email: 'social@example.com', nickname: completionNick }); }} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="comp-nick" className="block text-xs font-bold text-textPrimary uppercase tracking-wider font-mono">
                      Никнейм <span className="text-danger">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    id="comp-nick"
                    required
                    minLength={2}
                    maxLength={20}
                    pattern="[A-Za-z0-9_]+"
                    placeholder="От 2 до 20 символов (a-z, 0-9, _)"
                    value={completionNick}
                    onChange={(e) => setCompletionNick(e.target.value)}
                    className="w-full h-11 px-4 bg-surface-2 border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent rounded-control text-xs text-textPrimary placeholder:text-textTertiary transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="comp-dob" className="block text-xs font-bold text-textPrimary uppercase tracking-wider font-mono">
                    Дата рождения <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    id="comp-dob"
                    required
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 12)).toISOString().split('T')[0]}
                    value={completionDOB}
                    onChange={(e) => setCompletionDOB(e.target.value)}
                    className="w-full h-11 px-4 bg-surface-2 border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent rounded-control text-xs text-textPrimary placeholder:text-textTertiary transition-all outline-none"
                  />
                  <p className="text-[11px] text-textTertiary">Для регистрации вам должно быть не менее 12 лет.</p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group pt-2 select-none">
                  <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      required
                      checked={completionTerms}
                      onChange={(e) => setCompletionTerms(e.target.checked)}
                      className="peer appearance-none w-4 h-4 rounded-control border border-borderDef bg-surface-2 checked:bg-accent checked:border-accent transition-colors cursor-pointer"
                    />
                    <span className="absolute opacity-0 peer-checked:opacity-100 text-black pointer-events-none transition-opacity">
                      <Icons.Check />
                    </span>
                  </div>
                  <span className="text-xs text-textSecondary leading-snug group-hover:text-textPrimary transition-colors font-sans">
                    Я принимаю{' '}
                    <a href="#" className="text-textPrimary underline hover:text-accent transition-colors" onClick={(e) => e.stopPropagation()}>
                      Условия использования
                    </a>{' '}
                    и{' '}
                    <a href="#" className="text-textPrimary underline hover:text-accent transition-colors" onClick={(e) => e.stopPropagation()}>
                      Политику конфиденциальности
                    </a>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 mt-4 bg-accent hover:bg-accent-hover active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-control transition-all duration-fast flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? <Icons.Loader2 /> : 'Продолжить'}
                </button>
              </form>

              <div className="mt-8 text-center text-xs text-textSecondary font-sans">
                <button
                  type="button"
                  onClick={() => switchAuthView('LOGIN')}
                  className="font-bold text-textPrimary hover:text-accent transition-colors cursor-pointer"
                >
                  Вернуться ко входу
                </button>
              </div>
            </div>
          )}

          {/* VERIFY_EMAIL View */}
          {authView === 'VERIFY_EMAIL' && (
            <div>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-surface-2 border border-borderDef/40 flex items-center justify-center mx-auto mb-4 text-textPrimary">
                  <Icons.MailOpen />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-textPrimary tracking-tight">Введите код</h2>
                <p className="text-xs text-textSecondary mt-2 leading-relaxed font-sans">
                  Мы отправили 6-значный код на<br />
                  <strong className="text-textPrimary font-bold font-mono text-sm">{regEmail || 'user@example.com'}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-8">
                <div className="flex justify-between gap-2">
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-full h-12 text-center bg-surface-2 border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent rounded-control text-xl font-bold font-mono text-textPrimary transition-all outline-none"
                      required
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-accent hover:bg-accent-hover active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-control transition-all duration-fast flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? <Icons.Loader2 /> : 'Подтвердить почту'}
                </button>
              </form>

              <div className="mt-8 text-center text-xs font-sans">
                {isTimerActive ? (
                  <div className="text-textSecondary">
                    Отправить новый код через{' '}
                    <span className="font-mono font-bold text-textPrimary">
                      00:{resendTimer.toString().padStart(2, '0')}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={startResendTimer}
                    className="font-bold text-textPrimary hover:text-accent transition-colors cursor-pointer"
                  >
                    Отправить код еще раз
                  </button>
                )}
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => switchAuthView('REGISTER')}
                  className="text-xs text-textTertiary hover:text-textPrimary transition-colors font-mono cursor-pointer"
                >
                  Изменить адрес почты
                </button>
              </div>
            </div>
          )}

          {/* FORGOT_PASSWORD View */}
          {authView === 'FORGOT_PASSWORD' && (
            <div>
              <button
                type="button"
                onClick={() => switchAuthView('LOGIN')}
                className="mb-6 text-xs font-bold text-textTertiary hover:text-textPrimary flex items-center gap-1.5 transition-colors font-mono uppercase tracking-wider cursor-pointer"
              >
                <Icons.ArrowLeft />
                Назад ко входу
              </button>

              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-textPrimary tracking-tight">Сброс пароля</h2>
                <p className="text-sm text-textSecondary mt-1.5">Укажите email, привязанный к аккаунту</p>
              </div>

              {!forgotSubmitted ? (
                <form onSubmit={handleForgotSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="forgot-email" className="block text-xs font-bold text-textPrimary uppercase tracking-wider font-mono">
                      Email аккаунта
                    </label>
                    <input
                      type="email"
                      id="forgot-email"
                      required
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full h-11 px-4 bg-surface-2 border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent rounded-control text-xs text-textPrimary placeholder:text-textTertiary transition-all outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-accent hover:bg-accent-hover active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-control transition-all duration-fast flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? <Icons.Loader2 /> : 'Получить ссылку'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-4 text-success">
                    <Icons.Check />
                  </div>
                  <h3 className="text-xl font-bold text-textPrimary mb-2">Ссылка отправлена!</h3>
                  <p className="text-xs text-textSecondary leading-relaxed mb-4 font-sans">
                    Проверьте вашу почту и папку "Спам". Ссылка действительна 15 минут.
                  </p>
                  <button
                    type="button"
                    onClick={() => switchAuthView('RESET_PASSWORD')}
                    className="text-xs text-accent underline hover:text-accent/80 font-mono"
                  >
                    (Симуляция перехода по ссылке из письма)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* RESET_PASSWORD View */}
          {authView === 'RESET_PASSWORD' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-textPrimary tracking-tight">Новый пароль</h2>
                <p className="text-sm text-textSecondary mt-1.5">Придумайте надежный пароль для защиты аккаунта</p>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="reset-password" className="block text-xs font-bold text-textPrimary uppercase tracking-wider font-mono">
                    Новый пароль
                  </label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? 'text' : 'password'}
                      id="reset-password"
                      required
                      minLength={8}
                      placeholder="Минимум 8 символов"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      className="w-full h-11 pl-4 pr-11 bg-surface-2 border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent rounded-control text-xs text-textPrimary placeholder:text-textTertiary transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary p-1.5 rounded-control"
                      tabIndex={-1}
                    >
                      {showResetPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>

                  {renderStrengthMeter(calculatePasswordStrength(resetPassword))}
                </div>

                <div className="space-y-2">
                  <label htmlFor="reset-confirm-password" className="block text-xs font-bold text-textPrimary uppercase tracking-wider font-mono">
                    Подтвердите пароль
                  </label>
                  <input
                    type="password"
                    id="reset-confirm-password"
                    required
                    placeholder="Повторите пароль"
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    className="w-full h-11 px-4 bg-surface-2 border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent rounded-control text-xs text-textPrimary placeholder:text-textTertiary transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 mt-2 bg-accent hover:bg-accent-hover active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-control transition-all duration-fast flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? <Icons.Loader2 /> : 'Сохранить пароль'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Global Toast Container */}
      <div className="fixed bottom-6 right-6 z-toast flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-surface-1 border border-borderDef text-textPrimary px-4 py-3 rounded-xl text-xs font-medium shadow-2xl flex items-center gap-2.5 transition-all duration-300 pointer-events-auto"
          >
            {toast.type === 'success' ? (
              <span className="text-success shrink-0">
                <Icons.Check />
              </span>
            ) : (
              <span className="text-danger shrink-0">
                <Icons.AlertCircle />
              </span>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
