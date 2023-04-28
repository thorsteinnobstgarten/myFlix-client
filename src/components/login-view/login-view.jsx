import React from "react";
import { useState } from "react";
import {Form, Button, Card} from "react-bootstrap";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // validation of user login
  const handleSubmit = (event) => {
    // prevents the default behavior of the form which is to reload the entire page
    event.preventDefault();

    const data = {
      Username: username,
      Password: password
    };

    fetch("https://meineflix.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        onLoggedIn(data.user, data.token);
      } else {
        alert("No such user");
      }
    })
    .catch((e) => {
      alert("Something went wrong");
    });
  };

  return (
    <Card className="mt-2 mb-3">
        <Card.Body>
            <Card.Title >Login</Card.Title>
            <Form onSubmit={handleSubmit} >
                <Form.Group>
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        className="bg-light"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="bg-light"
                    />
                </Form.Group>
                <Button className="mt-3" variant="primary" type="submit">Submit</Button>
            </Form>
        </Card.Body>
    </Card>
);
};
