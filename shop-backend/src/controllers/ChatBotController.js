const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:streamGenerateContent';
const API_KEY = process.env.GEMINI_API_KEY;

exports.streamMessage = async (req, res) => {
    const { message } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Thiết lập headers SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const filePath = path.join(__dirname, '../data/products_prompt_format.txt');
    const product_list = fs.readFileSync(filePath, 'utf8');

    const prompt_intro = (
        "Bạn là chuyên gia tư vấn thiết bị điện tử.\n\n" +
        "🎯 Nhiệm vụ:\n" +
        "- Chỉ dựa vào danh sách sản phẩm bên dưới để tư vấn.\n" +
        "- Nếu không có sản phẩm phù hợp, hãy trả lời: `Xin lỗi, hiện tại cửa hàng không có sản phẩm phù hợp với nhu cầu của bạn.`\n" +
        "- Nếu danh sách trống, cũng phản hồi tương tự.\n\n" +
        "💬 Nếu người dùng chỉ chào hỏi, hãy đáp lại thân thiện như: 'Chào bạn! Bạn muốn tìm loại mạch LED nào hôm nay?'\n\n" +
        "🧪 Khi tư vấn:\n" +
        "- Phân tích nhu cầu người dùng (ví dụ: giá rẻ, có remote, dễ dùng...)\n" +
        "- Gợi ý tối đa 3 sản phẩm phù hợp, không liệt kê toàn bộ danh sách.\n" +
        "- Giải thích lý do sản phẩm được chọn.\n\n" +
        "🤖 Phong cách trò chuyện: thân thiện, rõ ràng, dễ hiểu."
    );
      

    const user_prompt = (
        prompt_intro +
        `\n\nCâu hỏi người dùng: ${message}\n\n` +
        `Danh sách sản phẩm:\n${product_list}\n\n` +
        "Trả về kết quả dưới dạng Markdown, bao gồm:\n" +
        "- Một đoạn văn tư vấn ngắn gọn.\n" +
        "- Một tiêu đề `###` hoặc `####`.\n" +
        "#### Dưới đây là một số sản phẩm phù hợp với nhu cầu của bạn:\n\n"+
        "- **Tên sản phẩm:** Tên A  \n"+
        "  **Chi tiết sản phẩm:** [Xem chi tiết](http://localhost:3000/product-details/id sản phẩm a)\n"+
        "- **Tên sản phẩm:** Tên B  \n"+
        "  **Chi tiết sản phẩm:** [Xem chi tiết](http://localhost:3000/product-details/id sản phẩm bb)\n\n"+
        "Chỉ trả về Markdown, không thêm chú thích ngoài."
    );
      

    // Retry wrapper
    const sendRequestWithRetry = async (maxRetries = 3, delay = 2000) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await axios({
                    method: 'post',
                    url: `${GEMINI_API_URL}?alt=sse&key=${API_KEY}`,
                    data: {
                        contents: [
                            {
                                role: "user",
                                parts: [{ text: user_prompt }]
                            }
                        ]
                    },
                    headers: { 'Content-Type': 'application/json' },
                    responseType: 'stream',
                });
            } catch (error) {
                const status = error.response?.status;
                console.warn(`⏳ Attempt ${attempt} failed. Status: ${status || error.message}`);

                if (attempt === maxRetries || (status && status !== 503)) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };

    try {
        const response = await sendRequestWithRetry();

        response.data.on('data', (chunk) => {
            const lines = chunk.toString().split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.replace(/^data: /, '').trim();
                    if (!jsonStr || jsonStr === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(jsonStr);
                        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) {
                            res.write(`data: ${text}\n\n`);
                        }
                    } catch (err) {
                        console.error('❌ JSON parse error:', err);
                    }
                }
            }
        });

        response.data.on('end', () => {
            res.write(`data: [DONE]\n\n`);
            res.end();
        });

        response.data.on('error', (error) => {
            console.error('❌ Stream error:', error);
            res.write(`data: {"error": "Stream error occurred"}\n\n`);
            res.end();
        });

    } catch (error) {
        console.error('❌ Error in streamMessage:', error.message);
        res.write(`data: {"error": "Failed to connect to Gemini API after retries"}\n\n`);
        res.end();
    }
};
