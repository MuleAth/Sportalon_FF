import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTrash, FaCheck } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

function Users() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    user_type: "",
    department: "",
    year: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      }).toString();

      const response = await fetch(
        `http://localhost:5000/api/admin/users/getAllUsers?${queryParams}`
      );
      console.log(response);

      if (!response.ok) {
        throw new Error("No User Found!!");
      }

      const data = await response.json();
      console.log(data);

      // Sort users: Not approved users first
      const sortedUsers = data.users.sort(
        (a, b) => a.isVerifiedByAdmin - b.isVerifiedByAdmin
      );

      setUsers(sortedUsers);
      setTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, filters]);

  const filteredUsers = users.filter((user) =>
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete
  const handleDelete = async (e, userId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/admin/users/deleteUser/${userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          console.log(response);
          throw new Error("Failed to delete user");
        }
        if (response) {
          fetchUsers();
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setPage(1);
  };

  const handleApprove = async (e, userId) => {
    if (window.confirm("Are you sure you Approve this user?")) {
      e.stopPropagation();
      try {
        const response = await fetch(
          `http://localhost:5000/api/admin/users/approveUser/${userId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to approve user");
        }
        if (response) {
          fetchUsers();
          toast.success("User approved successfully!");
        }
      } catch (error) {
        setError(error.message);
        toast.error("Failed to approve user");
      }
    }
  };

  return (
    <div className="content-area">
      <ToastContainer />
      <h1 className="page-title">Users Management</h1>

      <div className="card">
        {/* Search Bar */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="       Search users..."
            className="input-search pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            name="user_type"
            value={filters.user_type}
            onChange={handleFilterChange}
            className="input-filter p-2 cursor-pointer"
          >
            <option value="">All User Types</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="input-filter p-2 cursor-pointer"
          >
            <option value="">All Departments</option>
            <option value="IT">IT</option>
            <option value="CS">CS</option>
            <option value="EnTC">EnTC</option>
            <option value="Mech">Mech</option>
            <option value="Biotech">Biotech</option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
          </select>

          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="input-filter p-2 cursor-pointer"
          >
            <option value="">All Years</option>
            <option value="FE">FE</option>
            <option value="SE">SE</option>
            <option value="TE">TE</option>
            <option value="BE">BE</option>
          </select>
        </div>

        {/* Loading and Error States */}
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Users Table */}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                      Mobile Number
                    </th>
                    <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                      User Type
                    </th>
                    <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleUserClick(user.id)}
                    >
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                        {user.fullname}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                        {user.mobile_number}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                        {user.user_type}
                      </td>
                      <td className="px-6 py-4">
                        {user.isVerifiedByAdmin || (
                          <button
                            onClick={(e) => handleApprove(e, user._id)}
                            className="text-green-600 hover:text-green-800 m-2"
                          >
                            <FaCheck /> Approve
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, user._id)} // Pass user.id correctly
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 m-2"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="pagination-button dark:text-white cursor-pointer"
              >
                Previous
              </button>
              <span className="dark:text-white">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === totalPages}
                className="pagination-button dark:text-white cursor-pointer"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Users;
