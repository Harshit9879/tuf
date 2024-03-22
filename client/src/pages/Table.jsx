import { useState, useEffect } from 'react';
import axios from 'axios';
import './Table.css';

const Table = () => {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [currentPage]); // Fetch data when the currentPage changes

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/user?page=${currentPage}&pageSize=3`
      );
      setUserData(response.data.users);
      setTotalPages(Math.ceil(response.data.totalCount / 3));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="UserPage-container">
      <h1 className="UserPage-heading">Saved Codes</h1>
      <table className="UserPage-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Code Language</th>
            <th>Stdin</th>
            <th>Input Code</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.code_language}</td>
              <td>{user.stdin}</td>
              <td>{user.input_code}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="UserPage-pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Table;
