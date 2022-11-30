import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";


function MyForm() {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Login</Form.Label>
        <Form.Control type="login" placeholder="Enter login" name="login"/>

      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" name="password"/>
      </Form.Group>

      <Button variant="secondary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default MyForm;

