"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const ModifyVehicleModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={onClose}
                aria-label="Fermer le modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Title */}
              <h2 className="text-xl font-semibold mb-4">{title}</h2>

              {/* Modal Content */}
              <div>{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
