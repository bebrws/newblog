module.exports = {
  async redirects() {
    return [
      {
        source: '/posts/alacritty',
        destination: '/projects/alacritty-tabs',
        permanent: true,
      },
      {
        source: '/posts/alacrittytabs',
        destination: '/projects/alacritty-tabs',
        permanent: true,
      },
      {
        source: '/posts/kubernetesaliasesfunctions',
        destination: '/posts/kubernetes-aliases-functions',
        permanent: true,
      },
      {
        source: '/posts/jsflatmapusage',
        destination: '/',
        permanent: true,
      },
      {
        source: '/posts/pythonlistcomprehensionsinjs',
        destination: '/posts/python-list-comp-js',
        permanent: true,
      },
      {
        source: '/posts/chromedevtools',
        destination: '/',
        permanent: true,
      },
      {
        source: '/posts/githubstats',
        destination: 'https://www.npmjs.com/package/githubrepostatistics',
        permanent: true,
      },
      {
        source: '/blog/2019/12/14/wireguard',
        destination: '/posts/wireguard',
        permanent: true,
      },
      {
        source: '/blog/2019/12/14/wireguard/',
        destination: '/posts/wireguard',
        permanent: true,
      },
      {
        source: '/blog/2019/07/01/system-preferences-security-and-privacy-osx',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog/2019/07/01/system-preferences-security-and-privacy-osx/',
        destination: '/',
        permanent: true,
      },
    ]
  },
  pageExtensions: ["tsx"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      ...[
        {
          test: /\.yml$/,
          type: "json",
          use: "yaml-loader",
        },
        {
          test: /\.svg$/,
          use: "@svgr/webpack",
        },
      ]
    );
    return config;
  },
};
