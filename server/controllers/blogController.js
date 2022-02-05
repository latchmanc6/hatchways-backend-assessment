const fetch = require("node-fetch");

// Ping server
exports.pingServer = function (req, res) {
  res.status(200).send({ success: true });
};

// Get blog posts
exports.getPosts = async function (req, res) {
  let { tags } = req.params;
  let { sortBy, direction } = req.query;
  const sortableCategories = ["id", "reads", "likes", "popularity"];
  tags = tags.split(",");

  // Hashmap will be used if there is more than 1 tag to store the data
  const postsMap = new Map();

  // If sortBy is not specified, give it a default value of "id"
  if (!sortBy) {
    sortBy = "id";
  }
  //If sortBy is not valid, send an error
  if (!sortableCategories.includes(sortBy)) {
    return res.status(400).send({ error: "Sort by parameter is invalid" });
  }

  // If direction is not specified, give it a default value of "asc"
  if (!direction) {
    direction = "asc";
  }
  // If direction is not valid, send an error
  if (direction !== "asc" && direction !== "desc") {
    return res.status(400).send({ error: "Direction parameter is invalid" });
  }

  // If there is only one tag, make the request right away
  if (tags.length === 1) {
    fetch(`https://api.hatchways.io/assessment/blog/posts?tag=${tags[0]}`)
      .then((response) => response.json())
      .then((data) => {
        sortPosts(data.posts, sortBy, direction);
        res.status(200).send(data);
      })
      .catch(() => {
        return res.status(400).send({ error: "Tags parameter is required" });
      });
  } else {
    // There is more than one tag
    await Promise.all(
      tags.map(async (tag) => {
        await fetch(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}`)
          .then((response) => response.json())
          .then((data) => {
            data.posts.forEach((post) => {
              postsMap.set(post.id, post);
            });
          })
          .catch(() => {
            return res
              .status(400)
              .send({ error: "Tags parameter is required" });
          });
      })
    );

    const posts = Array.from(postsMap.values());
    sortPosts(posts, sortBy, direction);

    return res.status(200).send({ posts });
  }
};

// Helper function: Sorts posts by post field and direction
function sortPosts(data, sortBy, direction) {
  if (direction === "asc") {
    data.sort((a, b) =>
      a[sortBy] > b[sortBy] ? 1 : b[sortBy] > a[sortBy] ? -1 : 0
    );
  } else {
    data.sort((a, b) =>
      a[sortBy] > b[sortBy] ? -1 : b[sortBy] > a[sortBy] ? 1 : 0
    );
  }
}
