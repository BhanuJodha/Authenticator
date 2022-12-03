const form = document.querySelector("form");

const signUp = async (e) => {
    e.preventDefault();
    let formData = new FormData(document.querySelector("form"));
    let response = await fetch("/api/v1/user/sign-up", {
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST"
    })
    let data = await response.json();
    if (response.status === 201){
        window.location.href = "./verify/" + data.data.id;
    }
    else {
        alert(data.message)
    }
}

form.addEventListener("submit", signUp);