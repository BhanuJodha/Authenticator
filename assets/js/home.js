const form = document.querySelector("form");

const submitHandler = async (e) => {
    e.preventDefault();
    let jwt = $.cookie("jwt-token");
    $.ajax({
        url: "/api/v1/user/reset-password",
        method: "PUT",
        headers: {
            Authorization: jwt
        },
        data: $(form).serialize(),
        success: (data) => {
            alert(data.message)
        },
        error: (err) => {
            alert(JSON.parse(err.responseText).message)
        }
    })
}

form.onsubmit = submitHandler;