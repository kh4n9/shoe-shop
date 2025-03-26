"use client";

import { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        redirect: "follow",
      });
      if (response.ok) {
        alert("login successful");
      } else {
        alert("check your email or password");
      }
      if (response.redirected) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 w-1/2 mx-auto mt-10"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="rounded-md shadow-lg p-2 bg-gray-100"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="rounded-md shadow-lg p-2 bg-gray-100"
      />
      <button
        type="submit"
        className="bg-gray-100 rounded-md shadow-lg py-1 w-1/4 mx-auto"
      >
        login
      </button>
    </form>
  );
};
export default LoginForm;
