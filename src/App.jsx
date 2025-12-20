
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Main from './pages/Main';
import Search from './pages/Search';
import Detail from './pages/Detail';
import Login from './pages/Login';
import MyLibrary from './pages/MyLibrary';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/search" element={<Search />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mylibrary" element={<MyLibrary />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;