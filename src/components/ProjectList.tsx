import React from "react";
import { PostContent } from "../lib/posts";
import PostItem from "./PostItem";
import Pagination from "./Pagination";

type Props = {
  projects: PostContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function ProjectList({ projects, pagination }: Props) {
  return (
    <div className={"container"}>
      <div className={"posts"}>
        <ul className={"post-list"}>
          {projects.map((it, i) => (
            <li key={i}>
              <PostItem post={it} />
            </li>
          ))}
        </ul>
        <Pagination
          current={pagination.current}
          pages={pagination.pages}
          link={{
            href: (page) => (page === 1 ? "/posts" : "/posts/page/[page]"),
            as: (page) => (page === 1 ? null : "/posts/page/" + page),
          }}
        />
      </div>
      <style jsx>{`
        .container {
          display: flex;
          margin: 0 auto;
          max-width: 1200px;
          width: 100%;
          padding: 0 1.5rem;
        }
        ul {
          margin: 0;
          padding: 0;
        }
        li {
          list-style: none;
        }
        .posts {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
        }
        .posts li {
          margin-bottom: 1.5rem;
        }
        .post-list {
          flex: 1 0 auto;
        }
      `}</style>
    </div>
  );
}
