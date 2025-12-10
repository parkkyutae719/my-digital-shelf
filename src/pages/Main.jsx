// src/pages/Main.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DDC_CATEGORIES } from '../data/DDC';
import '../styles/Main.css';

function Main() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=subject:technology+popular&maxResults=5';
    
    const fetchRecommendedBooks = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setRecommendedBooks(data.items || []);
      } catch (error) {
        console.error("추천 도서 API 호출 오류:", error);
      }
    };
    fetchRecommendedBooks();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryClick = (keyword) => {
    navigate(`/search?q=subject:${encodeURIComponent(keyword)}`); 
  };

  return (
    <div className="main-content">
      
      <section className="hero-search-section">
        <div className="search-input-group">
          <input 
            type="text" 
            placeholder="도서명, 저자, 카테고리 통합 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch} className="search-button">검색</button>
        </div>
      </section>

      <section className="category-section">
        <h3>주요 주제별 탐색</h3>
        <div className="category-grid">
           {DDC_CATEGORIES.map((cat) => (
            <button 
              key={cat.code} 
              className="category-card"
              onClick={() => handleCategoryClick(cat.keyword)}
            >
              {cat.code} - {cat.name}
            </button>
          ))}
        </div>
      </section>

      <section className="recommend-section">
        <h2>🔥 신착/추천 도서 목록</h2>
        <div className="book-list-grid">
          {recommendedBooks.map((book) => (
            <div 
              key={book.id} 
              className="book-card"
              onClick={() => navigate(`/detail/${book.id}`)} 
            >
              <img 
                src={book.volumeInfo.imageLinks?.thumbnail || '/placeholder-book.png'} 
                alt={book.volumeInfo.title} 
              />
              <p className="book-title">{book.volumeInfo.title}</p>
              <p className="book-author">{book.volumeInfo.authors?.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Main;