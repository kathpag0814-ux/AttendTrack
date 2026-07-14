fetch("http://localhost:3000/api/rfidpage")
let attendance =
JSON.parse(localStorage.getItem("attendance")) || [];

attendance.push({
    name: student.name,
    grade: student.grade,
    section: student.section,
    status: "Present",
    time: new Date().toLocaleTimeString()
});

localStorage.setItem(
    "attendance",
    JSON.stringify(attendance)
);