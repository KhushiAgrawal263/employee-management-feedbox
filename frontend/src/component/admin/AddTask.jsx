import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import "./EmployeeDetail.css";

const AddTask = ({ props }) => {
  const todos = props.task;
  const id = props.id;
  console.log(props);
  const [value, setValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value) return;
    const newtask = {
      task: value,
    };
    try {
      const data = await fetch(`http://localhost:8000/updatetask/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newtask),
      });
      const res = await data.json();
      alert(JSON.stringify(res.message));
      window.location.href = "EmployeeDetails";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="todo">
      <p>Project Details</p>
      {todos &&
        todos.map((todo) => (
          <div>
            <table class="table">
              <tbody>
                <tr>
                  <td>{todo.task}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            type="text"
            className="todoIn"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Add new Project "
            required
          />
        </Form.Group>
        <Button variant="primary m-3" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AddTask;
