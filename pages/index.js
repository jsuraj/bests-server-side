import Head from 'next/head';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Layout from '../src/components/Layout';
import fetch from 'isomorphic-unfetch';
import { makeStyles } from '@material-ui/core/styles';
import SeriesCard from '../src/components/SeriesCard';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  cardHolder: {
    height: '100%',
  },
}));

export default function Index(props) {
  const { homePageSeries } = props;
  const classes = useStyles();
  let jsonldArray = homePageSeries.map((series) => {
    return {
      '@context': 'http://schema.org',
      '@type': 'TVSeries',
      name: series.name,
      abstract: series.overview,
    };
  });
  let jsonldString = JSON.stringify(jsonldArray);
  const title = 'Best Series';
  const description =
    'Checkout the best rated episodes of your favourite tv series aggregated from fans';
  const ogUrl = 'https://bestseries.app';
  const imgUrl =
    'https://bestseries-default.s3.us-east-2.amazonaws.com/efiX8iir6GEBWCD0uCFIi5NAyYA-thumb.jpg';
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imgUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ogUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content={imgUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="amphtml" href={`https://bestseries.app/amp/ampindex`}></link>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonldString }}
        ></script>
      </Head>
      <Layout>
        <Box p={1} className={classes.root}>
          {/* <SEO
        title="Best Series"
        description="Checkout the best rated episodes of your favourite tv series aggregated from fans"
        sortedEpisodes={[]}
      /> */}
          <Grid container spacing={1}>
            {homePageSeries.map((item) => (
              <Grid key={item.show_id} item xs={12} sm={4}>
                <div className={classes.cardHolder}>
                  <SeriesCard series={item} isSimilar={false} />
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Layout>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const response = await fetch('http://api.bestseries.app/getindexshows');
  const data = await response.json();
  const homePageSeries = data.map((s) => ({
    name: s.name,
    slug: s.slug,
    show_id: s.show_id,
    backdrop_path: s.backdrop_path,
    overview: s.overview,
  }));
  return {
    props: {
      homePageSeries,
    },
  };
}
