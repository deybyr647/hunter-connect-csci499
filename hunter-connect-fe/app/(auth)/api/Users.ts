interface postUserInterface {
    uid: string;
    email: string;
    bearerToken: string;
    name: {
        firstName: string;
        lastName: string;
    }
}

const postUser = async (body: postUserInterface) => {
    const {uid, email, bearerToken, name} = body;
    const {firstName, lastName} = name;

    const createUserConfig: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            uid: uid,
            firstName: firstName,
            lastName: lastName,
            email: email
        }),
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-cache',
        redirect: 'follow',
        referrerPolicy: 'no-referrer-when-downgrade'
    };


    try {
        const response = await fetch('http://localhost:8080/api/users', createUserConfig);
        const json = await response.json();

        if (response.status === 200) {
            console.log(json);
            console.log("Successfully posted data to backend");
        }
    }

    catch (error) {
        console.log(error);
    }
}

const updateUserData: RequestInit = {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json', // Content type of the body
        'Authorization': 'Bearer YOUR_AUTH_TOKEN', // Example for authorization
        'Accept': 'application/json' // Expected response content type
    },
    body: JSON.stringify({ // Request body, usually for POST/PUT requests
        name: 'John Doe',
        email: 'john.doe@example.com'
    }),
    mode: 'cors', // Request mode (cors, no-cors, same-origin)
    credentials: 'omit', // Credentials policy (omit, include, same-origin)
    cache: 'no-cache', // Cache policy (default, no-store, reload, no-cache, force-cache, only-if-cached)
    redirect: 'follow', // Redirect policy (manual, follow, error)
    referrerPolicy: 'no-referrer-when-downgrade' // Referrer policy
}

// Example usage with fetch
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data', fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

//fetchData();


export { postUserInterface, postUser };

