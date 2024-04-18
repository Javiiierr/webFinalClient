import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Container, Form, FormLabel } from 'react-bootstrap';

export default function Login() {
    const router = useRouter();
    const [user, setUser] = useState({ // user state to hold username and password
        username: "",
        password: ""
    })

    // called in handle submit to create errors
    const generateError = (err) => {
        alert(err) // generates a popup alert of the error
    }

    // called on login form submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents the default behaviour when submitting a form, allows for custom behaviour 
        try {
            const res = await fetch(`https://elegant-pear-coat.cyclic.app/login`, { // makes a POST request to http://localhost:8080/login to server/Controllers/AuthControllers login function
                method: 'POST',                                                     // this route will check the mongoDB for the username and password and create a jwt token if succeessful
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user),
                credentials: 'include'
            });
            const data = await res.json();
            if (data && data.token) {
                localStorage.setItem('jwt', data.token); // save jwt token to local storage
                router.push("/"); // if no errors send user to home route
            } else if (data.errors) { // errors when username is not found or password is wrong
                const { userName, password } = data.errors;
                if (userName) generateError(userName);
                else if (password) generateError(password);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // show login form and sign up link
    return (
        <Container className="login-box">
            <h2>Login</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
                    />
                </Form.Group>

                <Button style={{ height: '50px', width: '200px', fontSize: '25px' }} variant="primary" type="submit" className="continue-button">Continue</Button>
            </Form>
            <p>Don&apos;t have an account? <a href="../signup">Sign Up</a></p>
        </Container>
    );
}