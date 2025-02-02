import React from "react";
import { gql, wpApolloClient } from "@/utils/ApolloClient";
import { Card } from "@/components/ui/card"; // Import only what is available from Shadcn UI

// Combined GraphQL query to fetch post title and comments
const GET_PAGE_CONTENT_WITH_COMMENTS = gql`
  query GetPageContentWithComments {
    post(id: "/hello-world", idType: SLUG) {
      title
      comments {
        nodes {
          content
          author {
            node {
              name
            }
          }
          date
        }
      }
    }
  }
`;

export default async function Page() {
  const data = await wpApolloClient.query({
    query: GET_PAGE_CONTENT_WITH_COMMENTS, // Use the combined query
  });

  const { post } = data.data; // Extract the post and comments from the response

  return (
    <main className="p-8">
      {/* Post title */}
      <h1 className="text-4xl font-semibold mb-6">{post.title}</h1>

      {/* Display comments if they exist */}
      {post.comments?.nodes?.map((comment, index) => (
        <Card
          key={index}
          className="mb-6 p-6 shadow-lg border border-gray-200 rounded-lg"
        >
          {/* Comment Author */}
          <h3 className="text-lg font-semibold">
            {comment.author.node.name} says:
          </h3>

          {/* Render comment content safely as HTML */}
          <div
            className="mt-2 text-sm text-gray-700"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />

          {/* Divider */}
          <div className="my-4 border-t border-gray-300"></div>

          {/* Comment Date */}
          <p className="text-xs text-gray-500">
            {new Date(comment.date).toLocaleString()}
          </p>
        </Card>
      ))}
    </main>
  );
}
