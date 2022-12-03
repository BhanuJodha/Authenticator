const form = document.querySelector("form");

const verify = async (e) => {
    e.preventDefault();
    let formData = new FormData(document.querySelector("form"));
    let response = await fetch("/api/v1/user/verify", {
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST"
    })
    let data = await response.json();
    if (response.status === 202){
        alert(data.message);
        window.location.href = "/user/sign-in";
    }
    else {
        alert(data.message)
    }
}

form.addEventListener("submit", verify);