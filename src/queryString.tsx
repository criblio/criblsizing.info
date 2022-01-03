// adapted from https://medium.com/swlh/using-react-hooks-to-sync-your-component-state-with-the-url-query-string-81ccdfcb174f
import {parse, stringify} from "query-string";

const setQueryStringWithoutPageReload = (qsValue: string) => {
    const newurl = window.location.protocol + "//" +
                   window.location.host +
                   window.location.pathname +
                   qsValue;

    // Replace state keeps browser history clean
    window.history.replaceState({ path: newurl }, "", newurl);
};

export const setQueryStringValue = (
   key: string,
   value: string,
   queryString: string = window.location.search
) => {
    const values = parse(queryString);
    const newQsValue = stringify({ ...values, [key]: value });
    setQueryStringWithoutPageReload(`?${newQsValue}`);
};

export const getQueryStringValue = (
    key: string,
    queryString: string = window.location.search
) => {
    const values = parse(queryString);

    // If the value is a number, parse and return it
    if (!isNaN(Number(values[key]))) {
        return Number(values[key])
    }

    return values[key];
};