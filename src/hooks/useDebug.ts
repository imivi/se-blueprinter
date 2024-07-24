export function useDebug() {
    return window.location.search.includes("debug=true")
}