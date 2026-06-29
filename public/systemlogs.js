// ===============================
// SYSTEM LOGS
// systemlogs.js
// ===============================

// Load Logs
let logs =
JSON.parse(localStorage.getItem("systemLogs")) || [];

// Load Attendance
let attendance =
JSON.parse(localStorage.getItem("attendance")) || [];

// Load Students
let students =
JSON.parse(localStorage.getItem("students")) || [];

// Today's Date
const now = new Date();

const date =
now.toLocaleDateString();

const time =
now.toLocaleTimeString();

// =====================================
// AUTO CREATE RFID LOGS
// =====================================

attendance.forEach(record=>{

const exist =
logs.find(log=>

log.name===record.name &&
log.time===record.time &&
log.activity==="RFID Scan"

);

if(!exist){

logs.unshift({

date:record.date,

time:record.time,

user:record.name,

activity:"RFID Scan",

description:
`${record.name} attendance recorded.`,

status:"Success"

});

}

});

// Save Logs
localStorage.setItem(
"systemLogs",
JSON.stringify(logs)
);

// =====================================
// UPDATE DASHBOARD CARDS
// =====================================

document.getElementById("totalLogs").innerHTML =
logs.length;

document.getElementById("loginLogs").innerHTML =
logs.filter(log=>log.activity==="Login").length;

document.getElementById("rfidLogs").innerHTML =
logs.filter(log=>log.activity==="RFID Scan").length;

document.getElementById("securityLogs").innerHTML =
logs.filter(log=>log.status==="Warning").length;

// =====================================
// DISPLAY TABLE
// =====================================

const table =
document.getElementById("logsTable");

table.innerHTML="";

logs.forEach(log=>{

table.innerHTML+=`

<tr>

<td>${log.date}<br>${log.time}</td>

<td>${log.user}</td>

<td>${log.activity}</td>

<td>${log.description}</td>

<td>

<span class="${
log.status==="Success"
?
"present"
:
"late"
}">
${log.status}
</span>

</td>

</tr>

`;

});

// =====================================
// AUTO REFRESH
// =====================================

setInterval(()=>{

location.reload();

},20000);