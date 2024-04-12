
export const getBookByISBN = async (isbn: string) => {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    const json = await response.json();
    return json;
}

const isbn10To13 = (isbn10: string) => {
    const isbn13 = "978" + isbn10;
    return isbn10;
}