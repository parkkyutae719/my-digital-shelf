import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa';
import { DDC_CATEGORIES } from '../data/DDC';
import BookCard from '../components/BookCard';
import '../styles/Main.css';

function Main() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [searchField, setSearchField] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const API_URL =
      'https://www.googleapis.com/books/v1/volumes?q=subject:technology+popular&maxResults=40';

    const fetchRecommendedBooks = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setRecommendedBooks(data.items || []);
      } catch (error) {
        console.error('추천 도서 API 호출 오류:', error);
      }
    };
    fetchRecommendedBooks();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      let queryPrefix = '';
      if (searchField === 'title') queryPrefix = 'intitle:';
      else if (searchField === 'author') queryPrefix = 'inauthor:';
      else if (searchField === 'subject') queryPrefix = 'subject:';

      navigate(
        `/search?q=${encodeURIComponent(queryPrefix + searchTerm)}&field=${searchField}`
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleCategoryClick = (keyword) => {
    navigate(`/search?q=subject:${encodeURIComponent(keyword)}&field=subject`);
  };

  return (
    <div className="main-content">
      {/* 🔹 Hero Section */}
      <section className="hero-search-section">
        {/* 로고 영역 */}
        <div className="main-logo" onClick={() => navigate('/')}>
          <FaBookOpen className="logo-icon" />
          <h1 className="logo-text">My Digital Shelf</h1>
        </div>

        {/* 검색 영역 */}
        <div className="search-input-group">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="search-field-select"
          >
            <option value="all">통합 검색</option>
            <option value="title">도서명</option>
            <option value="author">저자</option>
            <option value="subject">카테고리</option>
          </select>

          <input
            type="text"
            placeholder="도서명, 저자, 카테고리 통합 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch} className="search-button">
            검색
          </button>
        </div>
      </section>

      {/* 🔹 Category Section */}
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

      {/* 🔹 Recommend Section */}
      <section className="recommend-section">
        <h2>🔥 신착/추천 도서 목록</h2>
        <div className="book-list-grid">
          {recommendedBooks.map(
            (book) => book.volumeInfo && <BookCard key={book.id} book={book} />
          )}
        </div>
      </section>
    </div>
  );
}

export default Main;