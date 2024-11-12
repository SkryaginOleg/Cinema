import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MoviesTable.css';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>Закрити</button>
                {children}
            </div>
        </div>
    );
};

const MoviesTable = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [showPurchaseForm, setShowPurchaseForm] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [discount, setDiscount] = useState(0);

    const [scalarResult, setScalarResult] = useState(null);
    const [scalarPrice, setScalarPrice] = useState("");
    const [tableResult, setTableResult] = useState([]);
    const [directorName, setDirectorName] = useState("");

    const [searchTitle, setSearchTitle] = useState("");
    const [searchDirector, setSearchDirector] = useState("");
    const [isScalarModalOpen, setIsScalarModalOpen] = useState(false);
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8000/api/movies/')
            .then(response => setMovies(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleMovieClick = (movie) => {
        if (selectedMovie && selectedMovie.movieid === movie.movieid) {
            setSelectedMovie(null);
            setSessions([]);
        } else {
            setSelectedMovie(movie);
            axios.get(`http://localhost:8000/api/sessions/?movie=${movie.movieid}`)
                .then(response => setSessions(response.data))
                .catch(error => console.error(error));
        }
    };

    const handlePurchaseClick = (session) => {
        setSelectedSession(session);
        setShowPurchaseForm(true);
    };

    const handlePurchaseSubmit = () => {
        if (!selectedSession || !selectedSession.sessionid) {
            alert("Будь ласка, оберіть сеанс.");
            return;
        }
    
        axios.post('http://localhost:8000/api/tickets/', {
            session_id: selectedSession.sessionid,
            quantity: quantity,
            discount: discount,
        })
        .then(response => {
            alert("Квиток успішно придбано!");
            setShowPurchaseForm(false);
            setQuantity(1);
            setDiscount(0);
        })
        .catch(error => {
            if (error.response) {
                const errorMessage = error.response.data.message;
    
                if (errorMessage === "Not enough seats available for this session") {
                    alert("Недостатньо вільних місць для обраного сеансу.");
                } else {
                    alert(`Помилка при покупці квитка: ${errorMessage}`);
                }
            } else {
                console.error("Невідома помилка:", error);
                alert("Виникла невідома помилка. Спробуйте ще раз пізніше.");
            }
        });
    };

    const handleScalarFunction = () => {
        axios.get(`http://localhost:8000/api/count_sessions/?price=${scalarPrice}`)
            .then(response => {
                setScalarResult(response.data);
                setIsScalarModalOpen(true);  // Открыть модальное окно
            })
            .catch(error => console.error("Помилка при виклику скалярної функції:", error));
    };

    const handleTableFunction = () => {
        axios.get(`http://localhost:8000/api/top_selling_movies/`)
            .then(response => {
                console.log("API Response:", response.data);
                setTableResult(response.data);
                setIsTableModalOpen(true);
            })
            .catch(error => console.error("Помилка при виклику табличної функції:", error));
    };

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        movie.director.name.toLowerCase().includes(searchDirector.toLowerCase())
    );

    return (
        <div className="movies-page">
            <h2>Фільми</h2>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Пошук за назвою фільму"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Пошук за іменем режисера"
                    value={searchDirector}
                    onChange={(e) => setSearchDirector(e.target.value)}
                />
            </div>

            <table className="movies-table">
                <thead>
                    <tr>
                        <th>Назва</th>
                        <th>Режисер</th>
                        <th>Жанр</th>
                        <th>Дата релізу</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMovies.map(movie => (
                        <React.Fragment key={movie.movieid}>
                            <tr onClick={() => handleMovieClick(movie)}>
                                <td>{movie.title}</td>
                                <td>{movie.director.name}</td>
                                <td>{movie.genre.genrename}</td>
                                <td>{movie.releasedate}</td>
                            </tr>
                            {selectedMovie && selectedMovie.movieid === movie.movieid && (
                                <tr>
                                    <td colSpan="4">
                                        <h3>Сеанси для {movie.title}</h3>
                                        <table className="sessions-table">
                                            <thead>
                                                <tr>
                                                    <th>Дата</th>
                                                    <th>Вільні місця</th>
                                                    <th>Ціна</th>
                                                    <th>Дія</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sessions.map(session => (
                                                    <tr key={session.sessionid}>
                                                        <td>{session.sessiondatetime}</td>
                                                        <td>{session.availableseats}</td>
                                                        <td>{session.price}</td>
                                                        <td>
                                                            <button 
                                                                onClick={() => handlePurchaseClick(session)} 
                                                                disabled={session.availableseats === 0}
                                                            >
                                                                Купити
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <div className="scalar-function">
                <h3>Кількість сеансів дешевше заданої ціни</h3>
                <input 
                    type="number" 
                    value={scalarPrice} 
                    onChange={(e) => setScalarPrice(e.target.value)}
                    placeholder="Введіть ціну"
                />
                <button onClick={handleScalarFunction}>Отримати кількість</button>
            </div>

            <div className="table-function">
                <h3>Популярні фільми для жанрів</h3>
               
                <button onClick={handleTableFunction}>Отримати фільми</button>
            </div>

            {}
            <Modal isOpen={isScalarModalOpen} onClose={() => setIsScalarModalOpen(false)}>
                <h3>Кількість сеансів</h3>
                {scalarResult !== null ? <p>Кількість сеансів: {scalarResult}</p> : <p>Завантаження...</p>}
            </Modal>

            {}
            <Modal isOpen={isTableModalOpen} onClose={() => setIsTableModalOpen(false)}>
                <h3>Популярні фільми для режисера</h3>
                {tableResult.length > 0 ? (
                    <table className="movies-table">
                        <thead>
                            <tr>
                                <th>Назва</th>
                                <th>Проданих квитків</th>
                                <th>Жанр</th>
                                <th>Режисер</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableResult.map((movie, index) => (
                                <tr key={index}>
                                    <td>{movie.Title}</td>
                                    <td>{movie.MaxTicketsSold}</td>
                                    <td>{movie.GenreName}</td>
                                    <td>{movie.DirectorName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>Завантаження...</p>}
            </Modal>

            {showPurchaseForm && (
                <div className="purchase-form">
                    <h3>Придбати квиток</h3>
                    <label>
                        Кількість:
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            min="1"
                            max={selectedSession.availableseats}
                        />
                    </label>
                    <label>
                        Знижка (%):
                        <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                            min="0"
                            max="100"
                        />
                    </label>
                    <button onClick={handlePurchaseSubmit}>Придбати</button>
                    <button onClick={() => setShowPurchaseForm(false)}>Скасувати</button>
                </div>
            )}
        </div>
    );
};

export default MoviesTable;
