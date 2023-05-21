import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../components/Layout";
import BasicMeta from "../components/meta/BasicMeta";
import OpenGraphMeta from "../components/meta/OpenGraphMeta";
import { SocialList } from "../components/SocialList";
import { listPostContent } from "../lib/posts";
import PostItem from "../components/PostItem";
import { GetStaticProps } from "next";

export default function Index({ posts }) {
  const router = useRouter();
  return (
    <Layout>
      <BasicMeta url={"/"} />
      <OpenGraphMeta url={"/"} />
      <div className="container">
        <div>
          <h1>
            Brad Barrows
            {/* <span className="fancy"></span> */}
          </h1>
          <h2>Projects and Notes</h2>
          <SocialList />
        </div>
      </div>
      <div className="recent-container">
        <div>
          <h2>
            Recent Blog Posts
          </h2>
          <div className={"posts"}>
            <ul className={"post-list"}>
              {posts.map((it, i) => (
                <li key={i}>
                  <PostItem post={it} />
                </li>
              ))}
            </ul>
            <Link href="/posts">
              <a
                className={
                  router.pathname.startsWith("/posts") ? "active" : null
                }
              >
                More posts
              </a>
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1 1 auto;
          padding: 0 1.5rem;
        }
        .recent-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1 1 auto;
          padding: 0 1.5rem;
          width: 60rem;
          margin-left: 200px;
        }        
        h1 {
          font-size: 2.5rem;
          margin: 0;
          font-weight: 500;
        }
        h2 {
          font-size: 1.75rem;
          font-weight: 400;
          line-height: 1.25;
        }
        .fancy {
          color: #15847d;
        }
        .handle {
          display: inline-block;
          margin-top: 0.275em;
          color: #9b9b9b;
          letter-spacing: 0.05em;
        }

        @media (min-width: 769px) {
          h1 {
            font-size: 3rem;
          }
          h2 {
            font-size: 2.25rem;
          }
        }
      `}</style>
    </Layout>
  );
}


export const getStaticProps: GetStaticProps = async () => {
  const posts = listPostContent(1, 5);
  return {
    props: {
      posts
    },
  };
};
