import React, { useState } from "react";
import "./Register.css";
import Header from "../Header/Header";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const register = async (e) => {
  e.preventDefault();

  if (!userName || !firstName || !lastName || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const res = await fetch(
      window.location.origin + "/djangoapp/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful! Please log in.");
      window.location.href = "/login";
    } else {
      alert(data.error || "Registration failed.");
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("Unable to connect to the server.");
  }
};

  return (
    <>
      <Header />

      <div className="register_panel">
        <h2>Register</h2>

        <form onSubmit={register}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter Username"
            />
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter First Name"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter Last Name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </div>

          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};

export default Register;
