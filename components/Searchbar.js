import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, FormControl, Button, InputGroup } from 'react-bootstrap';

export default function Searchbar() {
    const [gameName, setGameName] = useState(''); // holds the user search
    const router = useRouter();

    const search = (event) => {
        event.preventDefault(); // prevents the default behaviour when submitting a form, allows for custom behaviour 
        router.push(`/search/${gameName}`);
    };

    // search box form, onChange set state to whatever is in the text box
    return (
        <Form onSubmit={search}>
            <InputGroup>
                <FormControl type="text" placeholder="Search" value={gameName} onChange={(e) => setGameName(e.target.value)} />
                <Button type="submit">Search</Button>
            </InputGroup>
        </Form>
    );
}