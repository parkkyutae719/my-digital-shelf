// src/components/BookCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
// BookCard.css 파일을 styles 폴더에 추가하여 Main.css의 카드 스타일을 재사용하거나 확장합니다.
import '../styles/Main.css'; 

function BookCard({ book }) {
  const navigate = useNavigate();

  // 도서 정보를 안전하게 추출
  const title = book.volumeInfo.title || '제목 정보 없음';
  const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : '저자 정보 없음';
  const thumbnail = book.volumeInfo.imageLinks?.thumbnail || '/placeholder-book.png';
  
  // 상세 페이지로 이동
  const handleCardClick = () => {
    navigate(`/detail/${book.id}`); 
  };

  return (
    <div 
      className="book-card"
      onClick={handleCardClick}
    >
      <img 
        src={thumbnail}
        alt={title}
      />
      <p className="book-title">{title}</p>
      <p className="book-author">{authors}</p>
    </div>
  );
}

export default BookCard;