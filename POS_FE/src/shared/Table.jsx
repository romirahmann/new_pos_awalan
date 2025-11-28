/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

export function Table({
  columns = [],
  data = [],
  actionRenderer,
  rowsPerPage = 10,
}) {
  const [sortConfig, setSortConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting Logic
  const sortedData = useMemo(() => {
    const dataArray = Array.isArray(data) ? data : [];
    if (!sortConfig.key) return dataArray;

    return [...dataArray].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Pagination Logic
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const totalItems = sortedData.length;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <>
      {/* TABLE */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-gray-800">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-700 text-gray-400 sticky top-0">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col.key || index}
                  className="px-4 py-3 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {sortConfig.key !== col.key && (
                      <FaSort className="text-xs" />
                    )}
                    {sortConfig.key === col.key &&
                      (sortConfig.direction === "asc" ? (
                        <FaSortUp className="text-xs" />
                      ) : (
                        <FaSortDown className="text-xs" />
                      ))}
                  </span>
                </th>
              ))}
              {actionRenderer && (
                <th className="px-4 py-3 text-center">Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-700/40 transition"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                      {col.render
                        ? col.render(row[col.key], row, index)
                        : row[col.key]}
                    </td>
                  ))}
                  {actionRenderer && (
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {actionRenderer(row, index)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actionRenderer ? 1 : 0)}
                  className="text-center py-6 text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4 text-gray-300">
        <div className="text-sm">
          {totalItems > 0 ? (
            <>
              Showing <strong>{startItem}</strong>–<strong>{endItem}</strong> of{" "}
              <strong>{totalItems}</strong> records
            </>
          ) : (
            "No records to show"
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages })
            .map((_, i) => i + 1)
            .filter((page) => {
              return (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              );
            })
            .reduce((acc, page, idx, arr) => {
              if (idx > 0 && page - arr[idx - 1] > 1) {
                acc.push("...");
              }
              acc.push(page);
              return acc;
            }, [])
            .map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="px-3 py-1">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
