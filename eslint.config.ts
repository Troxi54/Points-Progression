import antfu from "@antfu/eslint-config";

export default antfu({
  react: true,
  typescript: true,
  stylistic: false,
  rules: {
    "react/no-array-index-key": "off",
    "react/no-missing-key": "off",
    "react/set-state-in-effect": "off",
    "no-alert": "off",
  },
});
