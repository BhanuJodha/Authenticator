const form = document.querySelector("form");

const login = async (e) => {
    e.preventDefault();
    let formData = new FormData(document.querySelector("form"));
    let response = await fetch("/api/v1/user/sign-in", {
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST"
    })
    let data = await response.json();
    if (response.status === 200){
        document.cookie = `jwt-token=Bearer ${data.data.jwt}`;
        window.location.href = "/";
    }
    else {
        alert(data.message)
    }
}

form.addEventListener("submit", login);