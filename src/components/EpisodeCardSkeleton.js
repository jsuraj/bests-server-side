import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

// import { imgPrefix } from "../config"

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
}));

function EpisodeCardSkeleton() {
  const classes = useStyles();
  return (
    <Card>
      <Grid container className={classes.cardRoot}>
        <Grid item xs={12} sm className={classes.mediaItem}>
          <Skeleton variant="rect" className={classes.media} width={300} height={170} />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs direction="column">
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                <Skeleton />
              </Typography>
              <Typography variant="body2">
                <Skeleton />
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
export default EpisodeCardSkeleton;
