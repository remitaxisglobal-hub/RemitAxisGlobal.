// ==========================================
// REMITAXISGLOBAL
// AUTH.JS — SPCK VERSION
// LOGIN + REGISTER + LOGOUT
// ==========================================

const AUTH_TOKEN = "remitaxisglobalToken";
const AUTH_USER = "remitaxisglobalAuthUser";
const USERS_KEY = "remitaxisglobalUsers";


// ==========================================
// GET USERS
// ==========================================

function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem(USERS_KEY)
        ) || [];

    } catch (error) {

        return [];

    }

}


// ==========================================
// SAVE USERS
// ==========================================

function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


// ==========================================
// REGISTER
// ==========================================

function registerUser() {

    const name =
        document.getElementById("registerName");

    const email =
        document.getElementById("registerEmail");

    const password =
        document.getElementById("registerPassword");

    const message =
        document.getElementById("registerMessage");


    if (!name || !email || !password) {

        alert("Registration form could not be found.");

        return;

    }


    const userName =
        name.value.trim();

    const userEmail =
        email.value.trim().toLowerCase();

    const userPassword =
        password.value;


    if (!userName) {

        showAuthMessage(
            message,
            "Please enter your name."
        );

        return;

    }


    if (!userEmail) {

        showAuthMessage(
            message,
            "Please enter your email."
        );

        return;

    }


    if (userPassword.length < 6) {

        showAuthMessage(
            message,
            "Password must be at least 6 characters."
        );

        return;

    }


    const users =
        getUsers();


    const existingUser =
        users.find(
            function(user) {

                return user.email === userEmail;

            }
        );


    if (existingUser) {

        showAuthMessage(
            message,
            "An account with this email already exists."
        );

        return;

    }


    const user = {

        id:
            "USER-" + Date.now(),

        name:
            userName,

        email:
            userEmail,

        password:
            userPassword,

        createdAt:
            new Date().toISOString()

    };


    users.push(user);

    saveUsers(users);


    showAuthMessage(
        message,
        "✓ Account created successfully!"
    );


    setTimeout(
        function() {

            window.location.href =
                "login.html";

        },
        800
    );

}


// ==========================================
// LOGIN
// ==========================================

function loginUser() {

    const email =
        document.getElementById("loginEmail");

    const password =
        document.getElementById("loginPassword");

    const message =
        document.getElementById("loginMessage");


    if (!email || !password) {

        alert("Login form could not be found.");

        return;

    }


    const userEmail =
        email.value.trim().toLowerCase();

    const userPassword =
        password.value;


    if (!userEmail) {

        showAuthMessage(
            message,
            "Please enter your email."
        );

        return;

    }


    if (!userPassword) {

        showAuthMessage(
            message,
            "Please enter your password."
        );

        return;

    }


    const users =
        getUsers();


    const user =
        users.find(
            function(account) {

                return (

                    account.email ===
                    userEmail

                );

            }
        );


    if (!user) {

        showAuthMessage(
            message,
            "Account not found. Please register first."
        );

        return;

    }


    if (
        user.password !==
        userPassword
    ) {

        showAuthMessage(
            message,
            "Incorrect password."
        );

        return;

    }


    // ======================================
    // CREATE LOGIN SESSION
    // ======================================

    const token =
        "RAG-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2);


    localStorage.setItem(
        AUTH_TOKEN,
        token
    );


    localStorage.setItem(

        AUTH_USER,

        JSON.stringify({

            id:
                user.id,

            name:
                user.name,

            email:
                user.email

        })

    );


    showAuthMessage(
        message,
        "✓ Login successful!"
    );


    setTimeout(
        function() {

            window.location.href =
                "dashboard.html";

        },
        500
    );

}


// ==========================================
// SHOW MESSAGE
// ==========================================

function showAuthMessage(
    element,
    message
) {

    if (element) {

        element.textContent =
            message;

    } else {

        alert(message);

    }

}


// ==========================================
// CHECK LOGIN
// ==========================================

function isLoggedIn() {

    return Boolean(
        localStorage.getItem(
            AUTH_TOKEN
        )
    );

}


// ==========================================
// GET CURRENT USER
// ==========================================

function getCurrentUser() {

    try {

        return JSON.parse(

            localStorage.getItem(
                AUTH_USER
            )

        ) || null;

    } catch {

        return null;

    }

}


// ==========================================
// REQUIRE LOGIN
// ==========================================

function requireLogin() {

    if (!isLoggedIn()) {

        window.location.href =
            "login.html";

        return false;

    }

    return true;

}


// ==========================================
// DISPLAY USER
// ==========================================

function displayAuthenticatedUser() {

    const user =
        getCurrentUser();


    if (!user) {

        return;

    }


    document
        .querySelectorAll(
            "[data-user-name]"
        )
        .forEach(
            function(element) {

                element.textContent =
                    user.name;

            }
        );


    document
        .querySelectorAll(
            "[data-user-email]"
        )
        .forEach(
            function(element) {

                element.textContent =
                    user.email;

            }
        );

}


// ==========================================
// LOGOUT
// ==========================================

function logoutUser() {

    localStorage.removeItem(
        AUTH_TOKEN
    );


    localStorage.removeItem(
        AUTH_USER
    );


    window.location.href =
        "login.html";

}


// ==========================================
// PAGE INITIALIZATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayAuthenticatedUser();

    }
);