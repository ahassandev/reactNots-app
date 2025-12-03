import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

function App() {
const [text, setText] = useState("");
const [notes, setNotes] = useState([]);
const [count, setCount] = useState(0);


const textareaRef = useRef(null);


useEffect(() => {
textareaRef.current.focus();
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
    console.log("Invalid JSON in localStorage. Clearing...");
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
  textareaRef.current.focus();
}, [])



const handleAddNote = useCallback(() => {
  if (!text.trim()) return;
  setNotes(prevNotes => [...prevNotes, text]); 
  setText("");
  textareaRef.current.focus();
}, [text]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Smart Notes App
          </h1>

          <textarea
            ref={textareaRef}
            placeholder="Write your note..."
            className="w-full p-3 border rounded-xl resize-none focus:outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex justify-between items-center mt-2">
            <p className={count > 200 ? "text-red-500" : "text-gray-500"}>
              Characters: {count}
            </p>
            
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Add Note
            </button>

            <button onClick={handleClearNotes} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer">Clear All</button>
          </div>

          <div className="mt-6 space-y-2">
            {notes.map((note, index) => (
              <div key={index} className="p-3 border rounded-lg bg-gray-50">
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
