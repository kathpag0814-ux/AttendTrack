// ===============================
// NOTIFICATIONS
// notifications.js
// ===============================
fetch("http://localhost:3000/api/notifications")
// Load Data
let students =
JSON.parse(localStorage.getItem("students")) || [];

let attendance =
JSON.parse(localStorage.getItem("attendance")) || [];

// Load Notifications
let notifications =
JSON.parse(localStorage.getItem("notifications")) || [];

// Today's Date
const today = new Date().toLocaleDateString();

// ===============================
// CREATE NEW NOTIFICATIONS
// ===============================

attendance.forEach(record => {

    // Check if notification already exists
    const exists = notifications.find(n =>
        n.name === record.name &&
        n.time === record.time &&
        n.type === record.status
    );

    if (!exists) {

        let icon = "fa-id-card";
        let title = "RFID Scan Successful";
        let message = `${record.name} attendance recorded.`;
        let level = "success";

        if (record.status === "Late") {
            icon = "fa-user-clock";
            title = "Late Attendance";
            message = `${record.name} arrived late.`;
            level = "warning";
        }

        if (record.status === "Absent") {
            icon = "fa-user-xmark";
            title = "Student Absent";
            message = `${record.name} has no attendance today.`;
            level = "critical";
        }

        notifications.unshift({

            type: record.status,
            icon: icon,
            title: title,
            message: message,
            level: level,
            date: today,
            time: record.time,
            read: false

        });

    }

});

// Save
localStorage.setItem(
    "notifications",
    JSON.stringify(notifications)
);

// ===============================
// DISPLAY NOTIFICATIONS
// ===============================

const list =
document.getElementById("notificationList");

list.innerHTML = "";

notifications.forEach(n => {

    list.innerHTML += `

<div class="notification ${n.read ? "" : "unread"}">

    <div class="notify-icon ${n.level}">
        <i class="fa-solid ${n.icon}"></i>
    </div>

    <div>

        <h3>${n.title}</h3>

        <p>${n.message}</p>

        <span>${n.date} • ${n.time}</span>

    </div>

</div>

`;

});

// ===============================
// DASHBOARD CARDS
// ===============================

document.getElementById("totalNotifications").innerHTML =
notifications.length;

document.getElementById("read").innerHTML =
notifications.filter(n => n.read).length;

document.getElementById("pending").innerHTML =
notifications.filter(n => !n.read).length;

document.getElementById("critical").innerHTML =
notifications.filter(n => n.level === "critical").length;

// ===============================
// MARK ALL READ
// ===============================

function markAllRead(){

    notifications.forEach(n=>{
        n.read = true;
    });

    localStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
    );

    location.reload();

}

// ===============================
// AUTO REFRESH
// ===============================

setInterval(()=>{

    location.reload();

},10000);