import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import "../styles/Main.css";

const API_URL = "https://69363f70f8dc350aff303987.mockapi.io/mybooks";

function MyLibrary() {
    const navigate = useNavigate();
    const [savedBooks, setSavedBooks] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.isLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }
        fetchSavedBooks();
    }, []);

    const fetchSavedBooks = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setSavedBooks(data);
        } catch (err) {
            console.error("내 서재 불러오기 오류:", err);
        }
    };

    const handleDelete = async (bookId) => {
        if (!window.confirm("삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`${API_URL}/${bookId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setSavedBooks(savedBooks.filter((b) => b.id !== bookId));
            } else {
                alert("삭제 실패!");
            }
        } catch (err) {
            console.error("삭제 오류:", err);
        }
    };

    const goToDetail = (book) => {
        navigate(`/detail/${book.googleId}`, {
            state: {
                from: "mylibrary",
                book: {
                    id: book.googleId,
                    volumeInfo: {
                        title: book.title,
                        authors: Array.isArray(book.authors)
                            ? book.authors
                            : [book.authors ?? "저자 정보 없음"],
                        description: book.description ?? "",
                        publisher: book.publisher ?? "",
                        publishedDate: book.publishedDate ?? "",
                        imageLinks: { thumbnail: book.thumbnail },
                    },
                },
            },
        });
    };

    return (
        <div className="main-content">
            {/* 🔹 Hero Header (Main/Search와 통일) */}
            <section className="hero-search-section mylibrary-hero">
                <div className="main-logo" onClick={() => navigate("/")}>
                    <FaBookOpen className="logo-icon" />
                    <h1 className="logo-text">My Library</h1>
                </div>

                <h2 className="page-title">내 서재</h2>
            </section>

            {/* 🔹 본문 영역 */}
            {savedBooks.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: "40px" }}>
                    저장된 도서가 없습니다.
                </p>
            ) : (
                <div className="book-list-grid">
                    {savedBooks.map((book) => (
                        <div key={book.id} style={{ textAlign: "center" }}>
                            <div onClick={() => goToDetail(book)} style={{ cursor: "pointer" }}>
                                <img
                                    src={book.thumbnail}
                                    alt={book.title}
                                    style={{
                                        width: "150px",
                                        height: "220px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                    }}
                                />
                                <p className="book-title">{book.title}</p>
                                <p className="book-author">{book.authors}</p>
                            </div>

                            <button
                                onClick={() => handleDelete(book.id)}
                                className="search-button delete-btn"
                            >
                                삭제하기
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyLibrary;