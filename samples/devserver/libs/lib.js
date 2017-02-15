import $ from 'jquery';

export const hello = (who) => {
    console.log(`Hello ${who}`);
    $('body').prepend($(`<h1>Hello from ${who}</h1>`))
};
