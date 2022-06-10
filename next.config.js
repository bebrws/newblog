module.exports = {
  async rewrites() {
    return [
      {
        source: '/posts/alacritty',
        destination: '/projects/alacritty-tabs',
      },
      {
        source: '/posts/alacrittytabs',
        destination: '/projects/alacritty-tabs',
      },
      {
        source: '/posts/kubernetesaliasesfunctions',
        destination: '/posts/kubernetes-aliases-functions',
      },
      {
        source: '/posts/jsflatmapusage',
        destination: '/',
      },
      {
        source: '/posts/pythonlistcomprehensionsinjs',
      destination: '/posts/python-list-comp-js',
      },
      {
        source: '/posts/chromedevtools',
        destination: '/',
      },
      {
        source: '/posts/githubstats',
        destination: 'https://www.npmjs.com/package/githubrepostatistics',
      },
      {
        source: '/blog/2019/12/14/wireguard',
        destination: '/posts/wireguard',
      },
      {
        source: '/blog/2019/07/01/system-preferences-security-and-privacy-osx/',
        destination: '/',
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
