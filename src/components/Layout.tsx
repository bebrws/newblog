import Head from "next/head";
import Navigation from "./Navigation";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <div className="root">
      <Head>
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
          function loadBevySnake() {
            setTimeout(function() {
            var element = document.getElementById('bevy-portal');
                  if (element) {
                    console.log('Element with id "bevy-portal" exists. Adding script tag.');

                  var script = document.createElement('script');
                  script.type = 'module';
                  script.src = '../static/load-bevy-snake.js';
                  document.head.appendChild(script);
            } else {
                    console.log('Element with id "bevy-portal" does not exist.');
                    loadBevySnake();
            }
          }, 500);
        }

        loadBevySnake();
      ` }}></script>
        <script type="text/javascript" src="https://www.googletagmanager.com/gtag/js?id=UA-154810525-2"></script>
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-154810525-2');
        ` }}></script>
        <script type="text/javascript" src="https://www.googletagmanager.com/gtag/js?id=G-BZKS5D8HPF"></script>
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BZKS5D8HPF');
        ` }}></script>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#fff" />
      </Head>
      <nav>
        <Navigation />
      </nav>
      <main>{children}</main>
      <style jsx>
        {`
          .root {
            display: block;
            padding: 4rem 0;
            box-sizing: border-box;
            height: 100%;
          }
          main {
            display: flex;
            min-height: 100%;
            flex-direction: column;
          }
          @media (min-width: 769px) {
            .root {
              display: flex;
              flex: 1 0 auto;
            }
            main {
              flex: 1 0 auto;
            }
          }
        `}
      </style>
    </div>
  );
}
