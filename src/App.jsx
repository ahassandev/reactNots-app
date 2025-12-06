import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState("light");

  const textareaRef = useRef(null);

  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

 
  useEffect(() => {
    setCount(text.length);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  
  useEffect(() => {
    try {
      const savedNotes = JSON.parse(localStorage.getItem("notes"));
      if (Array.isArray(savedNotes)) {
        setNotes(savedNotes);
      }
    } catch (err) {
      console.log("Invalid notes JSON. Resetting...");
      localStorage.removeItem("notes");
    }
  }, []);

  
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    } else {
      localStorage.removeItem("notes");
    }
  }, [notes]);

  const handleClearNotes = useCallback(() => {
    setNotes([]);
    localStorage.removeItem("notes");
    textareaRef.current?.focus();
  }, []);

  const handleAddNote = useCallback(() => {
    if (!text.trim()) return;
    setNotes(prev => [...prev, text]);
    setText("");
    textareaRef.current?.focus();
  }, [text]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 dark:text-white rounded-2xl shadow-lg p-6">

       
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Smart Notes App</h1>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>

        
        <textarea
          ref={textareaRef}
          placeholder="Write your note..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 
            rounded-xl resize-none focus:outline-none 
            bg-white dark:bg-gray-700 dark:text-white"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        
        <div className="flex justify-between items-center mt-2">
          <p className={count > 200 ? "text-red-500" : "text-gray-500 dark:text-gray-300"}>
            Characters: {count}
          </p>

          <button
            onClick={handleAddNote}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Note
          </button>

          <button
            onClick={handleClearNotes}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Clear All
          </button>
        </div>

      
        <div className="mt-6 space-y-2">
          {notes.map((note, index) => (
            <div
              key={index}
              className="p-3 border border-gray-300 dark:border-gray-600 
              rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            >
              {note}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
