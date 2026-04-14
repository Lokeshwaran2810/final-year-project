/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                medical: {
                    green: "#0CA678",
                    blue: "#228BE6",
                    red: "#FA5252",
                    yellow: "#FAB005",
                    gray: "#F8F9FA",
                }
            }
        },
    },
    plugins: [],
}
