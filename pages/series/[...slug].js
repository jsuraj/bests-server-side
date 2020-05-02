import React, { useState, useEffect } from 'react';
import { withRouter } from 'next/router';
import Head from 'next/head';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  ThemeProvider,
  createMuiTheme,
  responsiveFontSizes,
  withStyles,
} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import ShareIcon from '@material-ui/icons/Share';
import CloseIcon from '@material-ui/icons/Close';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Zoom from '@material-ui/core/Zoom';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  RedditIcon,
  TelegramIcon,
} from 'react-share';
import fetch from 'isomorphic-unfetch';
import axios from 'axios';

import Layout from '../../src/components/Layout';
import EpisodeCard from '../../src/components/EpisodeCard';
import EpisodeCardSkeleton from '../../src/components/EpisodeCardSkeleton';
import SeriesCard from '../../src/components/SeriesCard';
import SeriesCardSkeleton from '../../src/components/SeriesCardSkeleton';
import Seo from '../../src/components/Seo';
import { baseUrl } from '../../src/utils/config';
import { isLoggedIn, getRatings, getToken, updateRatings } from '../../src/utils/utils';

function ScrollTop(props) {
  const { children, window, currPageUrl, shareString } = props;
  // const classes = useStyles()
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    console.log('sharing: ');
    console.log(props);
    if (navigator.share) {
      navigator
        .share({
          title: 'BestSeries',
          text: shareString,
          url: currPageUrl,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      const el = document.createElement('textarea');
      el.value = currPageUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      props.handleSnackBar();
    }
  };

  return (
    <Zoom in={trigger}>
      <div
        role="presentation"
        style={{
          position: 'fixed',
          bottom: theme.spacing(2),
          right: theme.spacing(2),
        }}
        // className={classes.fabDiv}
        onClick={handleClick}
      >
        {children}
      </div>
    </Zoom>
  );
}

let theme = createMuiTheme({
  // breakpoints: {
  //   values: {
  //     sm: 768,
  //     md: 991,
  //   },
  // },
});
theme = responsiveFontSizes(theme);

const useStyles = makeStyles((theme) => ({
  // const styles = (theme) => ({
  root: {
    flexGrow: 1,
    flex: '1 1 auto',
  },
  cardHolder: {
    width: '100%',
  },
  coverImg: {
    // backgroundImage:
    //   "url(" +
    //   "https://bestseries-default.s3.us-east-2.amazonaws.com" +
    //   show.backdrop_path +
    //   ")",
    margin: '0px -16px 0px -16px',
    [theme.breakpoints.up('sm')]: {
      backgroundAttachment: 'fixed',
      margin: '0px -32px 0px -32px',
    },
    height: '50vh',
    minHeight: '250px',
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'inset 0 0 500px 500px rgba(0,0,0,.3)',
  },
  coverTitle: {
    padding: '0px 10px 0px 10px',
    color: '#FFFFFF',
    textShadow: '0 0 20px #000',
    fontSize: '2.5rem',
    fontWeight: 700,
    // fontFamily: 'Roboto, Helvetica, Arial, serif',
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

function SeriesPage(props) {
  const { show } = props;
  const classes = useStyles();
  // const { classes } = props;

  const [loading, setLoading] = useState(true);
  const [seriesData, setSeriesData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  let [userLogged, setUserLogged] = useState(null);
  const [showRatings, setShowRatings] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [disableLoadMore, setDisableLoadMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [linkedEpisode, setLinkedEpisode] = useState({});

  const showId = show.show_id;
  const width = props.width;
  const currPageUrl = `https://bestseries.app${props.router.asPath}`;
  const shareString = `Checkout the best rated episodes of ${show.name} on #bestseriesapp @bestseriesapp.`;

  if (props.userlogged != userLogged) {
    setUserLogged(props.userlogged);
    let ratings = getRatings(showId);
    setShowRatings(ratings);
  }

  useEffect(() => {
    setSeriesData(show);
    // setLoading(false);
    const argArr = props.router.asPath.split('?');
    const eidArr = argArr.length > 1 ? argArr[1].split('=') : [];
    const eid = eidArr.length > 2 ? eidArr[1] : '';
    // console.log(argArr);
    if (argArr.length > 1 && eidArr[0] == 'eid') {
      const eid = argArr[1].split('=')[1];
      axios
        .get(baseUrl + `getepisode/${show.slug}/${eid}`)
        .then((response) => {
          setLinkedEpisode(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setLinkedEpisode([]);
          setLoading(false);
          console.log(error);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const loadMoreEpisodes = () => {
    setLoadingMore(true);
    let newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    axios
      .get(baseUrl + `getshow/${show.slug}/${newPageNumber}`)
      .then((response) => {
        if (response.status == 200) {
          let newData = response.data[0];
          if (newData['sorted_episodes'].length == 0) {
            setDisableLoadMore(true);
            setLoadingMore(false);
            return;
          }
          const tempSeriesData = { ...seriesData };
          newData.sorted_episodes.forEach((episode) => {
            tempSeriesData['sorted_episodes'].push(episode);
          });
          // console.log(tempSeriesData)
          setLoadingMore(false);
          setSeriesData(tempSeriesData);
        }
        // setLoading(false)
      })
      .catch((error) => {
        console.log(error);
        setLoadingMore(false);
        // setLoading(false)
      });
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleRatingChange = (showId, episodeId, newRating) => {
    // setRating(newRating)
    // console.log(episode.name)
    let userLogged = isLoggedIn();
    const token = getToken();
    const rating = newRating * 2;
    if (userLogged) {
      axios
        .get(baseUrl + `rate/${showId}/${episodeId}/${rating}`, {
          auth: {
            username: token,
            password: '',
          },
        })
        .then((response) => {
          updateRatings();
          // let vote_average = response.data.vote_average
          // let vote_count = response.data.vote_count
          // let updatedSeriesData = seriesData
          // let updatedEpisodes = seriesData.sorted_episodes.map(episode => {
          //   if (episode.id == episodeId) {
          //     episode.vote_count = vote_count
          //     episode.vote_average = vote_average
          //   }
          //   return episode
          // })
          // updatedSeriesData.sorted_episodes = updatedEpisodes
          // setSeriesData(updatedSeriesData)
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      props.handleopen();
    }
  };

  const getPlaceholder = () => {
    let placeholder = [];
    for (let i = 0; i <= 20; i++) {
      placeholder.push(
        <Box key={i} item xs={12} sm={12} className={classes.cardHolder} p={1}>
          <Grid key={i} item xs={12} sm={12} className={classes.cardHolder}>
            <EpisodeCardSkeleton />
          </Grid>
        </Box>
      );
    }
    return placeholder;
  };

  const getSimilarPlaceholder = () => {
    let placeholder = [];
    for (let i = 0; i <= 20; i++) {
      placeholder.push(
        <Box key={i} item xs={12} sm={12} className={classes.cardHolder} p={2}>
          <Grid key={i} item xs={12} sm={12} className={classes.cardHolder}>
            <SeriesCardSkeleton />
          </Grid>
        </Box>
      );
    }
    return placeholder;
  };

  const getLinkedEpisode = () => {
    // const queryFields = queryString.parse(props.location.hash)
    // const argArr = props ? props.router.asPath.split('?') : [];
    // console.log(argArr);
    // const eidArr = argArr.length > 0 ? argArr[1].split('=') : [];
    // const eid = eidArr[1];
    if (loading) {
      return null;
    } else {
      if (Object.keys(linkedEpisode).length === 0) {
        return null;
      } else {
        return (
          <Box xs={12} p={1} id={linkedEpisode.id}>
            <EpisodeCard episode={linkedEpisode} slug={show.slug} linked={true} />
          </Box>
        );
      }
    }
  };

  return (
    // <Layout>
    <>
      <Seo
        title={'Best ' + show.name + ' Episodes | Best Series'}
        description={`All episodes of ${show.name} series ranked based on ratings of thousands of viewers. Best rated episodes of ${show.name}.`}
        imgUrl={
          'https://bestseries-default.s3.us-east-2.amazonaws.com' +
          show.backdrop_path.split('.')[0] +
          '-thumb.jpg'
        }
        seriesName={show.name}
        sortedEpisodes={show.sorted_episodes}
        ogUrl={`https://bestseries.app/series/${show.slug}`}
      />
      <Head>
        <link rel="amphtml" href={`https://bestseries.app/amp/series/${show.slug}`}></link>
      </Head>
      <div
        className={classes.coverImg}
        style={{
          backgroundImage:
            'url(' +
            'https://bestseries-default.s3.us-east-2.amazonaws.com' +
            show.backdrop_path +
            ')',
        }}
        alt={show.name}
        title={show.name}
      >
        <Box>
          <h1 className={classes.coverTitle}>{`The BEST rated Episodes of ${show.name}`}</h1>
          {/* <Typography variant="h2" component="h2" className={classes.coverTitle}>
            <Box fontWeight="fontWeightBold">{show.name}</Box>
          </Typography>
          <Typography component="h5" className={classes.coverTitle}>
            Best rated episodes of {show.name}
          </Typography> */}
        </Box>
      </div>
      <Box p={0} className={classes.root}>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={12} sm={12} md={8} spacing={1}>
            <Box mt={2}>
              <Grid container xs={12} spacing={1}>
                <Grid item>
                  <Typography component="h4">
                    <Box fontWeight="fontWeightBold">Share: </Box>
                  </Typography>
                </Grid>
                <Grid item>
                  <FacebookShareButton url={currPageUrl} quote={shareString}>
                    <FacebookIcon size={32} />
                  </FacebookShareButton>
                </Grid>
                <Grid item>
                  <TwitterShareButton url={currPageUrl} title={shareString}>
                    <TwitterIcon size={32} />
                  </TwitterShareButton>
                </Grid>
                <Grid item>
                  <RedditShareButton url={currPageUrl} title={shareString}>
                    <RedditIcon size={32} />
                  </RedditShareButton>
                </Grid>
                <Grid item>
                  <TelegramShareButton url={currPageUrl} title={shareString}>
                    <TelegramIcon size={32} />
                  </TelegramShareButton>
                </Grid>
              </Grid>
            </Box>
            <Grid item container xs={12} p={2}>
              <Box my={1}>
                <Typography component="p">{show.overview}</Typography>
              </Box>
            </Grid>
            {getLinkedEpisode()}
            {loading
              ? getPlaceholder()
              : seriesData.sorted_episodes.map((episode, i) => {
                  let episodeRating = 0;
                  if (showRatings) {
                    let ratedEpisode =
                      showRatings.length == 0
                        ? []
                        : showRatings.episodes.filter((item) => item.eid == episode.id);
                    episodeRating = ratedEpisode.length == 0 ? 0 : ratedEpisode[0].rating;
                  }
                  return (
                    <Box
                      key={i}
                      // item
                      xs={12}
                      className={classes.cardHolder}
                      p={1}
                    >
                      <Grid item xs={12} className={classes.cardHolder}>
                        <div className={classes.cardHolder}>
                          <EpisodeCard
                            linked={false}
                            episode={episode}
                            showId={showId}
                            slug={show.slug}
                            ratingChange={handleRatingChange}
                            // handleOpen={props.handleOpen}
                            episodeRating={episodeRating / 2}
                            // showRatings={showRatings}
                          />
                        </div>
                      </Grid>
                    </Box>
                  );
                })}
            <Grid container xs={12} p={2} justify="center" alignItems="center">
              {loadingMore ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={loadMoreEpisodes}
                  disabled={disableLoadMore}
                >
                  Load More
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={4} spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h3" component="h3">
                <Box fontWeight="fontWeightMedium">Similar Shows</Box>
              </Typography>
            </Grid>
            {loading
              ? getSimilarPlaceholder()
              : seriesData.similar_present.map((item, i) => (
                  <Box key={i} item xs={12} p={2}>
                    <Grid key={i} item xs={12}>
                      <SeriesCard series={item} isSimilar={true} />
                    </Grid>
                  </Box>
                ))}
          </Grid>
        </Grid>
      </Box>
      <ScrollTop currPageUrl={currPageUrl} shareString={shareString} handleSnackBar={handleClick}>
        <Fab color="primary" aria-label="share" className={classes.shareFab}>
          <ShareIcon />
        </Fab>
      </ScrollTop>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message="Copied link"
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
    </>
  );
}

// export async function getStaticPaths() {
//   const response = await fetch('http://localhost:5000/getallslugs');
//   const slugsList = await response.json();
//   const paths = slugsList.map((series) => `/series/${series.slug}`);
//   return {
//     paths,
//     fallback: false,
//   };
// }

export async function getServerSideProps({ params }) {
  const slug = params.slug;
  // console.log('SeriesPage: getStaticProps: slug: ' + slug);
  const response = await fetch(`http://api.bestseries.app/getshow/${slug}/1`);
  const data = await response.json();
  return {
    props: {
      show: data[0],
    },
  };
}
// const SeriesPagewithStyles = withStyles(styles)(SeriesPage);
const SeriesPageWithLayout = (props) => {
  return (
    <Layout>
      <SeriesPage {...props} />
    </Layout>
  );
};
export default withRouter(SeriesPageWithLayout);
