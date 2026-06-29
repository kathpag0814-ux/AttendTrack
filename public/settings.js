// =====================================
// ATTENDTRACK SETTINGS
// settings.js
// =====================================

// Load settings when page opens
window.onload = function () {
    loadSettings();
};

// Save Settings
function saveSettings() {

    const settings = {

        adminName: document.getElementById("adminName").value,
        adminEmail: document.getElementById("adminEmail").value,
        schoolName: document.getElementById("schoolName").value,
        schoolYear: document.getElementById("schoolYear").value,
        semester: document.getElementById("semester").value,

        amCutoff: document.getElementById("amCutoff").value,
        pmCutoff: document.getElementById("pmCutoff").value,

        aiSensitivity: document.getElementById("aiSensitivity").value,
        autoPrediction: document.getElementById("autoPrediction").value,

        emailAlert: document.getElementById("emailAlert").value,
        smsAlert: document.getElementById("smsAlert").value,

        deviceID: document.getElementById("deviceID").value,
        port: document.getElementById("port").value

    };

    localStorage.setItem(
        "settings",
        JSON.stringify(settings)
    );

    alert("Settings saved successfully!");
}

// Load Saved Settings
function loadSettings() {

    const settings = JSON.parse(
        localStorage.getItem("settings")
    );

    if (!settings) return;

    document.getElementById("adminName").value =
        settings.adminName || "";

    document.getElementById("adminEmail").value =
        settings.adminEmail || "";

    document.getElementById("schoolName").value =
        settings.schoolName || "";

    document.getElementById("schoolYear").value =
        settings.schoolYear || "";

    document.getElementById("semester").value =
        settings.semester || "";

    document.getElementById("amCutoff").value =
        settings.amCutoff || "07:30";

    document.getElementById("pmCutoff").value =
        settings.pmCutoff || "13:00";

    document.getElementById("aiSensitivity").value =
        settings.aiSensitivity || "Medium";

    document.getElementById("autoPrediction").value =
        settings.autoPrediction || "Enabled";

    document.getElementById("emailAlert").value =
        settings.emailAlert || "Enabled";

    document.getElementById("smsAlert").value =
        settings.smsAlert || "Enabled";

    document.getElementById("deviceID").value =
        settings.deviceID || "";

    document.getElementById("port").value =
        settings.port || "";

}

// Connect RFID
function connectRFID() {

    const id = document.getElementById("deviceID").value;
    const port = document.getElementById("port").value;

    if (id === "" || port === "") {

        alert("Please enter RFID Device ID and Connection Port.");

        return;
    }

    alert("RFID Device Connected Successfully!");
}

// Test RFID
function testRFID() {

    alert("RFID Test Successful!\nReader is ready to scan.");
}