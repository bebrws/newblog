import Link from 'next/link'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import SubjectIcon from '@material-ui/icons/Subject';
import MobileMediaQuery from './MobileMediaQuery'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
   listItemTextRoot: {
    maxWidth: 550,
  },
  listItemTextTypograhyRoot: {
    color: "#836688",
    fontWeight: "800",
  }
}));


export default function PostList({ posts }) {

  const classes = useStyles();


  if (posts === 'undefined') return null;

  // This is now done in index
  // posts.sort((x, y) => {
  //   const a = new Date(x.frontmatter.date);
  //   const b = new Date(y.frontmatter.date);
  //   if (a < b) return 1;
  //   if (a > b) return -1;
  //   return 0;
  // })

  return (
  <MobileMediaQuery 
    regular={(
      <List component="nav">
        {posts && posts.map((post) => {
          return (
            <Link key={post.slug} href={{ pathname: `/post/${post.slug}` }}>
              <ListItem button>
                <ListItemIcon>
                  <SubjectIcon />
                </ListItemIcon>
                <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                  <><ListItemText classes={{root: classes.listItemTextRoot}} primaryTypographyProps={{"data-text": post?.frontmatter?.title, className: "glitch", classes: {root: classes.listItemTextTypograhyRoot}}} >{post?.frontmatter?.title}</ListItemText><Divider /></>
                  <><ListItemText classes={{root: classes.listItemTextRoot}} primaryTypographyProps={{classes: {root: classes.listItemTextTypograhyRoot}}} style={{width: 100, maxWidth: 100}}>{post.frontmatter.date}</ListItemText></>
                </div>
              </ListItem>
            </Link>
          );
        })}
      </List>
    )}
    mobile={(
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
    )}
  />);
}
