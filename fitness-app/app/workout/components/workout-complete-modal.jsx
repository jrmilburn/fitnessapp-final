"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X, ArrowRight } from "lucide-react"

export default function WorkoutCompleteModal({ isOpen, onClose, onConfirm, workout }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Workout Complete</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-green-500 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Great job completing your workout!</h3>
              <p className="text-gray-600">
                You've completed all sets for "{workout?.name}". This workout will now be marked as complete and will no
                longer be editable.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Once confirmed, you won't be able to edit this workout again. You'll still be
                able to view it and your feedback.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-3"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                Confirm & Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
