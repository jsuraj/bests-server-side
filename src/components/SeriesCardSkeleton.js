import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

const SeriesCardSkeleton = () => {
  return (
    <Card>
      <CardActionArea>
        <Skeleton variant="rect" width="auto" height={200} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            <Skeleton />
          </Typography>
          {/* <Typography variant="body2" color="textSecondary" component="p">
                {overview}
              </Typography> */}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SeriesCardSkeleton;
