// ===============================
// SMARTATTEND RFID SYSTEM
// script.js
// ===============================

const API_URL = "http://localhost:3000";

// Load dashboard statistics
async function loadDashboard() {

    try {

        const response = await fetch(
            `${API_URL}/dashboard`
        );

        const data = await response.json();

        // Statistics
        document.getElementById("totalStudents").textContent =
            data.totalStudents || 0;

        document.getElementById("presentToday").textContent =
            data.presentToday || 0;

        document.getElementById("lateToday").textContent =
            data.lateToday || 0;

        document.getElementById("absentToday").textContent =
            data.absentToday || 0;

        // Attendance Rate Circle
        document.getElementById("attendanceRate").innerHTML = `
            ${data.attendanceRate || 0}%
            <span>Attendance Rate</span>
        `;

    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}

// RFID Scan Function
async function scan() {

    try {

        const rfid = prompt(
            "Scan RFID Card UID:"
        );

        if (!rfid) return;

        document.querySelector(".ready").textContent =
            "Scanning RFID Card...";

        const response = await fetch(
            `${API_URL}/scan`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                    "application/json"
                },
                body: JSON.stringify({
                    rfid
                })
            }
        );

        const data =
            await response.json();

        if (data.success) {

            document.querySelector(".ready")
                .innerHTML =
                "✓ Attendance Recorded";

            document.querySelector(
                ".scanner p:last-child b"
            ).innerHTML =
                `${data.student.name} (${data.student.section})`;

            addRecentScan(
                data.student.name,
                data.student.section,
                data.status || "PRESENT"
            );

            loadDashboard();

        } else {

            document.querySelector(".ready")
                .innerHTML =
                "RFID Not Registered";

            alert(
                "RFID card not found."
            );

        }

    } catch (error) {

        console.error(
            "Scan Error:",
            error
        );

    }

}

// Add New Attendance Row
function addRecentScan(
    studentName,
    section,
    status
) {

    const table =
        document.querySelector("table");

    const row =
        document.createElement("tr");

    const now =
        new Date();

    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    const statusClass =
        status === "LATE"
        ? "late"
        : "present";

    row.innerHTML = `
        <td>${studentName}</td>
        <td>${section}</td>
        <td>${time}</td>
        <td class="${statusClass}">
            ${status}
        </td>
    `;

    table.appendChild(row);

}

// Load Dashboard On Start
window.onload = () => {

  loadDashboard();

  displayStudents();

  const active =
    localStorage.getItem("activePage");

  if(active){

    document
      .querySelectorAll(".nav")
      .forEach(a => {

        if(a.dataset.page === active){

          a.classList.add("active");

        }

      });

  }

  setInterval(loadDashboard,3000);

};



// ===============================
// STUDENT DATABASE
// ===============================

let students =
JSON.parse(localStorage.getItem("students")) || [];

const sections = {
    "Grade 7": ["Rizal", "Bonifacio", "Mabini"],
    "Grade 8": ["Einstein", "Newton", "Darwin"],
    "Grade 9": ["Mercury", "Venus", "Earth"],
    "Grade 10": ["Hope", "Faith", "Charity"],
    "Grade 11": ["STEM 1", "STEM 2", "ABM 1", "HUMSS 1"],
    "Grade 12": ["STEM A", "STEM B", "ABM A", "HUMSS A"]
};

// ===============================
// LOAD SECTIONS
// ===============================

function loadSections() {

    alert("Function is working!");

    const grade = document.getElementById("grade").value;
    const section = document.getElementById("section");

    const sections = {
        "Grade 7": ["Rizal", "Bonifacio", "Mabini"],
        "Grade 8": ["Einstein", "Newton", "Darwin"],
        "Grade 9": ["Mercury", "Venus", "Earth"],
        "Grade 10": ["Hope", "Faith", "Charity"],
        "Grade 11": ["STEM 1", "STEM 2", "ABM 1", "HUMSS 1"],
        "Grade 12": ["STEM A", "STEM B", "ABM A", "HUMSS A"]
    };

    section.innerHTML = '<option>Select Section</option>';

    if (sections[grade]) {
        sections[grade].forEach(item => {
            section.innerHTML += `<option>${item}</option>`;
        });
    }
}

// ===============================
// ADD STUDENT
// ===============================

function addStudent() {

    const student = {

        name:
        document.getElementById("name").value,

        rfid:
        document.getElementById("rfid").value,

        grade:
        document.getElementById("grade").value,

        section:
        document.getElementById("section").value,

        status:
        "Active"

    };

    if (
        student.name === "" ||
        student.rfid === "" ||
        student.grade === "" ||
        student.section === ""
    ) {

        alert("Please complete all information");
        return;

    }

    students.push(student);

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    displayStudents();

    clearForm();

    alert("Student Added Successfully");

}

// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents() {

    const table =
        document.getElementById("studentTable");

    if (!table) return;

    table.innerHTML = "";

    students.forEach((student, index) => {

        table.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>
                    <span class="rfid-tag">
                        ${student.rfid}
                    </span>
                </td>
                <td>${student.grade}</td>
                <td>${student.section}</td>
                <td>
                    <span class="present">
                        ${student.status}
                    </span>
                </td>
                <td>
                    <button onclick="deleteStudent(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });

    updateCards();

}

// ===============================
// DELETE STUDENT
// ===============================

function deleteStudent(index) {

    students.splice(index, 1);

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    displayStudents();

}

// ===============================
// UPDATE DASHBOARD CARDS
// ===============================

function updateCards() {

    const totalStudents =
        document.getElementById("totalStudents");

    const totalRFID =
        document.getElementById("totalRFID");

    const activeStudents =
        document.getElementById("activeStudents");

    if (totalStudents)
        totalStudents.textContent =
            students.length;

    if (totalRFID)
        totalRFID.textContent =
            students.filter(
                x => x.rfid !== ""
            ).length;

    if (activeStudents)
        activeStudents.textContent =
            students.filter(
                x => x.status === "Active"
            ).length;

}

// ===============================
// CLEAR FORM
// ===============================

function clearForm() {

    document.getElementById("name").value = "";
    document.getElementById("rfid").value = "";
    document.getElementById("grade").value = "";

    document.getElementById("section").innerHTML =
        '<option value="">Select Section</option>';

}

// ===============================
// SEARCH
// ===============================

const search =
document.getElementById("search");

if (search) {

    search.addEventListener(
        "keyup",
        function () {

            const value =
                this.value.toLowerCase();

            document
                .querySelectorAll("#studentTable tr")
                .forEach(row => {

                    row.style.display =
                        row.innerText
                            .toLowerCase()
                            .includes(value)
                            ? ""
                            : "none";

                });

        }
    );

}

