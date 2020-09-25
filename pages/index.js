import Layout from '@components/Layout'
import PostList from '@components/PostList'
import getPosts from '@utils/getPosts'



const Index = ({ posts, title, description, ...props }) => {
  return (
    <>
      <Layout pageTitle={title} description={description}>
        <h2>
          Thoughts And Notes:
        </h2>

        <div id="brain" className="brain">
         <div id="eye" className="bounce eye"></div>
        </div>
        
        <main>
          <PostList posts={posts} />
        </main>
        {/* <h4>
          Some kind of day
        </h4> */}
        <div style={{marginTop: 40}}>
          <img id="bottomImage" src="/static/bigsurf.png" alt="A beautiful surf photo I took" ></img>
        </div>
      </Layout>
      <style jsx>{`
        .title {
          margin: 1rem auto;
          font-size: 3rem;
        }
      `}</style>
    </>
  )
}


export default Index

export async function getStaticProps() {
  const configData = await import(`../siteconfig.json`)

  const posts = ((context) => {
    return getPosts(context)
  })(require.context('../posts', true, /\.md$/))

  return {
    props: {
      posts,
      title: configData.default.title,
      description: configData.default.description,
    },
  }
}
