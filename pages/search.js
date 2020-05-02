import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import SeriesCard from '../src/components/SeriesCard';
import SeriesCardSkeleton from '../src/components/SeriesCardSkeleton';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'next/router';

import Layout from '../src/components/Layout';
// import SEO from '../components/seo';
import { baseUrl } from '../src/utils/config';

const browser = typeof window !== 'undefined' && window;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  cardHolder: {
    height: '100%',
  },
  formContainer: {
    position: 'relative',
    paddingBottom: '56.25%',
    paddingTop: '35px',
    height: 0,
    overflow: 'hidden',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
}));

const SearchResults = (props) => {
  // const router = useRouter();
  const [isSearching, setIsSearching] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const searchStr = props.router.asPath
    ? decodeURIComponent(props.router.asPath.split('=')[1])
    : '';
  // console.log(props.location.search);
  const [searchString, setSearchString] = useState(searchStr);
  const classes = useStyles();

  useEffect(() => {
    setIsSearching(true);
    let str = props.router.asPath ? decodeURIComponent(props.router.asPath.split('=')[1]) : '';
    axios
      .post(baseUrl + 'search', {
        searchString: str,
      })
      .then((response) => {
        console.log(response);
        setSearchResults(response.data);
        setIsSearching(false);
      })
      .catch((error) => {
        console.log(error);
        setSearchResults([]);
        setIsSearching(false);
      });
  }, [props.router.asPath]);

  const getPlaceholder = () => {
    let placeholder = [];
    for (let i = 0; i <= 21; i++) {
      placeholder.push(
        <Grid key={i} item xs={12} sm={4}>
          <SeriesCardSkeleton />
        </Grid>
      );
    }
    return placeholder;
  };
  return (
    browser && (
      <Layout searchQuery={searchString}>
        <h1>Search Results</h1>
        <Grid container spacing={1}>
          {/* {!searchResults && getPlaceholder()} */}
          {isSearching ? (
            getPlaceholder()
          ) : searchResults.length > 0 ? (
            searchResults.map((item) => (
              <Grid key={item.show_id} item xs={12} sm={4}>
                <div className={classes.cardHolder}>
                  <SeriesCard series={item} />
                </div>
              </Grid>
            ))
          ) : (
            <Box width="100%">
              <h3>No results found for {searchString}</h3>
              <div className={classes.formContainer}>
                <iframe
                  className={classes.iframe}
                  src="https://docs.google.com/forms/d/e/1FAIpQLSeW4h-dp55scHDlPfPSgVbtpNV-jYD3Nrwq7uG2LmR-gFFVIg/viewform?embedded=true"
                >
                  Loading…
                </iframe>
              </div>
            </Box>
          )}
        </Grid>
      </Layout>
    )
  );
};

export default withRouter(SearchResults);
