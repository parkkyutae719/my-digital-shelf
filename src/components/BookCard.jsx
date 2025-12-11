// src/components/BookCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Main.css'; 

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/128x192.png?text=No+Cover'; 

function BookCard({ book }) {
  const navigate = useNavigate();

  const title = book.volumeInfo.title || '제목 정보 없음';
  const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : '저자 정보 없음';
  
  // 유효한 외부 URL 사용 (이미지 공백 문제 해결)
  const thumbnail = book.volumeInfo.imageLinks?.thumbnail || PLACEHOLDER_IMAGE;
  
  const handleCardClick = () => {
    // Detail 페이지 구현 전이므로 임시 처리
    alert(`상세 정보: ${title} (Detail 페이지 구현 예정)`);
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