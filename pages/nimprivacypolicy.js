import Layout from '@components/Layout'

const About = ({ title, description, ...props }) => {
  return (
    <>
      <Layout pageTitle={`Nim Privacy Policy`} description={description}>
        <h1 className="title">Nim And Bookmakr & History Search Privacy Policy</h1>

        <p>
        This privacy policy will help you understand what information we collect and use, which is nothing. When we refer to ” “we,” “our,” or “us” in this policy, we are referring to Brad Barrows.
        </p>
        <p>
        Effective date: August 20, 2020
        </p>

        <p>
        Information we collect and how we use it
        </p>
        <p>
        No information is collected
        </p>

        <p>
        Security
        </p>
        <p>
        There should be no security concerns inherit with the use of these extensions. The Nim extension will take terms searched for using the chrome omnibar though and inject javascript into the Nim documentation web page to search for those terms. But again, there should be no security concerns.
        </p>
        <p>The Bookmark & History extension will search your Bookmarks and History but only using the official Google API and no data is ever collected or transmitted anywhere.</p>
      </Layout>
    </>
  )
}

export default About

export async function getStaticProps() {
  const configData = await import(`../siteconfig.json`)

  return {
    props: {
      title: configData.default.title,
      description: configData.default.description,
    },
  }
}
