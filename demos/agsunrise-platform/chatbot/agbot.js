// AgBot - AI Assistant for AgSunrise Platform
// 24/7 chat widget powered by local knowledge base

class AgBot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.knowledgeBase = this.initKnowledgeBase();
    this.init();
  }

  initKnowledgeBase() {
    return {
      eligibility: {
        keywords: ['eligible', 'qualify', 'age', 'experience', 'requirements'],
        responses: [
          "To qualify for AgSunrise, you must be a principal operator (producer of agricultural products) and meet at least one of these criteria:\n\n• 40 years old or younger, OR\n• 10 years or less experience as a self-employed farmer\n\nWould you like to know more about the application process?"
        ]
      },
      application: {
        keywords: ['apply', 'application', 'how to', 'process', 'steps'],
        responses: [
          "The AgSunrise application is a simple 5-step digital process:\n\n1. Personal Information\n2. Farm Details\n3. Loan Requirements\n4. Document Upload\n5. Review & Submit\n\nIt takes about 15-20 minutes to complete. You can save your progress and return anytime. Ready to start your application?"
        ]
      },
      documents: {
        keywords: ['documents', 'paperwork', 'need', 'upload', 'required'],
        responses: [
          "Required documents for AgSunrise:\n\n• Government-issued ID\n• Farm operation proof (lease, deed, etc.)\n• Financial statements (last 2 years)\n• Tax returns (optional but helpful)\n• Business plan (we can help you create one)\n\nYou can upload these directly in the application. Need help with any of these?"
        ]
      },
      timeline: {
        keywords: ['how long', 'timeline', 'when', 'decision', 'approval'],
        responses: [
          "AgSunrise Application Timeline:\n\n• Application review: 7-10 business days\n• Decision notification: Within 14 days\n• Loan closing: 30-45 days from approval\n\nWe'll keep you updated via email and SMS at every step. Most farmers hear back within a week!"
        ]
      },
      programs: {
        keywords: ['other programs', 'usda', 'fsa', 'grants', 'alternatives'],
        responses: [
          "Besides AgSunrise, you might qualify for:\n\n• USDA FSA Beginning Farmer Loans\n• State Beginning Farmer Tax Credits (varies by state)\n• Farm Credit Young Farmer grants\n• AgBizInfo education programs\n\nOur application will automatically check your eligibility for multiple programs. Would you like to explore these options?"
        ]
      },
      benefits: {
        keywords: ['benefits', 'advantages', 'why', 'flexible', 'terms'],
        responses: [
          "AgSunrise Program Benefits:\n\n✅ Flexible loan limits tailored to young farmers\n✅ Less stringent approval standards\n✅ Reduced owner equity requirements\n✅ Lower collateral requirements\n✅ Government loan guarantees when appropriate\n✅ Free educational resources & mentorship\n\nWe're here to help you succeed, not just lend money!"
        ]
      },
      contact: {
        keywords: ['contact', 'phone', 'email', 'office', 'talk to', 'speak'],
        responses: [
          "Farm Credit SEMO Offices:\n\n📍 Dexter: 1114 North Outer Road, Dexter, MO 63841\n📍 Jackson: 420 W Washington, Jackson, MO 63755\n📍 Kennett: 811 South By-Pass, Kennett, MO 63857\n\n📞 Call us during business hours (8 AM - 5 PM)\n✉️ Or submit your application online 24/7\n\nWant to schedule a call with a loan officer?"
        ]
      },
      mentorship: {
        keywords: ['mentor', 'guidance', 'help', 'learn', 'support'],
        responses: [
          "AgSunrise Mentorship Program:\n\nWe pair you with an experienced Farm Credit SEMO member who:\n\n• Farms similar crops/livestock\n• Lives in your area\n• Has 10+ years of successful experience\n• Volunteers to help the next generation\n\nMentors help with business planning, financial management, and navigating challenges. Interested in being matched with a mentor?"
        ]
      }
    };
  }

  init() {
    this.injectStyles();
    this.createWidget();
    this.attachEventListeners();
    this.addWelcomeMessage();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .agbot-widget {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .agbot-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #52812c 0%, #426824 100%);
        border: none;
        box-shadow: 0 4px 16px rgba(82, 129, 44, 0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        position: relative;
      }

      .agbot-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(82, 129, 44, 0.4);
      }

      .agbot-button-icon {
        font-size: 28px;
        color: white;
      }

      .agbot-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #ef4444;
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        font-size: 11px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
      }

      .agbot-window {
        position: fixed;
        bottom: 100px;
        right: 24px;
        width: 380px;
        max-width: calc(100vw - 48px);
        height: 500px;
        max-height: calc(100vh - 140px);
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
      }

      .agbot-window.open {
        display: flex;
      }

      .agbot-header {
        background: linear-gradient(135deg, #345220 0%, #52812c 60%, #426824 100%);
        color: white;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .agbot-header-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .agbot-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(139, 195, 74, 0.2);
        border: 2px solid rgba(139, 195, 74, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .agbot-header-text h3 {
        font-size: 16px;
        font-weight: 700;
        margin: 0;
      }

      .agbot-header-text p {
        font-size: 12px;
        opacity: 0.85;
        margin: 2px 0 0;
      }

      .agbot-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        opacity: 0.8;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transition: all 0.2s;
      }

      .agbot-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
      }

      .agbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background: #f4f7f0;
      }

      .agbot-message {
        margin-bottom: 12px;
        display: flex;
        gap: 8px;
      }

      .agbot-message.user {
        flex-direction: row-reverse;
      }

      .agbot-message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      }

      .agbot-message.bot .agbot-message-avatar {
        background: linear-gradient(135deg, #52812c, #426824);
        color: white;
      }

      .agbot-message.user .agbot-message-avatar {
        background: #e5e7eb;
      }

      .agbot-message-bubble {
        max-width: 75%;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.5;
        white-space: pre-wrap;
      }

      .agbot-message.bot .agbot-message-bubble {
        background: white;
        color: #1e3013;
        border-bottom-left-radius: 4px;
      }

      .agbot-message.user .agbot-message-bubble {
        background: #52812c;
        color: white;
        border-bottom-right-radius: 4px;
      }

      .agbot-quick-replies {
        padding: 0 16px 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .agbot-quick-reply {
        padding: 6px 12px;
        border-radius: 16px;
        background: white;
        border: 1.5px solid #c4dab8;
        color: #52812c;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .agbot-quick-reply:hover {
        background: #f2f7ed;
        border-color: #52812c;
      }

      .agbot-input-area {
        padding: 12px 16px;
        background: white;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 8px;
      }

      .agbot-input {
        flex: 1;
        padding: 10px 14px;
        border: 1.5px solid #e5e7eb;
        border-radius: 20px;
        font-size: 14px;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s;
      }

      .agbot-input:focus {
        border-color: #52812c;
      }

      .agbot-send {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #52812c;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .agbot-send:hover {
        background: #426824;
      }

      .agbot-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .agbot-typing {
        display: flex;
        gap: 4px;
        padding: 10px 14px;
      }

      .agbot-typing-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #9ca3af;
        animation: typing 1.4s infinite;
      }

      .agbot-typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }

      .agbot-typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes typing {
        0%, 60%, 100% { opacity: 0.3; }
        30% { opacity: 1; }
      }

      @media (max-width: 480px) {
        .agbot-window {
          bottom: 0;
          right: 0;
          left: 0;
          width: 100%;
          max-width: 100%;
          height: 100vh;
          max-height: 100vh;
          border-radius: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.className = 'agbot-widget';
    widget.innerHTML = `
      <button class="agbot-button" id="agbot-toggle">
        <span class="agbot-button-icon">🤖</span>
        <span class="agbot-badge" id="agbot-badge" style="display: none;">1</span>
      </button>

      <div class="agbot-window" id="agbot-window">
        <div class="agbot-header">
          <div class="agbot-header-info">
            <div class="agbot-avatar">🌱</div>
            <div class="agbot-header-text">
              <h3>AgBot</h3>
              <p>Here to help 24/7</p>
            </div>
          </div>
          <button class="agbot-close" id="agbot-close">×</button>
        </div>

        <div class="agbot-messages" id="agbot-messages"></div>

        <div class="agbot-quick-replies" id="agbot-quick-replies"></div>

        <div class="agbot-input-area">
          <input 
            type="text" 
            class="agbot-input" 
            id="agbot-input" 
            placeholder="Ask me anything..."
            autocomplete="off"
          />
          <button class="agbot-send" id="agbot-send">
            ➤
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
  }

  attachEventListeners() {
    document.getElementById('agbot-toggle').addEventListener('click', () => this.toggle());
    document.getElementById('agbot-close').addEventListener('click', () => this.close());
    document.getElementById('agbot-send').addEventListener('click', () => this.sendMessage());
    document.getElementById('agbot-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const window = document.getElementById('agbot-window');
    const badge = document.getElementById('agbot-badge');
    
    if (this.isOpen) {
      window.classList.add('open');
      badge.style.display = 'none';
      setTimeout(() => document.getElementById('agbot-input').focus(), 100);
    } else {
      window.classList.remove('open');
    }
  }

  close() {
    this.isOpen = false;
    document.getElementById('agbot-window').classList.remove('open');
  }

  addWelcomeMessage() {
    const welcomeMsg = "👋 Hi! I'm AgBot, your AgSunrise assistant.\n\nI can help you with:\n• Eligibility requirements\n• Application process\n• Required documents\n• Timeline & approval\n• Other farmer programs\n\nWhat would you like to know?";
    
    this.addMessage(welcomeMsg, 'bot');
    this.showQuickReplies([
      "Am I eligible?",
      "How do I apply?",
      "What documents needed?",
      "How long does it take?"
    ]);
  }

  addMessage(text, sender = 'bot') {
    const messagesContainer = document.getElementById('agbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `agbot-message ${sender}`;
    
    const avatar = sender === 'bot' ? '🌱' : '👤';
    
    messageDiv.innerHTML = `
      <div class="agbot-message-avatar">${avatar}</div>
      <div class="agbot-message-bubble">${text}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    this.messages.push({ text, sender, timestamp: Date.now() });
  }

  showTyping() {
    const messagesContainer = document.getElementById('agbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'agbot-message bot';
    typingDiv.id = 'agbot-typing-indicator';
    typingDiv.innerHTML = `
      <div class="agbot-message-avatar">🌱</div>
      <div class="agbot-message-bubble agbot-typing">
        <div class="agbot-typing-dot"></div>
        <div class="agbot-typing-dot"></div>
        <div class="agbot-typing-dot"></div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTyping() {
    const indicator = document.getElementById('agbot-typing-indicator');
    if (indicator) indicator.remove();
  }

  showQuickReplies(replies) {
    const container = document.getElementById('agbot-quick-replies');
    container.innerHTML = '';
    
    replies.forEach(reply => {
      const button = document.createElement('button');
      button.className = 'agbot-quick-reply';
      button.textContent = reply;
      button.addEventListener('click', () => {
        this.handleQuickReply(reply);
      });
      container.appendChild(button);
    });
  }

  handleQuickReply(text) {
    document.getElementById('agbot-input').value = text;
    this.sendMessage();
  }

  sendMessage() {
    const input = document.getElementById('agbot-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    this.addMessage(message, 'user');
    input.value = '';
    
    // Simulate thinking
    this.showTyping();
    
    setTimeout(() => {
      this.hideTyping();
      const response = this.getResponse(message);
      this.addMessage(response.text, 'bot');
      
      if (response.quickReplies) {
        this.showQuickReplies(response.quickReplies);
      }
    }, 800 + Math.random() * 400);
  }

  getResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check each category in knowledge base
    for (const [category, data] of Object.entries(this.knowledgeBase)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        const response = data.responses[Math.floor(Math.random() * data.responses.length)];
        return {
          text: response,
          quickReplies: this.getSuggestedQuestions(category)
        };
      }
    }
    
    // Default response
    return {
      text: "I'm here to help with AgSunrise questions! Try asking about:\n\n• Eligibility requirements\n• Application process\n• Required documents\n• Approval timeline\n• Mentorship program\n• Other farmer programs\n\nOr type your question and I'll do my best to help!",
      quickReplies: ["Am I eligible?", "How do I apply?", "Speak to a human"]
    };
  }

  getSuggestedQuestions(currentCategory) {
    const suggestions = {
      eligibility: ["How do I apply?", "What documents needed?", "Other programs?"],
      application: ["What documents needed?", "How long does it take?", "Start application"],
      documents: ["How long does it take?", "Need help with docs", "Start application"],
      timeline: ["What happens after approval?", "Start application", "Talk to loan officer"],
      programs: ["Tell me about mentorship", "Start application", "Am I eligible?"],
      benefits: ["Start application", "What documents needed?", "Talk to loan officer"],
      contact: ["Start application", "Am I eligible?", "How do I apply?"],
      mentorship: ["Tell me more", "Start application", "Talk to loan officer"]
    };
    
    return suggestions[currentCategory] || ["Am I eligible?", "Start application"];
  }
}

// Auto-initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AgBot());
} else {
  new AgBot();
}
