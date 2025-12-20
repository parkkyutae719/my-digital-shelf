import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Main.css";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/128x192.png?text=No+Cover";

function BookCard({ book }) {
  const navigate = useNavigate();

  const title = book.volumeInfo?.title || "제목 정보 없음";
  const rawAuthors = book.volumeInfo?.authors;

  const authors = Array.isArray(rawAuthors)
    ? rawAuthors.join(", ")
    : rawAuthors || "저자 정보 없음";

  const thumbnail =
    book.volumeInfo?.imageLinks?.thumbnail || PLACEHOLDER_IMAGE;

  const handleCardClick = () => {
    navigate(`/detail/${book.id}`, {
      state: { from: "search", book }
    });
  };

  return (
    <div className="book-card" onClick={handleCardClick}>
      <img src={thumbnail} alt={title} />
      <p className="book-title">{title}</p>
      <p className="book-author">{authors}</p>
    </div>
  );
}

export default BookCard;