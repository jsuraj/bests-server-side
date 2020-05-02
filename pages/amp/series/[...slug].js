import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import { imgPrefix } from '../../../src/utils/config';

export const config = {
  amp: true,
};

function SeriesPageAmp(props) {
  const { show } = props;
  const shareString = `Checkout the best rated episodes of ${show.name} on #bestseriesapp @bestseriesapp.`;
  const { name } = show;
  const title = `Best ${name} Episodes | Best Series`;
  const description = `All episodes of ${show.name} series ranked based on ratings of thousands of viewers. Best rated episodes of ${show.name}.`;
  const ogUrl = `https://bestseries.app/amp/series/${show.slug}`;
  const imgUrl = `https://bestseries-default.s3.us-east-2.amazonaws.com${
    show.backdrop_path.split('.')[0]
  }-thumb.jpg`;

  let jsonldArray = show.sorted_episodes.map((episode) => {
    let partOfTVSeries = {
      '@type': 'TVSeries',
      name: name,
    };
    let partOfSeason = {
      '@type': 'TVSeason',
      seasonNumber: episode.season_number,
    };
    return {
      '@context': 'http://schema.org',
      '@type': 'TVEpisode',
      partOfTVSeries: partOfTVSeries,
      name: episode.name,
      partOfSeason: partOfSeason,
      episodeNumber: episode.episode_number,
      image: 'https://bestseries-default.s3.us-east-2.amazonaws.com' + episode.still_path,
      aggregateRating: episode.vote_average,
      abstract: episode.overview,
    };
  });
  let jsonldString = JSON.stringify(jsonldArray);
  // let jsonldString = '[';
  // jsonldArray.map((item) => {
  //   let str = JSON.stringify(item);
  //   jsonldString = jsonldString + str;
  //   return str;
  // });
  // jsonldString = jsonldString + ']';
  // console.log(jsonldString);
  // jsonldString.replace(/&quot;/g, '\\"');

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
        <link rel="canonical" href={`https://bestseries.app/series/${show.slug}`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content={imgUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonldString }}
        ></script>
        <script
          async
          custom-element="amp-analytics"
          src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
        ></script>
      </Head>
      <div className="mui-appbar">
        <a className="title-link" href="https://bestseries.app">
          <table width="100%">
            <tr>
              <td className="mui-appbar-height">
                <amp-img height="48" width="48" src="/bestseries57.png" layout="fixed"></amp-img>
              </td>

              <td className="mui--appbar-height">
                <h1 className="app-title">Best Series</h1>
              </td>
            </tr>
          </table>
        </a>
      </div>
      <amp-img
        height="200"
        className="backdrop-img"
        alt={show.name}
        src={`https://bestseries-default.s3.us-east-2.amazonaws.com${show.backdrop_path}`}
      ></amp-img>
      <div className="mui-container">
        <h1>{show.name}</h1>
        <h3>{`Best rated episodes of ${show.name}`}</h3>
      </div>
      <div className="mui-container">{show.overview}</div>
      <div>
        {/* <amp-social-share type="facebook"></amp-social-share> */}
        <div className="mui-container">
          <amp-social-share
            type="system"
            data-param-text={shareString}
            width="44"
            height="44"
          ></amp-social-share>
          <amp-social-share
            type="twitter"
            data-param-text={shareString}
            width="44"
            height="44"
          ></amp-social-share>
          <amp-social-share
            type="whatsapp"
            data-param-text={shareString}
            width="44"
            height="44"
          ></amp-social-share>
        </div>
        <div className="mui-container">
          {show.sorted_episodes.map((episode, i) => {
            return (
              <div className="mui--z2">
                <amp-img
                  alt={episode.name}
                  // className="episodecard-img"
                  height="200"
                  width="340"
                  src={`https://bestseries-default.s3.us-east-2.amazonaws.com${episode.still_path}`}
                  layout="responsive"
                ></amp-img>
                <h1 className="episode-title">{episode.name}</h1>
                <h3 className="episode-title">{`Season: ${
                  episode.season_number == 0 ? 'Special' : episode.season_number
                }  Episode:${episode.episode_number}`}</h3>
                <h4 className="episode-title">
                  {`Rating: ${
                    episode.vote_average == 0 ? 'NA' : episode.vote_average.toFixed(2) + ' / 10'
                  }`}
                </h4>
                <h4 className="episode-title">{`Vote Count: ${episode.vote_count}`}</h4>
                <div>{episode.overview}</div>
              </div>
            );
          })}
        </div>
        <div className="mui-container">
          {show.similar_present.map((series, i) => {
            return (
              <div className="mui--z2">
                <a href={`https://bestseries.app/amp/series/${series.slug}`}>
                  <amp-img
                    alt={series.name}
                    // className="episodecard-img"
                    height="200"
                    width="340"
                    src={`https://bestseries-default.s3.us-east-2.amazonaws.com${series.backdrop_path}`}
                    layout="responsive"
                  ></amp-img>
                  <h1 className="episode.title">{series.name}</h1>
                </a>
              </div>
            );
          })}
        </div>
        <amp-analytics type="gtag" data-credentials="include">
          <script
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: `
                {
                  "vars" : {
                    "gtag_id": "UA-112818171-5",
                    "config" : {
                      "UA-112818171-5": { "groups": "default" }
                    }
                  }
                }
              `,
            }}
          ></script>
        </amp-analytics>
      </div>
      <style jsx>{`
        @font-face {
          font-family: 'Roboto', sans-serif;
          src: url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
        }
        body {
          font-family: 'Roboto', sans-serif;
        }
        .mui--appbar-height {
          height: 56px;
        }
        .mui--appbar-min-height,
        .mui-appbar {
          min-height: 56px;
        }
        .mui--appbar-line-height {
          line-height: 56px;
        }
        .mui--appbar-top {
          top: 56px;
        }
        @media (orientation: landscape) and (max-height: 480px) {
          .mui--appbar-height {
            height: 48px;
          }
          .mui--appbar-min-height,
          .mui-appbar {
            min-height: 48px;
          }
          .mui--appbar-line-height {
            line-height: 48px;
          }
          .mui--appbar-top {
            top: 48px;
          }
        }
        @media (min-width: 480px) {
          .mui--appbar-height {
            height: 64px;
          }
          .mui--appbar-min-height,
          .mui-appbar {
            min-height: 64px;
          }
          .mui--appbar-line-height {
            line-height: 64px;
          }
          .mui--appbar-top {
            top: 64px;
          }
        }
        .mui-appbar {
          background-color: #3f51b5;
          color: #fff;
        }
        .mui-container {
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin-right: auto;
          margin-left: auto;
          padding-left: 15px;
          padding-right: 15px;
        }
        .mui-container:after,
        .mui-container:before {
          content: ' ';
          display: table;
        }
        .mui-container:after {
          clear: both;
        }
        @media (min-width: 544px) {
          .mui-container {
            max-width: 570px;
          }
        }
        @media (min-width: 768px) {
          .mui-container {
            max-width: 740px;
          }
        }
        @media (min-width: 992px) {
          .mui-container {
            max-width: 960px;
          }
        }
        @media (min-width: 1200px) {
          .mui-container {
            max-width: 1170px;
          }
        }
        .mui-container-fluid {
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin-right: auto;
          margin-left: auto;
          padding-left: 15px;
          padding-right: 15px;
        }
        .mui-container-fluid:after,
        .mui-container-fluid:before {
          content: ' ';
          display: table;
        }
        .mui-container-fluid:after {
          clear: both;
        }
        .mui--z2 {
          -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
          margin: 10px 0 10px 0;
          padding: 5px;
        }

        .app-title {
          margin: 0 0 0 0;
        }
        .episode-title {
          margin: 0 0 0 0;
        }
        .backdrop-img {
          width: 100vw;
        }
        .episodecard-img {
          max-width: '100%';
          max-width: '100%';
        }
        .title-link {
          text-decoration: none;
          color: inherit;
        }
      `}</style>
    </div>
  );
}

// export async function getStaticPaths() {
//   const response = await fetch('http://localhost:5000/getallslugs');
//   const slugList = await response.json();
//   const paths = slugList.map((series) => `/amp/series/${series.slug}`);
//   return {
//     paths,
//     fallback: false,
//   };
// }

export async function getServerSideProps({ params }) {
  const slug = params.slug;
  const response = await fetch(`http://api.bestseries.app/getshow/${slug}/1`);
  const data = await response.json();
  let show = data[0];
  // show.similar_present.map((series) => {
  //   let backdrop_path = series.backdrop_path
  //     ? imgPrefix + series.backdrop_path.split('.')[0] + '-thumb.jpg'
  //     : '';
  //   series.backdrop_path = backdrop_path;
  //   return {
  //     series,
  //   };
  // });
  return {
    props: {
      show: show,
    },
  };
}

export default SeriesPageAmp;
