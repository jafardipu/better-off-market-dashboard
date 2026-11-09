"use client";

import type React from "react";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type TCustomToastProps = {
  title?: string;
  body?: string;
  url?: string;
  duration?: number;
  onClose?: () => void;
};

const CustomToast = ({
  title,
  body,
  url = "/notifications",
  duration = 5000,
  onClose,
}: TCustomToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200);
  };

  // Auto-dismiss after duration
  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        transform transition-all duration-200 ease-out
        ${isExiting ? "translate-x-full opacity-0" : "-translate-x-0 opacity-100"}
      `}
    >
      <Link
        href={url}
        className='block group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl'
      >
        <div className='bg-white rounded-xl shadow-lg border border-gray-200/60 overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-gray-300/80 hover:-translate-y-0.5'>
          {/* Main content */}
          <div className='p-5 pr-12 relative'>
            {/* Close button */}
            <button
              onClick={handleClose}
              className='absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300'
              aria-label='Close notification'
            >
              <X size={18} />
            </button>

            {/* Title */}
            {title && (
              <h3 className='font-semibold text-gray-900 text-base leading-tight mb-2 pr-2'>
                {title}
              </h3>
            )}

            {/* Body */}
            {body && <p className='text-gray-600 text-sm leading-relaxed pr-2'>{body}</p>}
          </div>

          {/* Footer */}
          <div className='bg-gradient-to-r from-gray-50 to-gray-50/80 px-5 py-3 border-t border-gray-100/80'>
            <div className='flex items-center justify-between'>
              <p className='text-xs text-gray-500 font-medium'>Click to view details</p>
              <div className='w-1.5 h-1.5 bg-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200' />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CustomToast;
