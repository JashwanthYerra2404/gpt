'use server'

import prisma from '@/app/lib/db'
import { verifySession } from '@/app/lib/dal'
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function createChatSession(title = 'New Chat') {
    const session = await verifySession()
    if (!session) throw new Error('Not authenticated')
    const newSession = await prisma.chatSession.create({
      data: {
        title,
        userId: session.userId,
      },
    })
    return newSession
  }

export async function deleteChatSession(chatId) {
    const session = await verifySession()
    if (!session) throw new Error('Not authenticated')

    const chat = await prisma.chatSession.findUnique({
      where: { id: chatId },
      select: { userId: true },
    })

    if(!chat || chat.userId !== session.userId) {
      throw new Error('Chat not found or unauthorized');
    }

    // First delete the realted messages first
    await prisma.message.deleteMany({
      where: {
        sessionId: chatId,
      },
    })
    
    // Then delete the chatSession
    await prisma.chatSession.delete({
      where: {
        id: chatId,
        userId: session.userId,
      },
    })
    return { success: true };
}

  export async function getUserChats() {
    const session = await verifySession()
    if (!session) throw new Error('Not authenticated')
  
    return await prisma.chatSession.findMany({
      where: { userId: session.userId },
      orderBy: { updatedAt: 'desc' },
    })
  }

  export async function getMessages(chatId) {
    const session = await verifySession()
    if (!session) throw new Error('Not authenticated')
  
    return await prisma.message.findMany({
      where: { sessionId: chatId },
      orderBy: { createdAt: 'asc' },
    })
  }

  export async function getAiResponse(chatId, userMessage) {
    const session = await verifySession()
    if (!session) throw new Error('Not authenticated')
  
    // Save user message
    const message = await prisma.message.create({
      data: {
        sessionId: chatId,
        role: 'client',
        content: userMessage,
      },
    })

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userMessage,
      });
      
    const aiResponse = response.candidates[0].content.parts[0].text;
    await prisma.message.create({
        data: {
            sessionId: chatId,
            role: 'bot',
            content: aiResponse,
        },
    })
    return aiResponse;
    
  }

  export async function getAiResponseWithFile(chatId, userMessage, file) {
    const session = await verifySession()
    if (!session) throw new Error('Not authenticated')
  
    // Save user message first
    await prisma.message.create({
      data: {
        sessionId: chatId,
        role: 'client',
        content: userMessage || '[Uploaded a file]',
      },
    })
  
    try {
      // 🔹 Prepare Gemini multimodal input
      let contents = []

      console.log('File received in action:', file);  // Debug log

      // Add text message if present
      if (userMessage && userMessage.trim()) {
        contents.push({ text: userMessage })
      }
  
      // Handle file first
      if (file) {
        const arrayBuffer = await file.arrayBuffer()
        const base64Data = Buffer.from(arrayBuffer).toString('base64')
        const mimeType = file.type || 'application/octet-stream'

        console.log('File MIME type:', mimeType);  // Debug log
  
        contents.push({
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
        })
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
      });
  
      // // Add text message if present
      // if (userMessage && userMessage.trim()) {
      //   contents.push({ text: userMessage })
      // }
  
      const aiResponse = response.candidates?.[0]?.content?.parts?.[0]?.text || 
                        '⚠️ No response from AI.'
  
      // Save AI response to database
      await prisma.message.create({
        data: {
          sessionId: chatId,
          role: 'bot',
          content: aiResponse,
        },
      })
  
      return aiResponse
  
    } catch (error) {
      console.error('Gemini API Error:', error)
      throw new Error('Failed to process file and generate response')
    }
  }

  export async function renameSesssion(chatId, newTitle) {
    const session = await verifySession()
    if (!session) throw new Error('Not authenticated')
  
    const chat = await prisma.chatSession.findUnique({
      where: { id: chatId },
      select: { userId: true },
    })
  
    if(!chat || chat.userId !== session.userId) {
      throw new Error('Chat not found or unauthorized');
    }
  
    const updatedChat = await prisma.chatSession.update({
      where: {
        id: chatId,
      },
      data: {
        title: newTitle,
      },
    })
  
    return updatedChat;
  }
