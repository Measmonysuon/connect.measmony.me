import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");

  const backendUrl = "https://api.connect.mesmony.me";

  useEffect(() => {
    fetchHelloMessage();
  }, []);

  const fetchHelloMessage = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/hello`);
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Failed to fetch backend message");
      console.error("Error fetching hello message:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await res.json();
      setResponse(data.response);
      setUserInput("");
    } catch (error) {
      setResponse("Failed to send message to backend");
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const getServerTime = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/time`);
      const data = await res.json();
      setResponse(`Server time: ${data.time}`);
    } catch (error) {
      setResponse("Failed to get server time");
      console.error("Error getting server time:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: 20, 
      maxWidth: 600, 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Frontend React App</h1>
      <p>Connected to backend at: <code>{backendUrl}</code></p>
      
      <div style={{ marginBottom: 20 }}>
        <h3>Backend Status:</h3>
        <p>Message from backend: <strong>{message}</strong></p>
        {loading && <p>Loading...</p>}
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>Send Message to Backend:</h3>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your message"
          style={{ 
            padding: 8, 
            marginRight: 10, 
            width: 200,
            border: '1px solid #ccc',
            borderRadius: 4
          }}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button 
          onClick={sendMessage}
          disabled={loading}
          style={{ 
            padding: 8, 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Send
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>Get Server Time:</h3>
        <button 
          onClick={getServerTime}
          disabled={loading}
          style={{ 
            padding: 8, 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Get Server Time
        </button>
      </div>

      {response && (
        <div style={{ 
          marginTop: 20, 
          padding: 15, 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6',
          borderRadius: 4
        }}>
          <h3>Backend Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
