module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      'expo-router/babel',                  // Ye zaroori hai Expo Router ke liye
      'react-native-worklets/plugin',       // Agar Reanimated use kar rahe ho to ye last mein rakho
      // Agar upar wala error de to comment kar do aur sirf expo-router/babel rakho
    ],
  };
};