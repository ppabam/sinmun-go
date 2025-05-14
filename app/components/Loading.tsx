// components/Loading.tsx
'use client';

import { Loader2 } from 'lucide-react'; // lucide-react 아이콘 사용 (Tailwind 기반)
import { motion } from 'framer-motion';

export default function Loading({ message = "로딩 중입니다..." }: { message?: string }) {
  return (
    <div className="flex h-[60vh] items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-4"
      >
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-lg font-medium text-gray-700">{message}</p>
      </motion.div>
    </div>
  );
}
