'use client'

import { useState } from 'react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  pathTitle: string
  isDeleting?: boolean
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  pathTitle,
  isDeleting = false
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-red-600 text-lg">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Delete Learning Path
          </h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            Are you sure you want to delete <strong>"{pathTitle}"</strong>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              <strong>This action cannot be undone.</strong> This will permanently delete:
            </p>
            <ul className="text-sm text-red-600 mt-2 list-disc list-inside">
              <li>All learning milestones and resources</li>
              <li>Your progress tracking data</li>
              <li>Any completed milestone records</li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <span className="mr-1">🗑️</span>
                Delete Path
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
