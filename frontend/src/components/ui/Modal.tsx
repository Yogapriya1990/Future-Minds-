import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ReactNode, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const sizeMap: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-5xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  className,
}: ModalProps) {
  const shouldReduce = useReducedMotion();

  // Trap focus + close on Escape
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  const panelVariants = shouldReduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden:  { opacity: 0, scale: 0.96, y: 12 },
        visible: { opacity: 1, scale: 1,    y: 0  },
        exit:    { opacity: 0, scale: 0.97, y: 8  },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduce ? 0 : 0.18 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: shouldReduce ? 0 : 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
              'relative w-full bg-white rounded-2xl shadow-modal border border-slate-100 overflow-hidden z-10',
              sizeMap[size],
              className
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className={cn('flex items-start justify-between px-5 pt-5', description ? 'pb-0' : 'pb-4 border-b border-slate-100')}>
                <div>
                  {title && (
                    <h2 className="text-base font-bold text-slate-900 leading-tight">{title}</h2>
                  )}
                  {description && (
                    <p className="text-sm text-slate-500 mt-1">{description}</p>
                  )}
                </div>
                {showCloseButton && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="ml-4 flex-shrink-0 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </motion.button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={cn('px-5', title || showCloseButton ? 'py-4' : 'pt-5 pb-4')}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Confirm dialog shorthand ─────────────────────────────────────────────────

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen, onClose, onConfirm,
  title, message,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  variant = 'danger',
  isLoading,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={message} size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {cancelLabel}
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60',
              variant === 'danger'
                ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400'
                : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500'
            )}
          >
            {isLoading ? 'Loading…' : confirmLabel}
          </motion.button>
        </>
      }
    >
      {null}
    </Modal>
  );
}
