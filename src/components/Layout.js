import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Icon from '@material-ui/core/Icon';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import Fab from '@material-ui/core/Fab';
import InputBase from '@material-ui/core/InputBase';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Zoom from '@material-ui/core/Zoom';
import NoSsr from '@material-ui/core/NoSsr';
import SvgIcon from '@material-ui/core/SvgIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles, fade, responsiveFontSizes } from '@material-ui/core/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { imgPrefix, baseUrl } from '../utils/config';
import { setUser, isLoggedIn, logout } from '../utils/utils';
import { initGA, logPageView } from '../utils/analytics';
// import Logo from '../images/television-white.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    marginRight: theme.spacing(2),
    width: 40,
    height: 40,
    [theme.breakpoints.down('xs')]: {
      width: 30,
      height: 30,
    },
  },
  title: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 15,
      paddingRight: 5,
    },
    // display: "none",
    // [theme.breakpoints.up("sm")]: {
    //   display: "block",
    // },
  },
  searchWrapper: {
    flexGrow: 1,
    paddingLeft: 5,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      width: theme.spacing(5),
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '120',
      padding: theme.spacing(1, 1, 1, 5),
      // "&:focus": {
      //   width: 200,
      // },
    },
  },
  typography: {
    padding: theme.spacing(2),
  },
  modalroot: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  paper: {
    position: 'absolute',
    width: 400,
    [theme.breakpoints.down('xs')]: {
      width: 250,
    },
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
  },
  shareFab: {
    position: 'relative',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1,
  },
  fabDiv: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const Layout = ({ children, searchQuery }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const inputEl = useRef();

  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userLogged, setuserLogged] = useState(false);
  const [modalMode, setModalMode] = useState('login');

  const classes = useStyles();
  const router = useRouter();

  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, searchQuery);

  useEffect(() => {
    if (isLoggedIn()) {
      setuserLogged(true);
    } else {
      setuserLogged(false);
    }
  }, []);

  useEffect(() => {
    // Your code here
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }, []);

  const handleChange = (event) => {
    let searchString = event.target.value;
    setSearchTerm(searchString);
    event.preventDefault();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setModalMode('login');
    setOpen(false);
  };

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const handleEmailChange = (event) => {
    const email = event.target.value;
    let validEmail = validateEmail(email);
    setEmail(email);
    if (!validEmail) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    // if (validEmail) {
    //   setEmail(email)
    // } else {
    //   setEmailError(true)
    // }
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setPassword(password);
    setLoginError('');
  };

  const handleLoginClick = () => {
    if (modalMode == 'login') {
      axios
        .get(baseUrl + 'api/login', {
          auth: {
            username: email,
            password: password,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            setUser(response.data);
            setOpen(false);
            setuserLogged(true);
          } else {
            setLoginError(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoginError('Invalid credentials');
        });
    } else {
      axios
        .post(
          baseUrl + 'api/signup',
          {
            email: email,
            password: password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status == 201) {
            setUser(response.data);
            setOpen(false);
            setuserLogged(true);
          } else {
            setLoginError(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoginError('Invalid credentials');
        });
    }
  };

  const handleKeyDown = (event) => {
    let searchString = event.target.value;
    if (event.keyCode == 13) {
      if (searchString.length >= 3) {
        setError(false);
        setSearchTerm(searchString);
        // navigate('/search?query=' + searchString.trim());
        router.push('/search?query=' + searchString.trim());
      } else {
        setError(true);
      }
    }
  };

  const handleLogout = () => {
    logout();
    setuserLogged(false);
  };

  const handleModeChange = () => {
    if (modalMode == 'login') {
      setModalMode('signup');
    } else {
      setModalMode('login');
    }
  };

  const childrenWithProps = React.Children.map(children, (child) =>
    React.cloneElement(child, {
      handleopen: handleOpen,
      userlogged: userLogged,
    })
  );

  return (
    <>
      <CssBaseline />
      <HideOnScroll>
        <AppBar position="sticky">
          <Toolbar>
            <Link href="/">
              <img src="/television-white.svg" className={classes.logo} alt="bestseries logo" />
            </Link>
            <Typography variant="h6" className={classes.title}>
              Best Series
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                id="search-input"
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                type="search"
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                inputRef={inputEl}
                error={error}
              />
            </div>
            <div className={classes.searchWrapper}></div>
            {userLogged ? (
              <Button color="inherit" variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" variant="outlined" onClick={handleOpen}>
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Modal open={open} onClose={handleClose}>
        <div style={modalStyle} className={classes.paper}>
          <Grid container direction="column" justify="center" alignItems="center">
            <h2>{modalMode == 'login' ? 'Login' : 'SignUp'}</h2>
            <form className={classes.modalroot} noValidate autoComplete="off">
              <TextField
                required
                label="Email id"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                helperText={emailError ? 'Invalid email' : ''}
              />
              <TextField
                required
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}
              />
            </form>
            <Button onClick={handleModeChange}>
              {modalMode == 'login' ? 'or SignUp' : 'or Login'}
            </Button>
            <p>{loginError}</p>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoginClick}
              disabled={emailError}
            >
              {modalMode == 'login' ? 'Login' : 'SignUp'}
            </Button>
          </Grid>
        </div>
      </Modal>
      <Container p={2}>
        {/* <main>{children}</main> */}
        <main>{childrenWithProps}</main>
        {/* <Fab color="primary" aria-label="share" className={classes.shareFab}>
          <Icon>share</Icon>
        </Fab> */}
      </Container>
      <footer>
        <Container p={2}>
          <a href="/about">About</a>
        </Container>
      </footer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Layout;
