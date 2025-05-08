import React from 'react';

const AdminTable = ({ data, columns, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-2 text-left">
                {column.title}
              </th>
            ))}
            {onEdit || onDelete ? <th className="px-4 py-2 text-left">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b dark:border-gray-600">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-2">
                  {item[column.key] != null ? item[column.key].toString() : 'N/A'}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-2">
                  {onEdit && (
                    <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-700 mr-2">
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
