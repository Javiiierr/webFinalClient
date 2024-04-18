import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SignUp() {
    const router = useRouter();
    const [user, setUser] = useState({ // user state to hold username and password
        username: "",
        password: ""
    })

    // called in handle submit to create errors
    const generateError = (err) => {
        alert(err) // generates a popup alert of the error
    }

    // called on sign up form submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents the default behaviour when submitting a form, allows for custom behaviour 
        try {
            const res = await fetch(`http://elegant-pear-coat.cyclic.app/register`, { // makes a POST request to http://localhost:8080/register to server/Controllers/AuthControllers register
                method: 'POST',                                         // this route will add a user to the mongoDB and create a jwt token
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user),
                credentials: 'include'
            });
            const data = await res.json();
            if (data) { // errors when username or password is missing
                if (data.errors) {
                    const { userName, password } = data.errors;
                    if (userName) generateError(userName);
                    else if (password) generateError(password)
                } else { // if no errors send user to home route
                    router.push("/");
                }
            }
        } catch (err) {
            console.log(err)
        }
    };

    // show sign up form and login link
    return (
        <Container className='login-box'>
            <h2>Sign Up</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
                    />
                </Form.Group>

                <Button style={{ height: '50px', width: '200px', fontSize: '25px' }} variant="primary" type="submit" className="continue-button">Sign Up</Button>
            </Form>
            <p>Already have an account? <Link href="../login"><span>Login</span></Link></p>
        </Container>
    );
}
