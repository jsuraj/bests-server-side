/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

function SEO({ title, description, ogUrl, imgUrl, meta, seriesName, sortedEpisodes }) {
  let jsonldArray = sortedEpisodes.map((episode) => {
    // prettier-ignore
    let partOfTVSeries = {
      '@type': 'TVSeries',
      name: seriesName
    };
    // prettier-ignore
    let partOfSeason = {
      '@type': 'TVSeason',
      seasonNumber: episode.season_number
    };
    // prettier-ignore
    return {
      '@context': 'http://schema.org',
      '@type': 'TVEpisode',
      partOfTVSeries: partOfTVSeries,
      name: episode.name,
      partOfSeason: partOfSeason,
      episodeNumber: episode.episode_number,
      image: 'https://bestseries-default.s3.us-east-2.amazonaws.com' + episode.still_path,
      aggregateRating: episode.vote_average,
      abstract: episode.overview
    };
  });

  let jsonldString = JSON.stringify(jsonldArray);

  return (
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonldString }}
      ></script>
    </Head>
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
};

export default SEO;
