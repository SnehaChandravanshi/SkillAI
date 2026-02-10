import { useState } from "react";
import api from "../api/api";

export default function MentorChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const send = async () => {
    const res = await api.post("/mentor/chat", { message });
    setChat([...chat, { q: message, a: res.data.reply }]);
    setMessage("");
  };

  return (
    <div className="border rounded p-4">
      <h2 className="font-bold mb-2">AI Mentor</h2>

      <div className="h-64 overflow-y-auto mb-2">
        {chat.map((c, i) => (
          <div key={i} className="mb-2">
            <p className="font-semibold">You:</p>
            <p>{c.q}</p>
            <p className="font-semibold mt-1">Mentor:</p>
            <p>{c.a}</p>
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full"
        placeholder="Ask your AI mentor..."
      />

      <button onClick={send} className="bg-black text-white mt-2 w-full py-2">
        Send
      </button>
    </div>
  );
}
