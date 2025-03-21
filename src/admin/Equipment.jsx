import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import InventorySection from "./admin-components/InventorySection";

function Equipment() {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestError, setRequestError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoadingRequests(true);
        const response = await fetch(
          "http://localhost:5000/api/admin/equipment/getAllRequest"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        const result = await response.json();

        if (!result.success || !Array.isArray(result.requests)) {
          throw new Error("Unexpected response format");
        }

        const mappedRequests = result.requests.map((req) => {
          const status =
            req.isAcceptedByAdmin === undefined
              ? ""
              : req.isAcceptedByAdmin
              ? "Accepted"
              : "Rejected";

          // Convert request date to DD-MM format
          const formattedDate = req.createdAt
            ? new Date(req.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
              })
            : "N/A";

          return {
            id: req._id,
            student: req.user.fullname,
            mobile_no: req.user.mobile_number,
            item: req.equipment.equipmentname,
            status,
            action: req.isAcceptedByAdmin === undefined ? "Action Pending" : "",
            requestDate: formattedDate, // Add formatted date
          };
        });

        setRequests(mappedRequests);
        setRequestError(null);
      } catch (error) {
        setRequestError(error.message);
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    // Ask for confirmation before accepting
    const confirmAccept = window.confirm(
      "Are you sure you want to accept this request?"
    );
    if (!confirmAccept) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/equipment/accept-request/${id}`,
        {
          method: "PUT",
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Update request status locally after acceptance
        setRequests(
          requests.map((req) =>
            req.id === id ? { ...req, status: "Accepted", action: "" } : req
          )
        );
      } else {
        alert(result.message || "Error accepting request");
      }
    } catch (error) {
      alert("Error accepting request");
    }
  };

  const handleReject = async (id) => {
    // Ask for confirmation before rejecting
    const confirmReject = window.confirm(
      "Are you sure you want to reject this request?"
    );
    if (!confirmReject) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/equipment/reject-request/${id}`,
        {
          method: "PUT",
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Update request status locally after rejection
        setRequests(
          requests.map((req) =>
            req.id === id ? { ...req, status: "Rejected", action: "" } : req
          )
        );
      } else {
        alert(result.message || "Error rejecting request");
      }
    } catch (error) {
      alert("Error rejecting request");
    }
  };

  return (
    <div className="content-area relative">
      <h1 className="page-title">Equipment Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[62%_33%] gap-6 items-start">
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Equipment Requests
          </h2>
          {loadingRequests ? (
            <p>Loading requests...</p>
          ) : requestError ? (
            <p className="text-red-500">{requestError}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                      Student
                    </th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                      Mobile No.
                    </th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                      Item
                    </th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y dark:divide-gray-700">
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                        {request.student}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                        {request.mobile_no}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                        {request.item}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                        {request.requestDate} {/* Show formatted date */}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            request.status === "Accepted"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : request.status === "Rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {request.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {request.action && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAccept(request.id)}
                              className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <InventorySection />
      </div>
    </div>
  );
}

export default Equipment;
