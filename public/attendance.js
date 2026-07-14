// ===============================
// SMARTATTEND ATTENDANCE SYSTEM
// attendance.js
// ===============================
fetch("http://localhost:3000/api/attendance")
// SAMPLE STUDENT DATABASE
let students = [
    {
        rfid: "1001",
        name: "Juan Dela Cruz",
        grade: "Grade 10",
        section: "A"
    },
    {
        rfid: "1002",
        name: "Maria Santos",
        grade: "Grade 10",
        section: "B"
    },
    {
        rfid: "1003",
        name: "Pedro Reyes",
        grade: "Grade 9",
        section: "A"
    },
    {
        rfid: "1004",
        name: "Anna Cruz",
        grade: "Grade 11",
        section: "C"
    },
    {
        rfid: "1005",
        name: "Mark Lopez",
        grade: "Grade 12",
        section: "B"
    },
    {
        rfid: "1006",
        name: "Liza Gomez",
        grade: "Grade 8",
        section: "A"
    }
];

// ATTENDANCE RECORDS
let attendance = [];

// ===============================
// RFID SCAN FUNCTION
// ===============================

function scanRFID(rfid) {

    const student =
        students.find(
            s => s.rfid === rfid
        );

    if (!student) {

        alert("RFID Not Registered");

        return;
    }

    const now = new Date();

    const status =
        now.getHours() >= 8
        ? "LATE"
        : "PRESENT";

    attendance.push({

        name: student.name,

        grade: student.grade,

        section: student.section,

        status: status,

        time: now.toLocaleTimeString()

    });

    renderTable(
        document.getElementById("gradeFilter").value
    );

}

// ===============================
// DISPLAY ATTENDANCE TABLE
// ===============================

function renderTable(filter = "all") {

    const table = document.getElementById("attendanceTable");

    table.innerHTML = "";

    attendance.forEach((record, index) => {

        if (filter !== "all" && record.grade !== filter) {
            return;
        }

        table.innerHTML += `
        <tr>

            <td>${record.name}</td>

            <td>${record.grade} - ${record.section}</td>

            <td>
                <span class="${record.status === "PRESENT" ? "present" : "late"}">
                    ${record.status}
                </span>
            </td>

            <td>${record.time}</td>

            <td>

                <button class="edit-btn" onclick="editAttendance(${index})">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteAttendance(${index})">
                     Delete
                </button>

            </td>

        </tr>
        `;

    });

}
// ===============================
// FILTER BY GRADE
// ===============================

function filterGrade() {

    const grade =
        document.getElementById(
            "gradeFilter"
        ).value;

    renderTable(grade);

}

// ===============================
// MARK ALL PRESENT
// ===============================

function markAllPresent() {

    attendance = [];

    students.forEach(student => {

        attendance.push({

            name: student.name,

            grade: student.grade,

            section: student.section,

            status: "PRESENT",

            time:
            new Date().toLocaleTimeString()

        });

    });

    renderTable(
        document.getElementById(
            "gradeFilter"
        ).value
    );

    alert(
        "All students marked PRESENT"
    );

}

// ===============================
// EDIT ATTENDANCE
// ===============================

function editAttendance(index) {

    let status = prompt(
        "Enter new status (PRESENT or LATE):",
        attendance[index].status
    );

    if (status) {

        attendance[index].status = status.toUpperCase();

        renderTable(
            document.getElementById("gradeFilter").value
        );

    }

}

// ===============================
// DELETE ATTENDANCE
// ===============================

function deleteAttendance(index) {

    if (confirm("Delete this attendance record?")) {

        attendance.splice(index, 1);

        renderTable(
            document.getElementById("gradeFilter").value
        );

    }

}

// ===============================
// DEMO RFID BUTTON TEST
// ===============================

// Example:
// scanRFID("1001");
// scanRFID("1002");

// ===============================
// INITIAL LOAD
// ===============================

renderTable();