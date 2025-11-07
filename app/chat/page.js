'use client'

import { useEffect, useState, useTransition } from 'react'
import {
  createChatSession,
  deleteChatSession,
  getUserChats,
  getMessages,
  getAiResponse as sendMessage,
  getAiResponseWithFile as sendMessageWithFile,
  renameSesssion,
} from './actions'
import { logout } from '../actions/auth'

import MarkdownRenderer from '@/app/components/MarkdownRenderer'
import FileUploadMenu from '@/app/components/FileUploadMenu'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faArrowUp, faCircleChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [sessions, setSessions] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [isPending, startTransition] = useTransition()
  const [selectedFile, setSelectedFile] = useState(null)
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState("");

  // Load user sessions
  useEffect(() => {
    startTransition(async () => {
      const data = await getUserChats()
      setSessions(data)
      if (data.length > 0) {
        setCurrentChat(data[0])
        const msgs = await getMessages(data[0].id)
        setMessages(msgs)
      }
    })
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    const input = e.target.elements.message
    const text = input.value.trim()
    if (!text) return
    input.value = ''

    setMessages((prev) => [...prev, { role: 'client', content: text || "Uploaded a file" }])
    startTransition(async () => {
      let reply;
      if (selectedFile) {
        reply = await sendMessageWithFile(currentChat.id, text, selectedFile)
        setSelectedFile(null)
      } else {
        reply = await (currentChat.id, text)
      }
      reply = await sendMessage(currentChat.id, text)
      setMessages((prev) => [...prev, { role: 'bot', content: reply }])
    })
  }

  const handleNewChat = async () => {
    const newSession = await createChatSession('New Chat')
    setSessions([newSession, ...sessions])
    setCurrentChat(newSession)
    setMessages([])
  }

  const handleDeleteChat = async (chat) => {
    const confirmDelete = confirm(`Delete "${chat.title}"?`)
    if (!confirmDelete) return

    try{
      await deleteChatSession(chat.id)
      // Remove chatSession from sessoins List
      setSessions((prev) => prev.filter((s) => s.id !== chat.id))

      // If deleted chat is currentChat, reset currentChat and messages
      if(currentChat?.id === chat.id){
        setCurrentChat(null)
        setMessages([])
      }

    }
    catch(err){
      console.error('Failed to delete chat session:', err)
      return
    }
  }

  return (
    <div className="flex h-screen bg-[#0e0e0f] text-gray-100">

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-[#171717] border-r border-[#2e2e30]">
        <div className="p-4 border-b border-[#2e2e30]">
          <h2 className="text-lg font-semibold text-neutral-50">GPT</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <button
            onClick={handleNewChat}
            className="w-full text-left px-3 py-2 bg-[#2a2a2d] rounded-lg hover:bg-[#343437] transition"
          >
            + New Chat
          </button>

          {/* ChatSessions */}
          <div className="text-sm text-gray-400 mt-3 space-y-2">
          {sessions.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center justify-between px-2 py-1 rounded-lg cursor-pointer ${
                currentChat?.id === chat.id ? 'bg-[#2a2a2d] text-neutral-50' : 'hover:bg-[#2a2a2d]'
              }`}
            >
              {/* If this chat is being renamed */}
              {renamingChatId === chat.id ? (
                <input
                  autoFocus
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  onBlur={async () => {
                    if (newChatTitle.trim()) {
                      await renameSesssion(chat.id, newChatTitle.trim());
                      setSessions((prev) =>
                        prev.map((s) =>
                          s.id === chat.id ? { ...s, title: newChatTitle.trim() } : s
                        )
                      );
                    }
                    setRenamingChatId(null);
                    setNewChatTitle("");
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      e.target.blur();
                    } else if (e.key === "Escape") {
                      setRenamingChatId(null);
                      setNewChatTitle("");
                    }
                  }}
                  className="flex-1 bg-[#2a2a2d] text-gray-100 px-2 py-1 rounded-md outline-none"
                />
              ) : (
                <p
                  onClick={async () => {
                    setCurrentChat(chat);
                    const msgs = await getMessages(chat.id);
                    setMessages(msgs);
                  }}
                  className="truncate flex-1 hover:text-gray-200"
                >
                  {chat.title}
                </p>
              )}

              <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700 cursor-pointer">
                <FontAwesomeIcon icon={faCircleChevronDown} />
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 cursor-pointer"
                >
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 cursor-pointer">
                      {/* <PencilIcon className="size-4 fill-white/30" /> */}
                      Share
                      <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘E</kbd>
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 cursor-pointer"
                    onClick={() => {
                      setRenamingChatId(chat.id);
                      setNewChatTitle(chat.title);
                    }}
                    >
                      {/* <Square2StackIcon className="size-4 fill-white/30" /> */}
                      Rename
                      <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘D</kbd>
                    </button>
                  </MenuItem>
                  <div className="my-1 h-px bg-white/5" />
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 cursor-pointer">
                      Archive
                      <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘A</kbd>
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteChat(chat) 
                    }} className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 cursor-pointer">
                      {/* <TrashIcon className="size-4 fill-white/30" /> */}
                      Delete
                      <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘D</kbd>
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          ))}
          </div>

        </div>
        {/* Logout */}
        <div className="p-4 border-t border-[#2e2e30] text-sm text-gray-400">
          <button onClick={logout} className="hover:text-emerald-400 transition">Logout</button>
        </div>
      </aside>

      {/* Main Chat Section */}
      <main className="flex-1 flex justify-center items-center bg-[#1e1e20]">
        {/* Chat Container */}
        <div className="flex flex-col bg-[#1e1e20] rounded-2xl w-full max-w-4xl h-[96vh] overflow-y-auto pb-5">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-3xl text-neutral-100">
                Ready When You Are...
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === 'client' ? 'justify-end' : 'justify-start pb-5'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-[18px] ${
                      msg.role === 'client'
                        ? 'bg-[#2f2f2f] text-gray-100'
                        : ' text-gray-100'
                    }`}
                  >
                    <MarkdownRenderer content={msg.content} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat input */}
          <div className="p-2">
            <form
              onSubmit={handleSend}
              className="flex items-center gap-3 bg-[#2a2a2d] rounded-full px-4 py-2 shadow-sm border border-[#2e2e30]"
            >
              {/* File upload */}
              {/* Need to implement file upload feature */}
              {/* <FileUploadMenu onFileSelect={(file) => setSelectedFile(file)} /> */}
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
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg transition`}
                    >
                      📎 Upload file or image
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>

              {/* Input */}
              <input
                name="message"
                placeholder="Ask anything"
                className="h-12 flex-1 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none text-[18px]"
              />

              {/* Right icons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-[#3a3a3c] transition"
                >
                  <FontAwesomeIcon icon={faMicrophone} />
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="p-2 rounded-full text-black bg-neutral-50 transition"
                >
                  {isPending ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faArrowUp} />
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>

    </div>
  )
}
