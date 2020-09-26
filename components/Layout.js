import { useState, useEffect, useRef } from 'react';
import Head from 'next/head'
import Header from './Header'
import getPosts from '@utils/getPosts'

import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Link from 'next/link'

import {useSpring, animated} from 'react-spring'

import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

const MUIWrapper = ({children, sheets}) => {
  return sheets.collect(<ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>);
};


// popButtonRoot: {
//   minHeight: '60px',
//   display: "block",
//   backgroundColor: "#836688"
// },

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  popoverButtonCaptionText: {
    fontSize: "8px"
  },
  arrowIcon: {
    position: "relative",
    top: 6,
    width: 12
  }
}));

const posts = ((context) => {
  return getPosts(context)
})(require.context('../posts', true, /\.md$/))

const postsTitleAndSlug = posts.map((p) => { return {title: p.frontmatter.title, slug: p.slug} })

function fuzzyMatch(item, pattern, longestItemLength) {
  const str = item.title;

  let strIndex = 0
  let patIndex = 0
  let lastCharMatchedScore = 0
  let numInRow = 0
  let score = 0
  
  // console.log(`search ${str} ${str.length} on pattern ${pattern} : ${pattern.length}`);

  while (strIndex < str.length && patIndex < pattern.length) {
    let patternChar = pattern[patIndex].toLowerCase()
    let strChar     = str[strIndex].toLowerCase()

    // console.log("iteration of fuzzy: ", patternChar, strChar)
    if (strIndex == 0 && patternChar == strChar) {
      score += longestItemLength
      lastCharMatchedScore += 2
      patIndex += 1
      strIndex += 1
      numInRow += 1
    } else if (strChar == patternChar) {
      score += (longestItemLength/strIndex) * (numInRow ? (numInRow * 3) : 1)
      if (lastCharMatchedScore != 0) {
        lastCharMatchedScore += 2
        score += lastCharMatchedScore
      }
      numInRow += 1
      strIndex += 1
      patIndex += 1
    } else {
      numInRow = 0
      if (!['_', ' ', '.'].includes(strIndex)) {
        lastCharMatchedScore = 0
      }
      strIndex += 1
    }
  }

  return {
    score:   Math.max(0, score),
    matched: (score > 0),
    item
  }

}

// From https://material-ui.com/components/popover/
function FuzzySearchPopover({ }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isShown, setIsShown] = useState(false);
  const [postsShown, setPostsShown] = useState([]);
  const [sel, setSel] = useState(0);
  const [fuzzyText, setFuzzyText] = useState("");
  const buttonRef = useRef();
  const [springState, setSpringState] = useState(false);
  const springProps = useSpring({x: springState ? 1 : 0});
  const selectedPost = postsShown[Math.abs(sel) % postsShown.length];
  if (typeof window !== 'undefined') window.selectedPost = selectedPost;

  const handleFuzzySearchChange = (newSearchString) => {
    setFuzzyText(newSearchString);

    const longestItemLength = postsTitleAndSlug.reduce((acu, pts) => Math.max(acu, pts.title.length), 0);

    // Debug the fuzzy string search algorithm:
    // 
    // console.log("Fuzzy search scorest:")
    // postsTitleAndSlug.map((p) => fuzzyMatch(p, newSearchString, longestItemLength)).forEach((p) => {
    //   console.log(p.item.title + " " + p.score);
    // });

    const sortedPostsTitleAndSlug = postsTitleAndSlug.map((p) => fuzzyMatch(p, newSearchString, longestItemLength)).sort((a, b) => {
      if (a.score < b.score) return 1;
      if (a.score > b.score) return -1;
      return 0;
    }).map((scoredPost) => scoredPost.item)
    
    setPostsShown(sortedPostsTitleAndSlug);
  }

  React.useEffect(() => {

    handleFuzzySearchChange("");
    
    setInterval(() => {
      setSpringState(true);
      setTimeout(() => {
        setSpringState(false);
      }, 1000);
    }, 5000);

  }, []);

  if (typeof window !== 'undefined' && !window.popoverHandlerNotDefined) {
    window.popoverHandlerNotDefined = true;
    document.addEventListener('keydown', function(event) {
      // https://css-tricks.com/snippets/javascript/javascript-keycodes/
      // for event.which
      if (!('msgMeWindowOpen' in window && window.msgMeWindowOpen)) {
        if (event.which == 38) {
          if (typeof window !== 'undefined') {
            event.preventDefault()
            if (!window.sel) window.sel = 0;
            window.sel -= 1
            setSel(window.sel)
          }
        } else if (event.which == 40) {
          if (typeof window !== 'undefined') {
            event.preventDefault()
            if (!window.sel) window.sel = 0;
            window.sel += 1;
            setSel(window.sel)
          }
        } else if (event.which == 13) {
          if (typeof window !== 'undefined') {
            window.location.pathname = `/post/${window.selectedPost.slug}`
          }
        } else if (event.key == " ") {
          event.preventDefault()
          if (window.isShown) {  
            setAnchorEl(null);
            window.isShown = false;
          } else {
            setAnchorEl(buttonRef.current);
            window.isShown = true;
          }
        } 
      }
    });
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div style={{position: "fixed", top: "0", left: "50%"}}>
        <animated.div
          style={{
            transform: springProps.x
              .interpolate({
                range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
                output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1]
              })
              .interpolate(x => `scale(${x})`)
          }}
        >
          <Button ref={buttonRef} style={{minHeight: '60px', display: "block", backgroundColor: "#836688"}} aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
            <Typography variant="button" display="block" gutterBottom>
              Fuzzy Search
            </Typography>
            <Typography classes={{root: classes.popoverButtonCaptionText}} variant="caption" display="block" gutterBottom>
              (Press Spacebar)
            </Typography>
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Paper>
              <Grid style={{maxHeight: 600, width: 600, overflow: 'auto'}} container spacing={0} direction="column" justify="center" alignItems="center">
                <TextField autoFocus style={{ padding: "10px", marginTop: 20 }} id="filled-basic" label="Search"  value={fuzzyText} onChange={(event) => { handleFuzzySearchChange(event.target.value) }}/>
                <List component="nav" aria-label="main mailbox folders" style={{overflow: "scroll", height: 400, padding: 20}}>
                  {postsShown.map((p) => (
                    <ListItemText key={p.slug}>
                      { p.slug == selectedPost.slug && <ArrowForwardIosIcon classes={{root: classes.arrowIcon}}  />}
                      <Link href={{ pathname: `/post/${p.slug}` }}>
                        <a>{p.title}</a>
                      </Link>
                    </ListItemText>
                  ))}
                </List>
              </Grid>
            </Paper>
          </Popover>
        </animated.div>
    </div>
  );
}

