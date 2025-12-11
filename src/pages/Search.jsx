// src/pages/Search.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard'; 
import '../styles/Main.css'; 

function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [filterYear, setFilterYear] = useState(''); 
  const [searchField, setSearchField] = useState('all'); 
  
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); 

  const [currentPage, setCurrentPage] = useState(1); 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const apiQuery = params.get('q') || ''; 
    const field = params.get('field') || 'all'; 

    const displayQuery = apiQuery.replace(/intitle:|inauthor:|subject:/g, '');
    setCurrentQuery(displayQuery);
    setSearchTerm(displayQuery);
    setSearchField(field); 
    setCurrentPage(1); 
    
    if (apiQuery) { 
      setLoading(true);

      // ✅ maxResults=40 유지 (API 최대치)
      const searchAPI = `https://www.googleapis.com/books/v1/volumes?q=${apiQuery}&maxResults=40`; 
      
      const fetchSearchResults = async () => {
        try {
          const response = await fetch(searchAPI);
          
          if (!response.ok) {
              console.error(`API 응답 오류: ${response.status} ${response.statusText}`);
              setResults([]);
              return; 
          }
          
          const data = await response.json();
          setResults(data.items || []); 
        } catch (error) {
          console.error("API 연결 실패 (Fetch Error):", error);
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

  const handleReSearch = () => {
    if (searchTerm.trim()) {
      let queryPrefix = '';
      if (searchField === 'title') { queryPrefix = 'intitle:'; } 
      else if (searchField === 'author') { queryPrefix = 'inauthor:'; } 
      else if (searchField === 'subject') { queryPrefix = 'subject:'; } 

      navigate(`/search?q=${encodeURIComponent(queryPrefix + searchTerm)}&field=${searchField}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleReSearch();
    }
  };

  // ✅ 수정: 연도 필터만 유지하고 API 결과 최대화
  const validatedResults = results.filter(book => {
      if (!book.volumeInfo) return false;

      // 1. 연도 필터
      if (filterYear) {
          const publishedYear = book.volumeInfo.publishedDate?.substring(0, 4);
          if (publishedYear !== filterYear) { // 4자리 체크는 필터 입력단에서 이미 가능
              return false;
          }
      }
      
      // 2. 검색어 포함 필터 (제거) - DDC 검색 결과 최대화를 위함

      return true;
  });

  // ✅ 수정: itemsPerPage를 40으로 늘려 모든 결과를 1페이지에 표시
  const itemsPerPage = 40; 
  const totalPages = Math.ceil(validatedResults.length / itemsPerPage); 
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const currentItems = validatedResults.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
      setCurrentPage(page);
      window.scrollTo(0, 0); 
  };


  return (
    <div className="search-page">
      <section className="search-bar-section">
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
                placeholder="새로운 검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleReSearch} className="search-button">재검색</button>
            <button onClick={() => navigate('/')} className="search-button back-btn">메인으로</button>
        </div>
        <p className="current-query-display">
            현재 검색어: **{currentQuery || '필터링 탐색'}** (필드: {searchField})
        </p>
      </section>

      <div className="search-container">
        <aside className="sidebar">
          <h3>출판 연도 필터</h3>
          <input
            type="number"
            placeholder="출판 연도 4자리 (예: 2024)"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          />
        </aside>

        <main className="results-area">
          {loading && <p className="loading-message">검색 중입니다...</p>}
          
          {!loading && validatedResults.length === 0 && <p className="no-results">
            검색 결과가 없거나 필터에 해당하는 도서가 없습니다.
          </p>}
          
          <div className="book-list-grid">
             {currentItems.map((book) => (
               book.volumeInfo && <BookCard key={book.id} book={book} />
             ))}
          </div>
          
          {/* 페이지네이션은 40개 이상일 경우에만 표시 */}
          {!loading && validatedResults.length > itemsPerPage && (
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        disabled={currentPage === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Search;