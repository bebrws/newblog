import RSS from "rss";
// import * as util from 'util';

export default function generateRss(posts) {

  const feed = new RSS({
    title: "Brad Barrows' Blog",
    site_url: "https://bradbarrows.com",
    feed_url: "https://lbradbarrows.com/rss.xml",
  });

  // console.log(util.inspect(posts));

  posts.map((post) => {
    feed.item({
      title: post?.frontmatter?.title,
      guid: post.slug,
      url: `https://bradbarrows.com/posts/${post.slug}`,
      date: post?.frontmatter?.date,
      description: post?.markdownBody?.slice(0, Math.min(600, post?.markdownBody?.length)),
      author: post?.frontmatter?.author,
    });
  });

  const rss = feed.xml({ indent: true });
  return rss;
}