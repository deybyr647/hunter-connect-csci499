interface UserInterface {
    uid: string;
    email: string;
    bearerToken: string;
    name: {
        firstName: string;
        lastName: string;
    };
    preferences?: {
        academicYear: string;
        courses: string[] | null;
        interests: string[] | null;
        skills: string[] | null;
    };
}

const createUser = async (body: UserInterface) => {
    const {uid, email, bearerToken, name} = body;
    const {firstName, lastName} = name;

    const createUserRequest: RequestInit = {
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
        const req = await fetch('http://localhost:8080/api/users', createUserRequest);
        const json = await req.json();

        if (req.status === 200) {
            console.log(json);
            console.log("Successful POST data to backend");
        }
    }

    catch (error) {
        console.log(error);
    }
}

const updateUser = async (body: UserInterface) => {
    const {uid, email, bearerToken, name, preferences} = body;
    const {firstName, lastName} = name;

    const updateUserRequest: RequestInit = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            uid: uid,
            firstName: firstName,
            lastName: lastName,
            email: email,
            preferences: preferences
        }),
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-cache',
        redirect: 'follow',
        referrerPolicy: 'no-referrer-when-downgrade'
    };


    try {
        const req = await fetch('http://localhost:8080/api/users', updateUserRequest);
        const json = await req.json();

        if (req.status === 200) {
            console.log(json);
            console.log("Successful PUT data to backend");
        }
    }

    catch (error) {
        console.log(error);
    }
}

export { UserInterface, createUser, updateUser };

