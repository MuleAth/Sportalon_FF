import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, MessageCircle, RefreshCcw } from "lucide-react";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! What would you like to check?", sender: "bot" },
    { text: "📖 How to Use", sender: "bot", type: "option" },
    { text: "📦 Equipments", sender: "bot", type: "option" },
    { text: "🏆 Current Events", sender: "bot", type: "option" },
    { text: "📞 Contact Admin", sender: "bot", type: "option" },
  ]);
  const [input, setInput] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [awaitingAdminMessage, setAwaitingAdminMessage] = useState(false);
  const chatBodyRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/equipments")
      .then((res) => setEquipments(res.data.data))
      .catch((error) => console.error("API Error (Equipments):", error));

    axios.get("http://localhost:5000/api/admin/events/")
      .then((res) => setEvents(res.data.events))
      .catch((error) => console.error("API Error (Events):", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { text, sender: "user" }]);

    if (text === "📖 How to Use") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Upcoming PDF Uploads 📂", sender: "bot" },
        ]);
      }, 500);
    } 
    else if (text === "📦 Equipments") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Choose an equipment:", sender: "bot" },
          ...equipments.map((eq) => ({ text: eq.equipmentname, sender: "bot", type: "option" })),
        ]);
      }, 500);
    } 
    else if (text === "🏆 Current Events") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Here are the current events:", sender: "bot" },
          ...events.map((event) => ({ text: event.title, sender: "bot", type: "event", id: event._id })),
        ]);
      }, 500);
    } 
    else if (text === "📞 Contact Admin") {
      setMessages((prev) => [
        ...prev,
        { text: "📩 Send your message to Admin:", sender: "bot" },
      ]);
      setAwaitingAdminMessage(true);
    } 
    else if (awaitingAdminMessage) {
      // Simulate sending the message to the admin
      axios.post("http://localhost:5000/api/admin/contact", { message: text })
        .then(() => {
          setMessages((prev) => [
            ...prev,
            { text: "✅ Message sent to Admin.", sender: "bot" },
          ]);
        })
        .catch(() => {
          setMessages((prev) => [
            ...prev,
            { text: "❌ Failed to send message. Try again later.", sender: "bot" },
          ]);
        });
      setAwaitingAdminMessage(false);
    } 
    else {
      const selectedEquipment = equipments.find((eq) => eq.equipmentname === text);
      const selectedEvent = events.find((event) => event.title === text);

      if (selectedEquipment) {
        setTimeout(() => {
          setMessages((prev) => [...prev, { text: `📢 ${text} Available: ${selectedEquipment.availableQuantity}`, sender: "bot" }]);
        }, 500);
      } 
      else if (selectedEvent) {
        window.location.href = `http://localhost:5173/events/${selectedEvent._id}`;
      } 
      else {
        setMessages((prev) => [...prev, { text: "❌ Sorry, I couldn't find what you're looking for.", sender: "bot" }]);
      }
    }
  };

  const restartChat = () => {
    setMessages([
      { text: "Hello! What would you like to check?", sender: "bot" },
      { text: "📖 How to Use", sender: "bot", type: "option" },
      { text: "📦 Equipments", sender: "bot", type: "option" },
      { text: "🏆 Current Events", sender: "bot", type: "option" },
      { text: "📞 Contact Admin", sender: "bot", type: "option" },
    ]);
    setInput("");
    setAwaitingAdminMessage(false);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-button" onClick={toggleChat}>
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Chatbot</span>
            <button onClick={toggleChat}>✖</button>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {loading && <div className="chat-message bot">Loading...</div>}
            {messages.map((msg, index) =>
              msg.type === "option" ? (
                <div
                  key={index}
                  className="chat-message bot option"
                  onClick={() => sendMessage(msg.text)}
                >
                  {msg.text}
                </div>
              ) : msg.type === "event" ? (
                <div
                  key={index}
                  className="chat-message bot option"
                  onClick={() => (window.location.href = `http://localhost:5173/events/${msg.id}`)}
                >
                  {msg.text}
                </div>
              ) : (
                <div key={index} className={`chat-message ${msg.sender}`}>
                  {msg.text}
                </div>
              )
            )}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            />
            <button onClick={() => sendMessage(input)}>
              <Send size={18} />
            </button>
            <button className="restart-button" onClick={restartChat}>
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
