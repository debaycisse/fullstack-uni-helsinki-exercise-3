module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
	"node": true
    },
    "extends": 'plugin:react/recommended',
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
            "modules": true
        }
    },
    "rules": {
        "indent": [
            "error",
                4
        ],
        "linebreak-style": [
            "error",
                "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "eqeqeq": "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "arrow-spacing": [
            "error",
            {
                "before": true,
                "after": true
            }
        ],
        "no-console": 0,
    },
}
