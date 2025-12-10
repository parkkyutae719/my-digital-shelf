// src/pages/Search.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BookCard from '../components/BookCard'; 
import '../styles/Main.css'; // Search 페이지 레이아웃 및 BookCard 스타일 사용

function Search() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  // Filtering을 위한 상태: 출판 연도
  const [filterYear, setFilterYear] = useState(''); 

  // URL 쿼리가 바뀔 때마다 API 재호출
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q'); // '검색어' 또는 'subject:keyword'

    if (query) {
      setLoading(true);
      // Google Books API를 사용한 Searching 및 List 기능 구현
      const searchAPI = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`;
      
      const fetchSearchResults = async () => {
        try {
          const response = await fetch(searchAPI);
          const data = await response.json();
          setResults(data.items || []); 
        } catch (error) {
          console.error("검색 API 호출 오류:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSearchResults();
    } else {
      setResults([]);
    }
  }, [location.search]); 

  // Filtering 기능: 결과를 상태(results)에서 필터링
  const filteredResults = results.filter(book => {
    // 1. filterYear 상태가 없으면 모든 결과를 반환
    if (!filterYear) return true;

    // 2. 도서의 출판 연도 정보가 있는 경우에만 비교
    const publishedDate = book.volumeInfo?.publishedDate;
    if (publishedDate) {
      const publishedYear = publishedDate.substring(0, 4);
      return publishedYear === filterYear;
    }
    return false;
  });

  return (
    <div className="search-page">
      <h1>도서 검색 결과</h1>
      
      <div className="search-container">
        {/* A. Filtering UI (좌측 사이드바) */}
        <aside className="sidebar">
          <h3>출판 연도 필터</h3>
          <select onChange={(e) => setFilterYear(e.target.value)} value={filterYear}>
            <option value="">전체 연도</option>
            <option value="2025">2025년</option>
            <option value="2024">2024년</option>
            <option value="2023">2023년</option>
          </select>
        </aside>

        {/* B. List & Searching 결과 영역 */}
        <main className="results-area">
          {loading && <p className="loading-message">검색 중입니다...</p>}
          
          {/* 검색 결과가 0일 때 메시지 표시 */}
          {!loading && filteredResults.length === 0 && <p className="no-results">검색 결과가 없거나 필터에 해당하는 도서가 없습니다.</p>}
          
          <div className="book-list-grid">
             {/* filteredResults를 사용하여 최종 목록을 표시 (List 기능) */}
             {filteredResults.map((book) => (
               // API 결과 중 volumeInfo가 없는 경우를 대비하여 확인
               book.volumeInfo && <BookCard key={book.id} book={book} />
             ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Search;