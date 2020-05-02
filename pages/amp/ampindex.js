import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import { imgPrefix } from '../../src/utils/config';

export const config = {
  amp: true,
};

function IndexPageAmp(props) {
  const { homePageSeries } = props;
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
        <link rel="canonical" href={`https://bestseries.app`} />
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
      </div>
      <div>
        <div className="mui-container">
          {homePageSeries.map((series, i) => {
            return (
              <div className="mui--z2">
                <a href={`https://bestseries.app/amp/series/${series.slug}`}>
                  <amp-img
                    alt={series.name}
                    // className="episodecard-img"
                    height="200"
                    width="340"
                    src={series.backdrop_path}
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
      `}</style>
    </div>
  );
}

// export async function getStaticPaths() {
//   const paths = ['/amp'];
//   return {
//     paths,
//     fallback: false,
//   };
// }

export async function getStaticProps({ params }) {
  const response = await fetch(`http://api.bestseries.app/getindexshows`);
  const data = await response.json();
  const homePageSeries = data.map((s) => ({
    name: s.name,
    slug: s.slug,
    show_id: s.show_id,
    backdrop_path: s.backdrop_path ? imgPrefix + s.backdrop_path.split('.')[0] + '-thumb.jpg' : '',
  }));
  return {
    props: {
      homePageSeries,
    },
  };
}

export default IndexPageAmp;
