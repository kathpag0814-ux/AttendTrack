// ===============================
// SMARTATTEND STUDENTS PAGE
// students.js
// ===============================
fetch("http://localhost:3000/api/students")
// STUDENT DATABASE
let students =
JSON.parse(
    localStorage.getItem("students")
) || [];

// GRADE & SECTION DATA
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

    const grade =
        document.getElementById("grade").value;

    const section =
        document.getElementById("section");

    section.innerHTML =
        '<option value="">Select Section</option>';

    if (sections[grade]) {

        sections[grade].forEach(item => {

            const option =
                document.createElement("option");

            option.value = item;
            option.textContent = item;

            section.appendChild(option);

        });

    }

}

// ===============================
// ADD STUDENT
// ===============================

function addStudent() {

    const student = {

        name:
        document.getElementById("name").value.trim(),

        rfid:
        document.getElementById("rfid").value.trim(),

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

        alert(
            "Please complete all information."
        );

        return;
    }

    students.push(student);

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    displayStudents();

    clearForm();

    alert(
        "Student Added Successfully!"
    );

}

// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents() {

    const table =
        document.getElementById(
            "studentTable"
        );

    if (!table) return;

    table.innerHTML = "";

    students.forEach(
        (student, index) => {

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

    if (
        !confirm(
            "Delete this student?"
        )
    ) return;

    students.splice(index, 1);


    displayStudents();

}

// ===============================
// UPDATE CARDS
// ===============================

function updateCards() {

    const totalStudents =
        document.getElementById(
            "totalStudents"
        );

    const totalRFID =
        document.getElementById(
            "totalRFID"
        );

    const activeStudents =
        document.getElementById(
            "activeStudents"
        );

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
// SEARCH STUDENTS
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
                .querySelectorAll(
                    "#studentTable tr"
                )
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

// ===============================
// START
// ===============================

window.onload = function () {

    displayStudents();

};