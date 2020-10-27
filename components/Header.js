import { useState, useEffect, useRef } from 'react';
import Link from 'next/link'
import MobileMediaQuery from './MobileMediaQuery'

import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';


// From https://material-ui.com/components/popover/
function MessageMePopover({ }) {
  const [isShown, setIsShown] = useState(false);
  const [fromText, setFromText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    window.msgMeWindowOpen = false;
    setAnchorEl(null);
  };

  const handleClick = (e) => {
    window.msgMeWindowOpen = true;
    setAnchorEl(e.currentTarget);
    setIsShown(true);
  };

  const handleMessageSendClick = () => {
    setIsShown(false);
    fetch('https://8e1el5motj.execute-api.us-west-2.amazonaws.com/prod/', {
      method: 'post',
      body: JSON.stringify({message: `From: ${fromText} - ${bodyText}`})
    }).then((r) => {
      console.log(`The email was sent`);
    }).catch((e) => {
      // Swallowed hole
    });
  };  

  const handleClickAway = (e) => {
    setIsShown(false);
    handleClose();
  };

  const id = isShown ? 'msgme-popover' : undefined;

  return (
    <>
      <a style={{ paddingLeft: "10px", textDecoration: "none" }} onClick={handleClick} href={"#"}>Msg Me</a>   
      
        <Popover
          id={id}
          open={isShown}
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
          <ClickAwayListener onClickAway={handleClickAway}>
          <Paper>
            <Grid style={{height: 600, width: 600, overflow: 'auto'}} container spacing={0} direction="column" justify="center" alignItems="center">
              <Typography variant="h3" display="block">
                Message Me
              </Typography>
              <TextField autoFocus style={{ padding: "10px", width: 450 }} id="filled-basic" label="From"  value={fromText} onChange={(event) => { setFromText(event.target.value) }}/>
              <TextField multiline rows={12} autoFocus style={{ padding: "10px", width: 450, height: 300 }} id="filled-basic" label="Message Body"  value={bodyText} onChange={(event) => { setBodyText(event.target.value) }}/>
              <Button variant="contained" color="primary" onClick={handleMessageSendClick}>
                <Typography variant="button" display="block" gutterBottom>
                  Send Message
                </Typography>
              </Button>
            </Grid>
          </Paper>
          </ClickAwayListener>
        </Popover>
    </>
  );
}

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
            <h1 style={{}} className="title"><Link href="/"><a style={{textDecoration: "none"}}>Brad Barrows</a></Link></h1>
            <nav style={{borderLeft: "solid"}}  className="nav" role="navigation" aria-label="main navigation">
              <a href={"https://github.com/bebrws"} style={{display: "block", paddingLeft: "10px"}}  >Github</a>
              <a href={"https://linkedin.com/in/bbarrows"} style={{display: "block", paddingLeft: "10px"}}  >LinkedIn</a>
              <MessageMePopover />
            </nav>
          </header>
      )} />
      <style jsx>{`
        header {
          width: 600px;
          height: 100px;
          border-bottom: 1px solid #eaeaea;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 20px;
        }
        nav {
          font-weight: bold;
          font-size: 1.3rem;
        }
        nav a {
          margin-right: 20px;
          text-decoration: none;
        }
        nav a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}
