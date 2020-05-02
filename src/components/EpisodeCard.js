import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';
// import StarBorderIcon from "@material-ui/icons"
import Icon from '@material-ui/core/Icon';
import LinkIcon from '@material-ui/icons/Link';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
// import axios from 'axios';

import { imgPrefix, baseUrl } from '../utils/config';
// import { isLoggedIn, getToken } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    flexGrow: 1,
    flexWrap: 'wrap',
  },
  media: {
    width: '100%',
    height: 'auto',
    minWidth: 300,
    minHeight: 170,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  mediaItem: {
    flex: 1,
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    minWidth: 300,
    minHeight: 170,
  },
  contentItem: {
    flex: 2,
  },
  linkedCard: {
    background: 'rgba(0, 0, 255, 0.1)',
  },
  linkIcon: {
    cursor: 'pointer',
  },
  episodeTitle: {
    fontSize: '2rem',
    padding: '0px',
    margin: '0px',
  },
}));

const EpisodeCard = (props) => {
  const { episode, showId, slug } = props;
  const image_path = episode.still_path ? imgPrefix + episode.still_path : '';
  // const image_path = imgPrefix + "w300" + episode.still_path
  const [rating, setRating] = useState(props.episodeRating);
  const [votecount, setVotecount] = useState(episode.vote_count);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setRating(props.episodeRating);
  }, [props.episodeRating]);

  const handleRatingChange = (event, newRating) => {
    setRating(newRating);
    console.log(episode.name);
    if (rating == 0) {
      let newVotecount = votecount + 1;
      setVotecount(newVotecount);
    }
    props.ratingChange(showId, episode.id, newRating);
    // let userLogged = isLoggedIn()
    // const token = getToken()
    // const rating = newRating * 2
    // if (userLogged) {
    //   axios
    //     .get(baseUrl + `rate/${showId}/${episode.id}/${rating}`, {
    //       auth: {
    //         username: token,
    //         password: "",
    //       },
    //     })
    //     .then(response => {})
    //     .catch(error => {
    //       console.log(error)
    //     })
    // } else {
    //   props.handleOpen()
    // }
  };

  const handleLinkClicked = (episode) => {
    let episodeUrl = 'https://bestseries.app/series/' + slug + '?eid=' + episode.id;
    const el = document.createElement('textarea');
    el.value = episodeUrl;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Card raised={props.linked} className={props.linked ? classes.linkedCard : ''}>
      <Grid container className={classes.cardRoot}>
        <Grid item xs={12} sm className={classes.mediaItem}>
          <CardMedia
            className={classes.media}
            component="img"
            alt={episode.name}
            title={episode.name}
            image={image_path}
            width={300}
            height={170}
          />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs direction="column">
            <CardContent>
              {/* <Typography variant="h3" component="h3"> */}
              {/* <Box fontWeight="fontWeightBold"> */}
              <h2 className={classes.episodeTitle}>
                {episode.name + ' '}
                <Tooltip title="Copy Link">
                  <LinkIcon
                    onClick={() => handleLinkClicked(episode)}
                    className={classes.linkIcon}
                  ></LinkIcon>
                  {/* <Icon onClick={() => handleLinkClicked(episode)} className={classes.linkIcon}>
                      link
                    </Icon> */}
                </Tooltip>
              </h2>
              {/* </Box> */}
              {/* </Typography> */}
              <Grid container spacing={2}>
                <Grid item>
                  <Typography component="h3">
                    <Box fontWeight="fontWeightMedium">
                      <Grid container>
                        <Grid item>{'Season: '}</Grid>
                        <Grid item>
                          {episode.season_number == 0 ? 'Special' : episode.season_number}
                        </Grid>
                      </Grid>
                      {/* {"Season: " +
                        (episode.season_number == 0
                          ? "Special"
                          : episode.season_number)} */}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography component="h3">
                    <Box fontWeight="fontWeightMedium">
                      <Grid container>
                        <Grid item>{'Episode: '}</Grid>
                        <Grid item>{episode.episode_number}</Grid>
                      </Grid>
                      {/* {"Episode: " + episode.episode_number} */}
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
              {/* {"Season: " +
                    (episode.season_number == 0
                      ? "Special"
                      : episode.season_number) +
                    " Episode: " +
                    episode.episode_number} */}
              <Typography component="h4">
                <Box fontWeight="fontWeightMedium">
                  Rating:{' '}
                  {episode.vote_average == 0 ? 'NA' : episode.vote_average.toFixed(2) + ' / 10'}
                </Box>
              </Typography>
              {!props.linked && (
                <React.Fragment>
                  <Typography gutterBottom component="h4">
                    <Box fontWeight="fontWeightMedium">Vote Count: {votecount}</Box>
                  </Typography>
                  <Grid container>
                    <Grid item>
                      <Typography component="h3">
                        <Box fontWeight="fontWeightBold">Rate the episode: </Box>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Rating
                        key={episode.id}
                        name={episode.name}
                        precision={0.5}
                        value={rating}
                        onChange={handleRatingChange}
                        // onChange={(event, newRating) => {
                        //   setRating(newRating)
                        // }}
                      />
                    </Grid>
                  </Grid>
                </React.Fragment>
              )}
              <Typography variant="body2" component="p">
                {episode.overview}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message="Link Copied"
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
    </Card>
  );
};

export default EpisodeCard;
