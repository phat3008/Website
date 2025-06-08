import React, { useState, useRef, useEffect } from 'react';
import { Button, Input } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown
import './ChatBot.css'; // For custom styles

const ChatBot = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatbot_messages');
    return saved
      ? JSON.parse(saved)
      : [{ sender: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn?' }];
  });
  const [input, setInput] = useState('');
  const [loadingBot, setLoadingBot] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to the latest message and save messages to localStorage
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('chatbot_messages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setLoadingBot(true);

    let botReply = '';
    try {
      const response = await fetch('http://localhost:3001/api/chatbot/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = new TextDecoder().decode(value);
          chunk.split('\n\n').forEach((line) => {
            if (line.startsWith('data: ')) {
              const data = line.replace('data: ', '').trim();
              if (data === '[DONE]') return;

              try {
                // Check for error JSON
                if (data.startsWith('{') && data.includes('error')) {
                  const error = JSON.parse(data);
                  setMessages((prev) => [
                    ...prev,
                    { sender: 'bot', text: `**Lỗi**: ${error.error}` },
                  ]);
                  return;
                }
                // Append Markdown content
                botReply += data;
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (
                    last &&
                    last.sender === 'bot' &&
                    last.text !== 'Xin chào! Tôi có thể giúp gì cho bạn?'
                  ) {
                    return [
                      ...prev.slice(0, -1),
                      { sender: 'bot', text: botReply },
                    ];
                  } else {
                    return [...prev, { sender: 'bot', text: botReply }];
                  }
                });
              } catch (err) {
                console.error('Error parsing data:', err);
              }
            }
          });
        }
      }
    } catch (err) {
      console.error('Stream error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Đã xảy ra lỗi khi kết nối chatbot.' },
      ]);
    }

    setLoadingBot(false);
    setInput('');
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !loadingBot) handleSend();
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: 32,
        bottom: 90,
        maxWidth: 400,
        width: '100%',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        height: 520,
        zIndex: 1100,
      }}
    >
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e6e6e6',
          fontWeight: 'bold',
          fontSize: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#1890ff',
          color: '#fff',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <RobotOutlined style={{ color: '#fff', fontSize: 24 }} />
        Chatbot hỗ trợ khách hàng
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          background: '#f4f8fb',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              gap: 8,
            }}
          >
            {msg.sender === 'bot' ? (
              <RobotOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            ) : (
              <UserOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            )}
            <div
              style={{
                background:
                  msg.sender === 'user'
                    ? 'linear-gradient(135deg, #1890ff 60%, #40a9ff 100%)'
                    : '#fff',
                color: msg.sender === 'user' ? '#fff' : '#222',
                borderRadius:
                  msg.sender === 'user'
                    ? '16px 0 16px 16px'
                    : '0 16px 16px 16px',
                padding: '10px 16px',
                maxWidth: 260,
                wordBreak: 'break-word',
                fontSize: 16,
                boxShadow:
                  msg.sender === 'user'
                    ? '0 2px 8px rgba(24,144,255,0.08)'
                    : '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {msg.sender === 'bot' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div
        style={{
          padding: 16,
          borderTop: '1px solid #e6e6e6',
          display: 'flex',
          gap: 8,
          background: '#fff',
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Nhập tin nhắn..."
          size="large"
          style={{ borderRadius: 8, background: '#f4f8fb' }}
          disabled={loadingBot}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          size="large"
          onClick={handleSend}
          disabled={!input.trim() || loadingBot}
          style={{ borderRadius: 8 }}
          loading={loadingBot}
        >
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default ChatBot;