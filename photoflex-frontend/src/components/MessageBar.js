import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function MessageBar({ message, setMessage }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-green-500', // Standard green for success
      text: 'text-white',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-600', // Using red-600 to match new accent
      text: 'text-white',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-yellow-400', // Changed from blue to yellow/gold (standard Tailwind class)
      text: 'text-black', // Ensure text is visible on yellow background
      icon: Info,
    },
  };

  const style = styles[message.type] || styles.info;
  const Icon = style.icon;

  return (
    <div className={`fixed top-4 right-4 z-50 ${style.bg} ${style.text} p-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md animate-slide-in`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 font-medium">{message.text}</p>
      <button
        onClick={() => setMessage(null)}
        className="p-1 rounded-full hover:bg-black/10 transition"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}