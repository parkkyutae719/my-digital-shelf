import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa';
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
      const searchAPI = `https://www.googleapis.com/books/v1/volumes?q=${apiQuery}&maxResults=40`;

      const fetchSearchResults = async () => {
        try {
          const response = await fetch(searchAPI);
          const data = await response.json();
          setResults(data.items || []);
        } catch (error) {
          console.error('검색 API 오류:', error);
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
      if (searchField === 'title') queryPrefix = 'intitle:';
      else if (searchField === 'author') queryPrefix = 'inauthor:';
      else if (searchField === 'subject') queryPrefix = 'subject:';

      navigate(
        `/search?q=${encodeURIComponent(queryPrefix + searchTerm)}&field=${searchField}`
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleReSearch();
  };

  // 🔹 결과 필터링
  const validatedResults = results.filter(book => {
    if (!book.volumeInfo) return false;

    const title = book.volumeInfo.title || '';
    const authors = book.volumeInfo.authors || [];
    const categories = book.volumeInfo.categories || [];
    const search = searchTerm.toLowerCase();

    if (filterYear) {
      const year = book.volumeInfo.publishedDate?.substring(0, 4);
      if (year !== filterYear) return false;
    }

    if (searchField === 'title') {
      return title.toLowerCase().includes(search);
    }

    if (searchField === 'author') {
      return Array.isArray(authors)
        ? authors.some(a => a.toLowerCase().includes(search))
        : authors.toLowerCase().includes(search);
    }

    if (searchField === 'subject') {
      return categories.some(c => c.toLowerCase().includes(search));
    }

    return (
      title.toLowerCase().includes(search) ||
      (Array.isArray(authors)
        ? authors.some(a => a.toLowerCase().includes(search))
        : authors.toLowerCase().includes(search)) ||
      categories.some(c => c.toLowerCase().includes(search))
    );
  });

  return (
    <div className="search-page">
      {/* 🔹 메인과 동일한 헤더 영역 */}
      <section className="hero-search-section">
        <div className="main-logo" onClick={() => navigate('/')}>
          <FaBookOpen className="logo-icon" />
          <h1 className="logo-text">My Digital Shelf</h1>
        </div>

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

          <button onClick={handleReSearch} className="search-button">
            재검색
          </button>

          <button
            onClick={() => navigate('/')}
            className="search-button back-btn"
          >
            메인으로
          </button>
        </div>

        <p className="current-query-display">
          현재 검색어: <strong>{currentQuery || '필터링 탐색'}</strong>
          &nbsp;(필드: {searchField})
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
          {loading && <p>검색 중입니다...</p>}
          {!loading && validatedResults.length === 0 && (
            <p>검색 결과가 없습니다.</p>
          )}

          <div className="book-list-grid">
            {validatedResults.map(
              (book) => book.volumeInfo && (
                <BookCard key={book.id} book={book} />
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Search;