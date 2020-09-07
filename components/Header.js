import Link from 'next/link'
import MobileMediaQuery from './MobileMediaQuery'

export default function Header() {
  return (
    <>
      <MobileMediaQuery 
        mobile={(
          <header className="header" id="mobileHeader"> {/* ctyle={{display: "none"}}> */}
            <h2 style={{paddingLeft: "10px"}} className="title">Brad Barrows</h2>
            <nav className="nav" role="navigation" aria-label="main navigation">
              <Link href="github.com/bebrws">
                <a>Github</a>
              </Link>
              <Link href="linkedin.com/in/bbarrows">
                <a>LinkedIn</a>
              </Link>
            </nav>
          </header>)}
        regular={(
          <header className="header" id="normalHeader">
            <h1 style={{display: "block", width: "390px", paddingRight: "0", marginRight: "0"}} className="title"><Link href="/"><a style={{textDecoration: "none"}}>Brad Barrows</a></Link></h1>
            <nav style={{display: "block", borderLeft: "solid", paddingTop: "10px", paddingBottom: "10px"}}  className="nav" role="navigation" aria-label="main navigation">
              
              <a href={"https://github.com/bebrws"} style={{display: "block", paddingLeft: "10px"}}  >Github</a>

              <a href={"https://linkedin.com/in/bbarrows"} style={{display: "block", paddingLeft: "10px"}}  >LinkedIn</a>
              
            </nav>
          </header>
      )} />
      <style jsx>{`
        header {
          width: 100%;
          height: 100px;
          border-bottom: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        nav {
          width: calc(100% - 40px);
          max-width: 1200px;
          font-weight: bold;
          font-size: 1.3rem;
        }
        nav a {
          margin-right: 20px;
          color: #8ba8de;
          text-decoration: none;
        }
        nav a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}
