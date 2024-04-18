// Global variables to store UI elements
var tefName, tefPassword, lay, speech;

// Importing or configuring 'cfg.Dark' and 'cfg.MUI'
var cfg = {
    Dark: "dark",
    MUI: "mui"
};

function OnStart() {
    // Setting up the UI layout vertically centered and filling the entire screen.
    lay = app.CreateLayout("Linear", "VCenter,FillXY");

    // Creating a text entry field with an icon on the left side for the name.
    tefName = MUI.CreateTEFilledIconLeft(0.8, "Left", "person", "Masukan nama");
    tefName.SetMargins(0, 0.02, 0, 0);
    lay.AddChild(tefName);

    // Creating a text entry field with an icon on the left side for the password.
    tefPassword = MUI.CreateTEFilledIconLeft(0.8, "Left,Password", "lock", "Masukan password", true);
    tefPassword.SetMargins(0, 0.02, 0, 0);
    lay.AddChild(tefPassword);
    
    // Creating a button for login
    var tmBol = MUI.CreateButtonElegant("Login", 0.3, 0.050, MUI.colors.lightBlue.lighten1);
    tmBol.SetMargins(0, 0.03, 0, 0);
    tmBol.SetOnTouch(Login);
    lay.AddChild(tmBol);
    
    // Adding the layout to the application.
    app.AddLayout(lay);
}

function Login() {
    // Mendapatkan nilai dari field nama dan password
    var name = tefName.GetText();
    var password = tefPassword.GetText();
    
    // Validasi nama dan password (contoh sederhana)
    if(name === "zaldy" && password === "") {
        // Jika login berhasil, beralih ke layout lain
        SwitchToMainLayout(name); // Pass the name to the next layout
    } else {
        // Jika login gagal, tampilkan pesan kesalahan
        app.ShowPopup("Login gagal. Periksa kembali nama pengguna dan kata sandi Anda.", "Error");
    }
}

function SwitchToMainLayout(userName) {
    // Hapus layout login saat ini
    app.DestroyLayout(lay);

    // Membuat layout baru untuk tampilan utama
    var mainLayout = app.CreateLayout("Linear", "VCenter,FillXY");

    // Mengatur tema ke 'cfg.Light' atau 'cfg.MUI' sesuai preferensi
    var theme = cfg.MUI;

    // Menginisialisasi UI kit dengan tema yang dipilih
    app.InitializeUIKit(theme);
    
    // Menampilkan pesan pop-up "Halo [nama pengguna]"
    app.ShowPopup("Selamat datang " + userName + "!" );
    
    // Create text element for voice command instructions
    var s = "perintah<br><br>"
        + "\"Komputer?\"<br>"
        + "\"Sekarang jam berapa?\"<br>"
        + "\"Hari ini hari apa?\"<br>"
        + "\"Apa kabar?\"<br>"
        + "\"Keluar\"<br>";
    var text = app.CreateText(s, 0.9, 0.8, "Multiline,Html");
    text.SetTextSize(32);
    mainLayout.AddChild(text);
    
    // Speech recognition
    speech = app.CreateSpeechRec("NoBeep", "Partial", "id-ID"); // Set the language to Indonesian
    speech.SetOnResult(speech_OnResult);
    speech.SetOnError(speech_OnError);
    
    // AI Voice
    app.TextToSpeech("Katakan sesuatu untuk bertanya pada saya ", 1, 1, Listen);
    app.ShowProgress();
    // Menambahkan layout utama ke aplikasi
    app.AddLayout(mainLayout);
}

    function Listen() {
        app.HideProgress();
        speech.Recognize();
    }

// Function to handle speech recognition results
function speech_OnResult(results) {
    // Handle speech recognition results here
    var cmd = results[0].toLowerCase();
    
    // Watch for key phrases.
    if (cmd.indexOf("komputer") > -1) {
        app.TextToSpeech("Ya, Tuan?", 1, 1);
        Listen(); // Panggil Listen() setelah menerima hasil pengenalan ucapan
    } else if (cmd.indexOf("sekarang") > -1 && cmd.indexOf("jam") > -1) {
        app.TextToSpeech(GetTime(), 1, 1);
        Listen(); // Panggil Listen() setelah menerima hasil pengenalan ucapan
    } else if (cmd.indexOf("hari ini") > -1 && cmd.indexOf("hari") > -1) {
        app.TextToSpeech(GetDay(), 1, 1);
        Listen(); // Panggil Listen() setelah menerima hasil pengenalan ucapan
    } else if (cmd.indexOf("apa kabar") > -1) {
        app.TextToSpeech("Saya merasa baik", 1, 1);
        Listen(); // Panggil Listen() setelah menerima hasil pengenalan ucapan
    } else if (cmd.indexOf("keluar") > -1) {
        app.Exit();
    } else {
        speech.Recognize(); // Panggil pengenalan ucapan kembali jika tidak ada perintah yang cocok
    }
}
s

// Function to handle speech recognition errors
function speech_OnError(error) {
    console.log("Error" + error);

    // Restart recognition.
    if (!speech.IsListening()) speech.Recognize();
}

// untuk ambil data tanggal
// Get the current time.
function GetTime() {
    var d = new Date();
    return d.getHours() + " " + d.getMinutes();
}

// Get the current day.
function GetDay() {
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Minggu";
    weekday[1] = "Senin";
    weekday[2] = "Selasa";
    weekday[3] = "Rabu";
    weekday[4] = "Kamis";
    weekday[5] = "Jumat";
    weekday[6] = "Sabtu";
    return weekday[d.getDay()];
}
