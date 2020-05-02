import Head from 'next/head';
import Layout from '../src/components/Layout';

export default function AboutPage() {
  const description =
    'Checkout the best rated episodes of your favourite tv series aggregated from fans';
  return (
    <div>
      <Layout>
        <>
          <Head>
            <title>Best Series | About</title>
            <meta name="description" content={description} />
          </Head>
          <h1>About</h1>
          <div>
            We aggregate user votes for tv episodes and list the as per rating. The data for tv
            shows is aggreated from :
          </div>
          <ul>
            <li>The Movie Database (TMDb)</li>
            <li>TheTVDB</li>
          </ul>
        </>
      </Layout>
    </div>
  );
}
