import { useState } from "react";

export default function HomePage() {
    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    return (
        <>
            {loggedIn
                ? <h1>HEY LOGGED IN USER</h1>
                : <h1>You're not logged in</h1>
            }
        </>
    );
}