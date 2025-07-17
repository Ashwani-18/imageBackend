import React, { useState } from "react";
import axios from "axios";

const ResultPage = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to generate images.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://imagebackend-rk86.onrender.com/api/v1/image/generate-image",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setImage(response.data.image);
      } else {
        alert(response.data.message || "Image generation failed.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Unauthorized or error occurred. Check your login and token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Generate AI Image</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your image prompt"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </form>

      {image && (
        <div>
          <h3>Result:</h3>
          <img src={image} alt="Generated" width="512" height="512" />
        </div>
      )}
    </div>
  );
};

export default ResultPage;