export default function Layout({ children, pageTitle, description, ...props }) {
  const sheets = new ServerStyleSheets();
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    setWidth(window.innerWidth);
  });

  return (<>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="Description" content={description}></meta>
        <style id="jss-server-side">${sheets.toString()}</style>
        <title>{pageTitle}</title>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <script src="/static/layoutScript.js"/>
      </Head>

      {/* <link href="https://fonts.googleapis.com/css2?family=Inconsolata&display=swap" rel="stylesheet" /> */}
      {/* <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" /> */}
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@700&family=Roboto:wght@400;700;900&display=swap" rel="stylesheet"></link>


      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-154810525-2"></script>
      <script src="static/google.js" />


      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;800;900&display=swap');

        html,
        body {
          font-family: 'Inconsolata', monospace;
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
            sans-serif;
          color: #445566;
          background-color: #ede9d4;
        }

        h1 {
          font-weight: bolder;
          font-size: 3rem;
        }

        h2 {
          font-weight: bold;
          font-size: 2rem;
        }

        h3 {
          font-size: 1.5rem;
        }

        h4 {
          font-size: 1rem;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: 'Roboto', sans-serif;
          font-weight: bold;
          color: #b290b7;
        }

        pre {
          overflow: scroll;
          padding-left: 10px;
          padding-right: 10px;
          padding-top: 20px;
          padding-bottom: 20px;
          background: #80808024;
          color: #884b6f;
        }

        a {
          color: #452e47;
        }

        a:hover {
          color: #dcc2e0;
        }

        .content {
          padding: 2rem 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .content img {
          margin-top: 50px;
          margin-bottom: 50px;
          max-width: 800px;
        }

        #bottomImage {
          display: block;
          margin-left: auto;
          margin-right: auto;
          margin-top: 200px;
          margin-bottom: 100px;
          width: 80%;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          padding: 0 5px;
          height: 1rem;
        }

        .brain { 
          margin-left: auto;
          margin-right: auto;
          margin-top: 100px;
          margin-bottom: 100px;

          width: 200px;
          background-image: url(/static/JustBrain.svg); 
          background-repeat: no-repeat;
          background-position: left top; 
          padding-top:95px;
          margin-bottom:60px;
          animation-duration: 4s; 
          animation-fill-mode: both; 
          /* animation-timing-function: cubic-bezier(0.44, 0.4, 0, 1.54); */
       }

       .eye {
          background-image: url(/static/JustEye.svg); 
          background-repeat: no-repeat;
          background-position: left top; 
          position: relative;
          bottom: 50px;
          left: 59px;
          padding-top:95px;
          margin-bottom:60px;
          animation-duration: 4s; 
          animation-fill-mode: both; 
          /* animation-timing-function: cubic-bezier(0.44, 0.4, 0, 1.54); */
       }
       
       @keyframes bounce { 
          0%, 3%, 10%, 18%, 100% {transform: translateY(0);} 
          7% {transform: translateY(-30px);} 
          15% {transform: translateY(-15px);} 
       }
       
       .bounce { 
          animation-timing-function: cubic-bezier(.14, .75, .2, 1.01);
          animation-name: bounce; 
          animation-iteration-count: infinite;
       }

       #normalHeader {
         border-bottom: none;
       }

      `}</style>
      <MUIWrapper sheets={sheets}>
      <section className="layout">
        { width > 800 && <FuzzySearchPopover/> }
        <Header/>
        <div className="content"><div style={{width: (width > 1000 ? 800: "90%")}} className="innerContent">{children}</div></div>
      </section>
      <footer>
        © 2020 Bradley Barrows
      </footer>
    </MUIWrapper>
    </>
  )
}
