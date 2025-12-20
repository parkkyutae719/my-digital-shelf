
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/Main.css";

const PLACEHOLDER_IMAGE =
    "https://via.placeholder.com/200x300.png?text=No+Cover";

const API_URL = "https://69363f70f8dc350aff303987.mockapi.io/mybooks";

function Detail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [book, setBook] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    const cleanHTML = (txt) => (txt ? txt.replace(/<[^>]+>/g, "") : "");

    useEffect(() => {
        const loadDetail = async () => {
            try {
                // MyLibrary → Detail 이동한 경우
                if (location.state?.from === "mylibrary") {
                    setBook(location.state.book);
                    setIsSaved(true);
                    setLoading(false);
                    return;
                }

                // 검색 → Detail 이동한 경우
                const res = await fetch(
                    `https://www.googleapis.com/books/v1/volumes/${id}`
                );

                const data = await res.json();

                setBook(data);
                checkIfSaved(data.id);
            } catch (err) {
                console.error("DETAIL LOAD ERROR:", err);
            }

            setLoading(false);
        };

        loadDetail();
    }, [id]);

    // 이미 저장된 책인지 검사
    const checkIfSaved = async (googleId) => {
        try {
            const res = await fetch(API_URL);
            const list = await res.json();
            setIsSaved(list.some((b) => b.googleId === googleId));
        } catch (err) {
            console.error("SAVE CHECK ERROR:", err);
        }
    };

    const handleSave = async () => {
        if (isSaved) return;

        const info = book.volumeInfo;

        const saveData = {
            googleId: book.id,
            title: info.title,
            authors: Array.isArray(info.authors)
                ? info.authors.join(", ")
                : info.authors,
            thumbnail: info.imageLinks?.thumbnail || "",
            description: cleanHTML(info.description),
            publisher: info.publisher,
            publishedDate: info.publishedDate,
        };

        try {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(saveData),
            });

            alert("내 서재에 저장되었습니다!");
            setIsSaved(true);
        } catch (err) {
            console.error("SAVE ERROR:", err);
        }
    };

    if (loading) return <p style={{ padding: 20 }}>로딩 중...</p>;

    if (!book || !book.volumeInfo)
        return <p style={{ padding: 20 }}>도서 정보를 불러올 수 없습니다.</p>;

    const info = book.volumeInfo;

    const authors = Array.isArray(info.authors)
        ? info.authors.join(", ")
        : info.authors;

    return (
        <div className="main-content" style={{ padding: 20 }}>
            <button
                onClick={() => navigate(-1)}
                className="search-button"
                style={{ marginBottom: 20, marginLeft: "80px" }}
            >
                ← 뒤로 가기
            </button>

            {/* 상단 정보 영역 */}
            <div className="detail-top">
                {/* 이미지 */}
                <div className="detail-image">
                    <img
                        src={info.imageLinks?.thumbnail || PLACEHOLDER_IMAGE}
                        alt={info.title}
                    />
                </div>

                {/* 텍스트 정보 */}
                <div className="detail-info">
                    <h2>{info.title}</h2>
                    <p><strong>저자:</strong> {authors}</p>
                    <p><strong>출판사:</strong> {info.publisher}</p>
                    <p><strong>출판일:</strong> {info.publishedDate}</p>

                    <button
                        onClick={handleSave}
                        className="detail-save-btn"
                        disabled={isSaved}
                    >
                        {isSaved ? "이미 저장됨" : "내 서재에 담기"}
                    </button>
                </div>
            </div>

            {/* 설명 */}
            <div className="detail-description">
                {cleanHTML(info.description)}
            </div>
        </div>
    );
}

export default Detail;