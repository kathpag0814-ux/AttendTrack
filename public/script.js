// ===============================
// ATTENDTRACK RFID SYSTEM
// script.js (PART 1)
// ===============================

const API_URL = "http://localhost:3000";

let students = [];

// ===============================
// DASHBOARD
// ===============================

async function loadDashboard() {

    try {

        const response = await fetch(`${API_URL}/dashboard`);
        const data = await response.json();

        if (document.getElementById("totalStudents"))
            document.getElementById("totalStudents").textContent = data.totalStudents;

        if (document.getElementById("presentToday"))
            document.getElementById("presentToday").textContent = data.presentToday;

        if (document.getElementById("lateToday"))
            document.getElementById("lateToday").textContent = data.lateToday;

        if (document.getElementById("absentToday"))
            document.getElementById("absentToday").textContent = data.absentToday;

        if (document.getElementById("attendanceRate")) {

            document.getElementById("attendanceRate").innerHTML = `
                ${data.attendanceRate}%
                <span>Attendance Rate</span>
            `;

        }

    } catch (err) {

        console.error("Dashboard Error:", err);

    }

}

// ===============================
// RFID SCAN
// ===============================

async function scanRFID() {

    let rfid = "";

    // Read from textbox if available
    const input = document.getElementById("rfidCode");

    if (input && input.value.trim() !== "") {

        rfid = input.value.trim();

    } else {

        // Manual input if no RFID was scanned
        rfid = prompt("Enter RFID Number:");

        if (!rfid) return;

    }

    try {

        const response = await fetch(`${API_URL}/api/scan`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                rfid
            })

        });

        const data = await response.json();

       if (data.success) {
            alert("Attendance Recorded!");
        } else {
            alert(data.message);
        }

    } catch (err) {
        console.error(err);
    }
}
// ===============================
// GRADE & SECTION
// ===============================

const sections = {

    "Grade 7": ["Rizal","Bonifacio","Mabini"],
    "Grade 8": ["Einstein","Newton","Darwin"],
    "Grade 9": ["Mercury","Venus","Earth"],
    "Grade 10": ["Hope","Faith","Charity"],
    "Grade 11": ["STEM 1","STEM 2","ABM 1","HUMSS 1"],
    "Grade 12": ["STEM A","STEM B","ABM A","HUMSS A"]

};

function loadSections() {

    const grade = document.getElementById("grade").value;

    const section = document.getElementById("section");

    section.innerHTML = `<option value="">Select Section</option>`;

    if (sections[grade]) {

        sections[grade].forEach(sec => {

            section.innerHTML += `
                <option value="${sec}">
                    ${sec}
                </option>
            `;

        });

    }

}

// ================================
// Load Students from MongoDB
// ================================

async function loadStudents() {

    try {

        const response = await fetch(`${API_URL}/api/students`);

        students = await response.json();

        displayStudents();

    } catch (err) {

        console.error("Load Students Error:", err);

    }

}

// ================================
// Add Student
// ================================

async function addStudent() {

    const student = {

        studentId: document.getElementById("studentId").value,

        name: document.getElementById("name").value,

        rfid: document.getElementById("rfid").value,

        grade: document.getElementById("grade").value,

        section: document.getElementById("section").value

    };

    try {

        const response = await fetch(`${API_URL}/api/students`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(student)

        });

        const data = await response.json();

        alert(data.message);

        loadStudents();

    } catch (err) {

        console.error("Add Student Error:", err);

    }

}

// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents(){

    const table=document.getElementById("studentTable");

    table.innerHTML="";

    students.forEach(student=>{

        table.innerHTML+=`

        <tr>

            <td>${student.studentId}</td>

            <td>${student.name}</td>

            <td>${student.rfid}</td>

            <td>${student.grade}</td>

            <td>${student.section}</td>

            <td>${student.status}</td>

                <td>
                    <button onclick="deleteStudent('${student._id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });

}

// ===============================
// DELETE STUDENT
// ===============================

async function deleteStudent(id) {

    if (!confirm("Delete this student?")) return;

    try {

        const response = await fetch(`${API_URL}/api/students/${id}`, {

            method: "DELETE"

        });

        const data = await response.json();

        alert(data.message);

        loadStudents();

        loadDashboard();

    }

    catch (err) {

        console.error(err);

    }

}

// ===============================
// SEARCH STUDENTS
// ===============================

const search = document.getElementById("search");

if (search) {

    search.addEventListener("keyup", function () {

        const keyword = this.value.toLowerCase();

        document.querySelectorAll("#studentTable tr").forEach(row => {

            row.style.display =
                row.innerText.toLowerCase().includes(keyword)
                    ? ""
                    : "none";

        });

    });

}

// ===============================
// NAVIGATION
// ===============================

document.querySelectorAll(".nav").forEach(nav => {

    nav.addEventListener("click", function () {

        document.querySelectorAll(".nav").forEach(item => {

            item.classList.remove("active");

        });

        this.classList.add("active");

        localStorage.setItem(
            "activePage",
            this.dataset.page
        );

    });

});

// ===============================
// INITIALIZE
// ===============================

window.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    loadStudents();

    const active = localStorage.getItem("activePage");

    if (active) {

        document.querySelectorAll(".nav").forEach(nav => {

            if (nav.dataset.page === active) {

                nav.classList.add("active");

            }

        });

    }

    setInterval(loadDashboard, 5000);

});