import { createUser, createChatSession, addMessage } from '@/app/lib/db'

export async function POST(request) {
  try {
    // Create a new user
    console.log('Creating test user...');
    const user = await createUser('test123@gmail.com', 'Test User');
    
    // Create a chat session for the user
    const session = await createChatSession(user.id, 'My First Chat');
    
    // Add a message to the session
    await addMessage(session.id, 'Hello, how can I help you?', 'bot');

    // Note we need to refetch the session to include recent messages
    
    return Response.json({ success: true, user, session });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}