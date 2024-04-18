import "@/styles/globals.css";
import { CookiesProvider } from 'react-cookie';
import Layout from '../components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <Layout>
          <Component {...pageProps} />
      </Layout>
    </CookiesProvider>
  )
}