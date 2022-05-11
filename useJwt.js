const generateToken = async ({ url, email }) => {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    })
        .then((res) => res.json())
        .then((data) => {
            const token = data.accessToken;
            localStorage.setItem(email, token);
        });

};

export default generateToken;