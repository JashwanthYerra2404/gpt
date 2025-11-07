import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default prisma;

// Create a new user
export async function createUser(email, name, password) {
    try {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password,
        },
      })
      return user;
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  export async function getUserByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })
      return user
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }
  
  // Create a new chat session
  export async function createChatSession(userId, title) {
    try {
      const session = await prisma.chatSession.create({
        data: {
          userId,
          title,
          messages: {
            create: [] // Start with empty messages
          }
        },
        include: {
          messages: true // Include related messages in the response
        }
      })
      return session;
    } catch (error) {
      console.error('Error creating chat session:', error)
      throw error
    }
  }
  
  // Add a message to a chat session
  export async function addMessage(sessionId, content, role) {
    try {
      const message = await prisma.message.create({
        data: {
          sessionId,
          content,
          role,
        }
      })
      return message;
    } catch (error) {
      console.error('Error adding message:', error)
      throw error
    }
  }
  
  // Get all chat sessions for a user
  export async function getUserSessions(userId) {
    try {
      const sessions = await prisma.chatSession.findMany({
        where: {
          userId: userId
        },
        include: {
          messages: true
        }
      })
      return sessions;
    } catch (error) {
      console.error('Error getting user sessions:', error)
      throw error
    }
  }
  