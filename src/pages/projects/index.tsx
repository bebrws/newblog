import { GetStaticProps } from "next";
import Layout from "../../components/Layout";
import BasicMeta from "../../components/meta/BasicMeta";
import OpenGraphMeta from "../../components/meta/OpenGraphMeta";
import ProjectList from "../../components/ProjectList";
import config from "../../lib/config";
import {
  countProjects,
  listProjectContent,
  ProjectContent,
} from "../../lib/projects";
import { countPosts, listPostContent, PostContent } from "../../lib/posts";
import { listTags, TagContent } from "../../lib/tags";
import React from "react";
import PostList from "../../components/PostList";

type Props = {
  posts: ProjectContent[];
  projects: ProjectContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index({ posts, projects, pagination }: Props) {
  const url = "/projects";
  const title = "All projects";
  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />

      {/* <PostList posts={posts} pagination={pagination} /> */}
      <ProjectList projects={projects} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = listProjectContent(1, config.posts_per_page);
  const projects = listProjectContent(1, config.posts_per_page);
  const pagination = {
    current: 1,
    pages: Math.ceil(countProjects() / config.posts_per_page),
  };
  return {
    props: {
      projects,
      posts,
      pagination,
    },
  };
};
