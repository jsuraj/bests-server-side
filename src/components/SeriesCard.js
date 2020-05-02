import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { imgPrefix } from '../utils/config';

// const s3_prefix = "https://bestseries-default.s3.us-east-2.amazonaws.com"
const useStyles = makeStyles({
  card: {
    // maxWidth: 345,
    height: '100%',
  },
  imgHolder: {
    // animation: "MuiSkeleton-keyframes-animate 1.5s ease-in-out infinite",
    // width: "auto",
    height: '200px',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  alink: {
    color: 'inherit',
    textDecoration: 'none',
  },
});

const SeriesCard = (props) => {
  const classes = useStyles();
  const matches = useMediaQuery('(min-width:800px)');

  const { isSimilar } = props;
  const { name, overview, backdrop_path, slug } = props.series;
  const image_path = backdrop_path ? imgPrefix + backdrop_path.split('.')[0] + '-thumb.jpg' : '';
  // const image_path = imgPrefix + "w500" + backdrop_path
  // const { loading } = props

  return (
    <Card className={classes.card}>
      <a
        href={`/series/${slug}`}
        className={classes.alink}
        style={{ color: 'inherit', textDecoration: 'none' }}
        target={isSimilar && matches ? '_blank' : ''}
      >
        <CardActionArea>
          {/* <div className={classes.imgHolder}></div> */}
          <CardMedia
            className={classes.imgHolder}
            component="img"
            alt={name}
            title={name}
            // height="140"
            image={image_path}
          />
          {/* <img src={image_path} className={classes.imgHolder} />
        </CardMedia> */}
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {name}
            </Typography>
            {/* <Typography variant="body2" color="textSecondary" component="p">
            {overview}
          </Typography> */}
          </CardContent>
        </CardActionArea>
      </a>
    </Card>
  );
};

export default SeriesCard;
