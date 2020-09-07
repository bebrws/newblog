import useMediaQuery from '@material-ui/core/useMediaQuery';


export default function MobileMediaQuery({mobile, regular}) {
  const matches = useMediaQuery('(max-width:1000px)');
  if (matches) {
    return mobile;
  } else {
    return regular;
  }
}
