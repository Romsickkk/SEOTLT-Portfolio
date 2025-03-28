import { useEffect, useState } from "react";

interface News {
  id: number;
  title: string;
  content: string;
}

export default function NewsApp() {
  const [news, setNews] = useState<News[]>(() => {
    const storedNews = localStorage.getItem("news");
    return storedNews ? JSON.parse(storedNews) : [];
  });
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("news", JSON.stringify(news));
  }, [news]);

  const addOrUpdateNews = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    if (editingId !== null) {
      setNews(
        news.map((n) =>
          n.id === editingId
            ? { id: editingId, title: newTitle, content: newContent }
            : n
        )
      );
      setEditingId(null);
    } else {
      setNews([
        ...news,
        { id: Date.now(), title: newTitle, content: newContent },
      ]);
    }
    setNewTitle("");
    setNewContent("");
  };

  const deleteNews = (id: number) => {
    setNews(news.filter((n) => n.id !== id));
  };

  const editNews = (item: News) => {
    setNewTitle(item.title);
    setNewContent(item.content);
    setEditingId(item.id);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        📰 Новости
      </h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <input
          className="w-full p-2 mb-2 border rounded-md focus:ring focus:ring-blue-300"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Заголовок"
        />
        <textarea
          className="w-full p-2 mb-2 border rounded-md focus:ring focus:ring-blue-300"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Содержание"
        />
        <button
          className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
          onClick={addOrUpdateNews}
        >
          {editingId ? "💾 Сохранить" : "➕ Добавить"}
        </button>
      </div>
      <ul className="space-y-4">
        {news.map((item) => (
          <li key={item.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-bold text-lg text-gray-700">{item.title}</h2>
            <p className="text-gray-600">{item.content}</p>
            <div className="mt-2 flex space-x-2">
              <button
                className="cursor-pointer px-3 py-1 text-white bg-yellow-500 hover:bg-yellow-600 rounded-md transition"
                onClick={() => editNews(item)}
              >
                ✏️ Редактировать
              </button>
              <button
                className="cursor-pointer px-3 py-1 text-white bg-red-500 hover:bg-red-600 rounded-md transition"
                onClick={() => deleteNews(item.id)}
              >
                ❌ Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
