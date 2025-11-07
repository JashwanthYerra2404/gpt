'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'

export default function FileUploadMenu({ onFileSelect }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    // console.log('File change triggered') // Debug log
    const selected = e.target.files[0]
    if (!selected) return

    // console.log('Selected file:', selected) // Debug log
    setFile(selected)

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        // console.log('Preview generated') // Debug log
        setPreview(e.target.result)
      }
      reader.readAsDataURL(selected)
    } else {
      setPreview(null)
    }

    onFileSelect?.(selected)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    onFileSelect?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="relative">
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton
          className="inline-flex items-center gap-2 rounded-full px-3 py-3 
                     text-sm font-semibold text-white hover:bg-emerald-500 
                     shadow-inner shadow-white/10 focus:outline-none"
        >
          <FontAwesomeIcon icon={faPlus} />
        </MenuButton>

        <MenuItems
          transition
          anchor="top start"
          className="w-56 origin-top-right rounded-xl border border-white/5 bg-[#1e1e20] 
                     p-1 text-sm text-white shadow-lg transition duration-100 ease-out 
                     [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 
                     data-closed:opacity-0"
        >
          <MenuItem>
            {({ active }) => (
              <button
                onClick={handleUploadClick}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  active ? 'bg-[#2a2a2d]' : ''
                } transition`}
              >
                📎 Upload file or image
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

      {file && (
        <div className="fixed left-20 bottom-20 bg-[#2a2a2d] p-2 rounded-lg shadow-md flex items-center gap-2 z-50">
          {preview ? (
            <div className="relative w-[50px] h-[50px]">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="rounded-md object-cover"
                priority
                unoptimized
              />
            </div>
          ) : (
            <p className="text-sm text-gray-300 truncate max-w-[100px]">
              {file.name}
            </p>
          )}
          <button
            onClick={clearFile}
            className="text-gray-400 hover:text-red-400 transition"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}
    </div>
  )
}