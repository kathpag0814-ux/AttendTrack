// ====================================
// SmartAttend AI Analytics
// aianalytics.js
// ====================================

// Load students
let students = JSON.parse(localStorage.getItem("students")) || [];

// Load attendance
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

// Today's date
const today = new Date().toLocaleDateString();

// Filter today's attendance
let todayAttendance = attendance.filter(record => record.date === today);

// Statistics
const totalStudents = students.length;

const present = todayAttendance.filter(record =>
    record.status === "Present"
).length;

const late = todayAttendance.filter(record =>
    record.status === "Late"
).length;

let absent = totalStudents - present - late;

if (absent < 0) absent = 0;

// Update cards
document.getElementById("total").textContent = totalStudents;
document.getElementById("present").textContent = present;
document.getElementById("late").textContent = late;
document.getElementById("absent").textContent = absent;

// Attendance Score
let score = 0;

if (totalStudents > 0) {

    score = Math.round(
        ((present + late) / totalStudents) * 100
    );

}

// Update score
document.getElementById("score").textContent = score + "%";

// ====================================
// Attendance Chart
// ====================================

new Chart(document.getElementById("attendanceChart"), {

    type: "line",

    data: {

        labels: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Today"
        ],

        datasets: [{

            label: "Attendance %",

            data: [
                90,
                91,
                92,
                94,
                95,
                score
            ],

            borderWidth:3,
            tension: .4,
            fill: false

        }]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {

                display: true

            }

        }

    }

});

// ====================================
// AI Risk Prediction
// ====================================

const riskTable = document.getElementById("riskTable");

riskTable.innerHTML = `

<tr>

<th>Student</th>

<th>Risk</th>

<th>Reason</th>

</tr>

`;

students.forEach(student => {

    const record = todayAttendance.find(item =>
        item.rfid === student.rfid
    );

    let risk = "LOW";
    let reason = "Good Attendance";
    let css = "present";

    if (!record) {

        risk = "HIGH";
        reason = "Absent Today";
        css = "late";

    }

    else if (record.status === "Late") {

        risk = "MEDIUM";
        reason = "Late Arrival";
        css = "late";

    }

    riskTable.innerHTML += `

<tr>

<td>${student.name}</td>

<td>

<span class="${css}">

${risk}

</span>

</td>

<td>

${reason}

</td>

</tr>

`;

});

// ====================================
// AI Recommendations
// ====================================

const recommendations = document.getElementById("recommendations");

let message = "";

if (score >= 95) {

    message = "Excellent attendance performance.";

}
else if (score >= 85) {

    message = "Attendance is good. Reduce late arrivals.";

}
else {

    message = "Attendance needs improvement. Monitor absent students.";

}

recommendations.innerHTML = `

<h2>AI Recommendations</h2>

<div>

<i class="fa-solid fa-chart-line"></i>

Attendance Score :
<b>${score}%</b>

</div>

<div>

<i class="fa-solid fa-user-check"></i>

Present :
<b>${present}</b>

</div>

<div>

<i class="fa-solid fa-clock"></i>

Late :
<b>${late}</b>

</div>

<div>

<i class="fa-solid fa-user-xmark"></i>

Absent :
<b>${absent}</b>

</div>

<div>

<i class="fa-solid fa-robot"></i>

${message}

</div>

`;

// ====================================
// Auto Refresh Every 10 Seconds
// ====================================

setInterval(() => {

    location.reload();

}, 10000);