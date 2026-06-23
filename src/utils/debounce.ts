export function debounce<TArgs extends unknown[]>(
    callback: (...args: TArgs) => void,
    delay = 300
) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (...args: TArgs) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };
}