
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Main.css';

function Login() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!userId.trim() || !password.trim()) {
            alert("아이디와 비밀번호를 입력하세요.");
            return;
        }

        const userData = {
            userId,
            isLoggedIn: true
        };

        localStorage.setItem("user", JSON.stringify(userData));

        alert("로그인 성공!");
        navigate('/mylibrary');
    };

    return (
        <div className="main-content" style={{ maxWidth: '500px', margin: '80px auto' }}>
            <h2 style={{ textAlign: 'center', color: '#004d99', marginBottom: '20px' }}>로그인</h2>

            <div className="search-input-group" style={{ flexDirection: 'column', gap: '15px' }}>
                <input
                    type="text"
                    placeholder="아이디 입력"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    style={{ width: '100%' }}
                />

                <input
                    type="password"
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%' }}
                />

                <button
                    onClick={handleLogin}
                    className="search-button"
                    style={{ width: '100%' }}
                >
                    로그인
                </button>
            </div>
        </div>
    );
}

export default Login;