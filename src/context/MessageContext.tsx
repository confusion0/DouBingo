import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';

interface Message { 
  id: number; 
  text: string;
  type: 'loading' | 'default';
  durationS?: number;
}

interface MessageContextType {
  messages: Message[];
  addMessage: (text: string, type: 'loading' | 'default', durationMs?: number) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const id = useRef(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const timeouts = useRef<Record<string, NodeJS.Timeout>>({});

  const incrementId = useCallback(() => {
    id.current += 1;
  }, []);

  const removeMessage = useCallback((rmId: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== rmId));

    if(timeouts.current[rmId]) {
      clearTimeout(timeouts.current[rmId]);
      delete timeouts.current[rmId];
    }
  }, []);

  const addMessage = useCallback((text: string, type: 'loading' | 'default', durationMs: number = 7500) => {
    const newId = id.current;

    console.log("Adding message", newId, text, type, durationMs);
  
    const message = { id: newId, text, type, durationS: durationMs / 1000 };
  
    setMessages((prev) => [...prev, message]);
  
    const timeout = setTimeout(() => {
      removeMessage(newId);
    }, durationMs);
  
    timeouts.current[newId] = timeout;
    incrementId();
  }, [id, incrementId, removeMessage]);

  useEffect(() => {
    return () => {
      Object.values(timeouts.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <MessageContext.Provider value={{ messages, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);

  if(!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  
  return context;
};
