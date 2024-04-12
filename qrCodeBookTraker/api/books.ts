
export const getBookByISBN = async (isbn: string) => {
    const link = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn;
    console.log(link);
    const response = await fetch(link);
    //const response = require("../api/responseExample.json");
    return await response.json();
}