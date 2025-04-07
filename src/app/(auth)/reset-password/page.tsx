"use client";
import { useState } from "react";

const ResetPasswordPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const token = searchParams.token as string;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/auth/reset-password?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setSuccess("Mật khẩu đã được đặt lại");
      } else {
        setError("Đã xảy ra lỗi");
      }
    } catch (error) {
      console.error(error);
      setError("Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-4 w-1/2 bg-gray-200 p-4 rounded-md shadow-md"
      >
        <input
          className="w-full p-2 rounded-md shadow-md"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
        />
        <input
          className="w-full p-2 rounded-md shadow-md"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Nhập lại mật khẩu"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {loading ? "Đang đặt lại..." : "Đặt lại"}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
};

export default ResetPasswordPage;
