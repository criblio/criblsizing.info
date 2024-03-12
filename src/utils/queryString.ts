// adapted from https://medium.com/swlh/using-react-hooks-to-sync-your-component-state-with-the-url-query-string-81ccdfcb174f
import qs from "query-string";

const setQueryStringWithoutPageReload = (qsValue: string) => {
    const newUrl = window.location.protocol + "//" +
        window.location.host +
        window.location.pathname +
        qsValue;

    // Replace state keeps browser history clean
    window.history.replaceState({ path: newUrl }, "", newUrl);
};

export const setQueryStringValue = (
    key: string,
    value: string,
    queryString: string = window.location.search
) => {
    const values = qs.parse(queryString);
    const newQsValue = qs.stringify({ ...values, [key]: value });
    setQueryStringWithoutPageReload(`?${newQsValue}`);
};

export const getQueryStringValue = (
    key: string,
    queryString: string = window.location.search
) => {
    const values = qs.parse(queryString);

    // Handle boolean values
    if (values[key] === 'true') {
        return true
    } else if (values[key] === 'false') {
        return false
    }

    // If the value is a number, parse and return it
    if (!isNaN(Number(values[key]))) {
        return Number(values[key])
    }

    return values[key];
};
