/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // media 跟随系统
    content: [
        "./src/**/*.{html,js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {},
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px',
        },
    },
    plugins: [],
}