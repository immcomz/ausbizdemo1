// pages/api/submit-comment.ts
import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch"; // For making HTTP requests to WordPress

// Replace this with the actual endpoint or API for your WordPress comments
const WORDPRESS_API_URL = process.env.;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { postId, name, email, content } = req.body;

  // Ensure that required fields are provided
  if (!postId || !name || !email || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Prepare data for the WordPress comment API
    const data = {
      post: postId, // Post ID to associate the comment with
      author_name: name, // Comment author's name
      author_email: email, // Comment author's email
      content: content, // Comment content
    };

    // Make the request to WordPress to create a new comment
    const response = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_WORDPRESS_AUTH_TOKEN`, // Use your WordPress authentication token here
      },
      body: JSON.stringify(data),
    });

    // Check if the comment was successfully created
    if (response.ok) {
      return res.status(200).json({ message: "Comment submitted successfully" });
    } else {
      const errorData = await response.json();
      return res.status(response.status).json({ message: errorData.message });
    }
  } catch (error) {
    console.error("Error submitting comment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
