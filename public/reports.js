// ===========================
// SMARTATTEND REPORTS SYSTEM
// reports.js
// ===========================
fetch("http://localhost:3000/api/reports")

let students =
JSON.parse(localStorage.getItem("students")) || [];

let attendance =
JSON.parse(localStorage.getItem("attendance")) || [];

// Update Dashboard Cards
// ===========================
// SMARTATTEND REPORTS SYSTEM
// reports.js
// ===========================

let students =
JSON.parse(localStorage.getItem("students")) || [];

let attendance =
JSON.parse(localStorage.getItem("attendance")) || [];

// Update Dashboard Cards
function updateReportStats() {

    document.querySelector(".stat h1").textContent =
        attendance.length;

}

// Generate Report
function generateReport() {

    const reportType =
        document.querySelector("select").value;

    const reportDate =
        document.querySelector('input[type="date"]').value;

    const reportTable =
        document.querySelector("table");

    reportTable.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Grade</th>
            <th>Section</th>
            <th>Status</th>
            <th>Time</th>
        </tr>
    `;

    attendance.forEach(record => {

        reportTable.innerHTML += `
            <tr>
                <td>${record.name}</td>
                <td>${record.grade}</td>
                <td>${record.section}</td>
                <td>
                    <span class="${
                        record.status.toLowerCase()
                    }">
                        ${record.status}
                    </span>
                </td>
                <td>${record.time}</td>
            </tr>
        `;

    });

    alert(
        `${reportType} generated successfully!`
    );

}

// Export Report
function exportReport() {

    let data =
        JSON.stringify(attendance, null, 2);

    let blob =
        new Blob([data], {
            type: "application/json"
        });

    let url =
        URL.createObjectURL(blob);

    let a =
        document.createElement("a");

    a.href = url;
    a.download = "attendance-report.json";

    a.click();
}

// Load Page
window.onload = () => {

    updateReportStats();

};

// Generate Report
function generateReport() {

    const today = new Date().toLocaleDateString();

    const todayAttendance =
        attendance.filter(a => a.date === today);

    const reportTable =
        document.getElementById("reportTable");

    reportTable.innerHTML = "";

    todayAttendance.forEach(record => {

        reportTable.innerHTML += `

<tr>

<td>${record.name}</td>

<td>${record.grade}</td>

<td>${record.section}</td>

<td>
<span class="${record.status.toLowerCase()}">
${record.status}
</span>
</td>

<td>${record.time}</td>

<td>${record.date}</td>

</tr>

`;

    });

    alert("Attendance Report Generated!");

}
// Export Report
function exportReport() {

    let csv =
    "Name,Grade,Section,Status,Time,Date\n";

    attendance.forEach(record=>{

        csv +=
`${record.name},${record.grade},${record.section},${record.status},${record.time},${record.date}\n`;

    });

    const blob =
    new Blob([csv],{type:"text/csv"});

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "AttendanceReport.csv";

    link.click();

    let exports =
    Number(localStorage.getItem("exports")) || 0;

    exports++;

    localStorage.setItem(
        "exports",
        exports
    );

}
// Load Page
window.onload = () => {

    updateReportStats();

};