import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";

// const DataTable = () => {
//   const tableRef = useRef(null);

//   useEffect(() => {
//     // Initialize DataTable when the component mounts
//     $(tableRef.current).DataTable({
//       paging: true, // Enable pagination
//       pageLength: 10, // Number of records per page
//     });

//     // Destroy DataTable when the component unmounts
//     return () => {
//       $(".data-table-wrapper").find("table").DataTable().destroy(true);
//     };
//   }, []);

//   return (
//     <div className="data-table-wrapper">
//       <table className="table" ref={tableRef}>
//         <thead>
//           <tr>
//             <th>Column 1</th>
//             <th>Column 2</th>
//             {/* Add more table headers if needed */}
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>Row 1 Data 1</td>
//             <td>Row 1 Data 2</td>
//             {/* Add more table cells if needed */}
//           </tr>
//           {/* Add more table rows if needed */}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DataTable;

var table = $("#example").DataTable({
  bSort: true,
  pageLength: 5,
  lengthMenu: [
    [5, 200, 400, 600, 800, 1000, -1],
    [5, 200, 400, 600, 800, 1000, "All"],
  ],
});
