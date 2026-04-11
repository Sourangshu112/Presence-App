module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // IMPORTANT: worklets plugin must come BEFORE reanimated plugin
      'react-native-worklets-core/plugin',
    ],
  };
};