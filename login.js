// console.log('login page')

function login() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    if (username === "admin" && password === "admin123") {
        // alert('Successfully Logged In');
        window.location.assign('./dashboard.html')
    }
    else if (username != "admin") {
        alert("Invalid username");
        return;
    }
    else if (password != "admin123") {
        alert("Invalid Password");
        return;
    }
}