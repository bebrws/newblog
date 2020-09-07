---
title: 'Building this blog'
author: 'Brad Barrows'
date: '2020-6-6'
# hero_image: ../static/niceday.png
---

# Introduction

I just followed [this site](https://www.netlify.com/blog/2020/05/04/building-a-markdown-blog-with-next-9.4-and-netlify/) and used their Github repo as a base

## Sorting posts

Modified PostList.js to sort the posts with this change:

```
import Link from 'next/link'

export default function PostList({ posts }) {
  posts.sort((x, y) => {
    const a = new Date(x);
    const b = new Date(y);
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
  })
  if (posts === 'undefined') return null

  return (
    <div>
      {!posts && <div>No posts!</div>}
      <ul>
        {posts &&
          posts.map((post) => {
            return (
              <li key={post.slug}>
                <p style={{marginTop:"4px", marginBottom: "2px"}}>{post.frontmatter.date}: {` `}</p>
                <Link href={{ pathname: `/post/${post.slug}` }}>
                  <a>{post?.frontmatter?.title}</a>
                </Link>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

```

