import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const ApiUrl = 'https://jsonplaceholder.typicode.com/comments';

interface Comment {
    id: number;
    name: string;
    email: string;
    body: string;
}

function APIWork() {
    const [data, setData] = useState<Comment[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [items, setItems] = useState<number>(20);
    const [editMode, setEditMode] = useState<number | null>(null); // ID записи в режиме редактирования
    const [editForm, setEditForm] = useState({ name: '', email: '', body: '' });

    const fetchData = async () => {
        try {
            const res = await axios.get(ApiUrl);
            setData(res.data.slice(0, items));
            if (items >= res.data.length) {
                setHasMore(false);
            } else {
                setItems(items + 20);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const deleteItem = (id: number) => {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
    };

    const startEdit = (id: number, name: string, email: string, body: string) => {
        setEditMode(id);
        setEditForm({ name, email, body });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const saveEdit = (id: number) => {
        const updatedData = data.map((item) =>
            item.id === id ? { ...item, ...editForm } : item
        );
        setData(updatedData);
        setEditMode(null);
    };

    return (
        <div className="main">
            <h1>API</h1>
            <button className="fetch-button" onClick={fetchData}>API button</button>
            <div className="repositories">
                <InfiniteScroll
                    hasMore={hasMore}
                    dataLength={data.length}
                    next={fetchData}
                    height={500}
                    loader={<h4></h4>}
                    scrollableTarget="scrollableDiv"
                >
                    {data && data.map((repo) => (
                        <ul className="repository" key={repo.id}>
                            {editMode === repo.id ? (
                                <>
                                    <li>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editForm.name}
                                            onChange={handleEditChange}
                                            placeholder="Name"
                                        />
                                    </li>
                                    <li>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editForm.email}
                                            onChange={handleEditChange}
                                            placeholder="Email"
                                        />
                                    </li>
                                    <li>
                                        <textarea
                                            name="body"
                                            value={editForm.body}
                                            onChange={handleEditChange}
                                            placeholder="Body"
                                        />
                                    </li>
                                    <button onClick={() => saveEdit(repo.id)}>Сохранить</button>
                                    <button onClick={() => setEditMode(null)}>Отмена</button>
                                </>
                            ) : (
                                <>
                                    <li>Comment {repo.id}</li>
                                    <li>{repo.name}</li>
                                    <li>Email: {repo.email}</li>
                                    <li>Body: {repo.body}</li>
                                    <button onClick={() => deleteItem(repo.id)}>Удалить элемент</button>
                                    <button onClick={() => startEdit(repo.id, repo.name, repo.email, repo.body)}>Редактировать</button>
                                </>
                            )}
                        </ul>
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    );
}

export { APIWork };
