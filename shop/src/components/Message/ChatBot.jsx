import React, { useState, useRef, useEffect } from 'react';
import { Button, Input } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';


const ChatBot = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatbot_messages');
    return saved ? JSON.parse(saved) : [{ sender: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn?' }];
  });
  const [input, setInput] = useState('');
  const [loadingBot, setLoadingBot] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('chatbot_messages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: input }
    ]);
    setLoadingBot(true);
    let botReply = '';
    try {
      const response = await fetch('http://localhost:3001/api/chatbot/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input })
      });
      if (!response.body) throw new Error('No response body');
      const reader = response.body.getReader();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = new TextDecoder().decode(value);
          // Tách từng dòng data: ...\n\n
          chunk.split('\n\n').forEach(line => {
            if (line.startsWith('data: ')) {
              const data = line.replace('data: ', '').trim();
              if (data === '[DONE]') return;
              try {
                // Nếu là JSON lỗi
                if (data.startsWith('{') && data.includes('error')) return;
                botReply += data;
                setMessages(prev => {
                  // Nếu đã có bot đang trả lời thì cập nhật, chưa có thì thêm mới
                  const last = prev[prev.length - 1];
                  if (last && last.sender === 'bot' && last.text !== 'Xin chào! Tôi có thể giúp gì cho bạn?') {
                    return [...prev.slice(0, -1), { sender: 'bot', text: botReply }];
                  } else {
                    return [...prev, { sender: 'bot', text: botReply }];
                  }
                });
              } catch {}
            }
          });
        }
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Đã xảy ra lỗi khi kết nối chatbot.' }
      ]);
    }
    setLoadingBot(false);
    setInput('');
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };
  

  return (
    <div style={{
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
      zIndex: 1100
    }}>
      <div style={{
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
        position: 'relative'
      }}>
        <RobotOutlined style={{ color: '#fff', fontSize: 24 }} />
        Chatbot hỗ trợ khách hàng
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 16,
        background: '#f4f8fb',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              gap: 8
            }}
          >
            {msg.sender === 'bot' ? (
              <RobotOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            ) : (
              <UserOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            )}
            <div style={{
              background: msg.sender === 'user' ? 'linear-gradient(135deg, #1890ff 60%, #40a9ff 100%)' : '#fff',
              color: msg.sender === 'user' ? '#fff' : '#222',
              borderRadius: msg.sender === 'user' ? '16px 0 16px 16px' : '0 16px 16px 16px',
              padding: '10px 16px',
              maxWidth: 260,
              wordBreak: 'break-word',
              fontSize: 16,
              boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(24,144,255,0.08)' : '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              {msg.sender === 'bot' && /\[Xem chi tiết\]\(([^)]+)\)/.test(msg.text) ? (
                <RenderBotMessage text={msg.text} />
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{
        padding: 16,
        borderTop: '1px solid #e6e6e6',
        display: 'flex',
        gap: 8,
        background: '#fff',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16
      }}>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
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

// Thêm component tách nội dung và link sản phẩm
function RenderBotMessage({ text }) {
  // Tách các sản phẩm
  const regex = /([^*]+)\*\*Chi tiết sản phẩm:\*\* \[Xem chi tiết\]\(([^)]+)\) \*([^*]+)\*/g;
  const matches = [];
  let match;
  let lastIndex = 0;
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      name: match[1].trim(),
      link: match[2].trim(),
      description: match[3].trim(),
      start: match.index,
      end: regex.lastIndex
    });
    lastIndex = regex.lastIndex;
  }
  // Lấy phần mở đầu (nếu có)
  const intro = matches.length > 0 ? text.slice(0, matches[0].start).trim() : text;
  return (
    <div>
      {intro && <div style={{ marginBottom: 8 }}>{intro}</div>}
      {matches.map((item, idx) => (
        <div key={idx} style={{ marginBottom: 12, background: '#f7faff', borderRadius: 8, padding: 8 }}>
          <div style={{ fontWeight: 600, color: '#1890ff' }}>{item.name}</div>
          <div style={{ fontSize: 14, margin: '4px 0' }}>{item.description}</div>
          <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#fa541c', fontWeight: 500 }}>
            Xem chi tiết sản phẩm
          </a>
        </div>
      ))}
      {/* Nếu không match gì thì hiển thị text gốc */}
      {matches.length === 0 && <span>{text}</span>}
    </div>
  );
}

export default ChatBot;
