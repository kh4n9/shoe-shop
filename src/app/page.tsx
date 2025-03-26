"use client";

const Home = () => {
  const handleLogout = () => {
    try {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Home</h1>
      <button
        className="bg-gray-100 rounded-md shadow-lg py-1"
        onClick={handleLogout}
      >
        logout
      </button>
    </>
  );
};

export default Home;
